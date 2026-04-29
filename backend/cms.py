"""
Internal CMS module: auth (JWT) + blog post CRUD + Cloudinary uploads.
Mounted on the same FastAPI app as the storefront. All routes under /api/*.
"""
from __future__ import annotations

import csv
import io
import os
import re
import secrets
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, List, Optional

import bcrypt
import cloudinary
import cloudinary.uploader
import jwt
from bson import ObjectId
from fastapi import APIRouter, Depends, File, HTTPException, Request, Response, UploadFile, status
from pydantic import BaseModel, EmailStr, Field

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_TTL_MIN = 60 * 8  # 8h — internal CMS, comfortable session length
REFRESH_TOKEN_TTL_DAYS = 7
LOCKOUT_THRESHOLD = 5
LOCKOUT_WINDOW_MIN = 15

router = APIRouter(prefix="/api")


# ---------------- Pydantic models ----------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str


class BlogPostBase(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    slug: str = Field(min_length=1, max_length=200)
    seo_title: Optional[str] = ""
    meta_description: Optional[str] = ""
    author: str = Field(min_length=1, max_length=120)
    publish_date: str = Field(min_length=1)  # ISO date "YYYY-MM-DD"
    featured_image_url: Optional[str] = ""
    body_html: str = ""
    tags: List[str] = []
    status: str = Field(default="draft")  # "draft" | "published"


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None
    author: Optional[str] = None
    publish_date: Optional[str] = None
    featured_image_url: Optional[str] = None
    body_html: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None


class BlogPostOut(BlogPostBase):
    id: str
    created_at: str
    updated_at: str


# ---------------- Helpers ----------------
def _slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9\s-]", "", value)
    value = re.sub(r"[\s-]+", "-", value)
    return value.strip("-")[:120] or f"post-{int(time.time())}"


def _hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def _jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def _create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_TTL_MIN),
        "type": "access",
    }
    return jwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)


def _create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_TTL_DAYS),
        "type": "refresh",
    }
    return jwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)


def _set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    # secure=True is required for SameSite=None on browsers, but cross-origin
    # cookies don't work without it. For our preview/prod (HTTPS only) this is fine.
    response.set_cookie(
        "access_token", access,
        httponly=True, secure=True, samesite="lax",
        max_age=ACCESS_TOKEN_TTL_MIN * 60, path="/",
    )
    response.set_cookie(
        "refresh_token", refresh,
        httponly=True, secure=True, samesite="lax",
        max_age=REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60, path="/",
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


def _doc_to_post_out(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "title": doc.get("title", ""),
        "slug": doc.get("slug", ""),
        "seo_title": doc.get("seo_title", "") or "",
        "meta_description": doc.get("meta_description", "") or "",
        "author": doc.get("author", ""),
        "publish_date": doc.get("publish_date", ""),
        "featured_image_url": doc.get("featured_image_url", "") or "",
        "body_html": doc.get("body_html", ""),
        "tags": doc.get("tags", []) or [],
        "status": doc.get("status", "draft"),
        "created_at": doc.get("created_at", ""),
        "updated_at": doc.get("updated_at", ""),
    }


# ---------------- Database accessor ----------------
# The main server.py will inject the Motor db handle.
_db: Any = None


def init(db) -> None:
    global _db
    _db = db
    cloudinary.config(
        cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
        api_key=os.environ.get("CLOUDINARY_API_KEY"),
        api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
        secure=True,
    )


def _db_or_raise():
    if _db is None:
        raise RuntimeError("CMS module not initialized — call cms.init(db) at startup")
    return _db


# ---------------- Auth dependency ----------------
async def get_current_user(request: Request) -> dict:
    db = _db_or_raise()
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, _jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------------- Brute-force protection ----------------
async def _brute_force_guard(identifier: str) -> None:
    db = _db_or_raise()
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=LOCKOUT_WINDOW_MIN)
    rec = await db.login_attempts.find_one({"identifier": identifier})
    if rec and rec.get("count", 0) >= LOCKOUT_THRESHOLD:
        last = rec.get("last_attempt")
        if isinstance(last, datetime) and last >= cutoff:
            raise HTTPException(
                status_code=429,
                detail=f"Too many failed login attempts. Try again in {LOCKOUT_WINDOW_MIN} minutes.",
            )


async def _record_failed_login(identifier: str) -> None:
    db = _db_or_raise()
    await db.login_attempts.update_one(
        {"identifier": identifier},
        {"$inc": {"count": 1}, "$set": {"last_attempt": datetime.now(timezone.utc)}},
        upsert=True,
    )


async def _clear_login_attempts(identifier: str) -> None:
    db = _db_or_raise()
    await db.login_attempts.delete_one({"identifier": identifier})


# ---------------- Auth routes ----------------
@router.post("/auth/login")
async def login(payload: LoginRequest, request: Request, response: Response):
    db = _db_or_raise()
    email = payload.email.lower().strip()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"

    await _brute_force_guard(identifier)
    user = await db.users.find_one({"email": email})
    if not user or not _verify_password(payload.password, user.get("password_hash", "")):
        await _record_failed_login(identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await _clear_login_attempts(identifier)
    user_id = str(user["_id"])
    access = _create_access_token(user_id, email)
    refresh = _create_refresh_token(user_id)
    _set_auth_cookies(response, access, refresh)
    return {
        "id": user_id,
        "email": email,
        "name": user.get("name", ""),
        "role": user.get("role", "admin"),
    }


@router.post("/auth/logout")
async def logout(response: Response):
    _clear_auth_cookies(response)
    return {"ok": True}


@router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return {
        "id": user["_id"],
        "email": user.get("email", ""),
        "name": user.get("name", ""),
        "role": user.get("role", "admin"),
    }


@router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    db = _db_or_raise()
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, _jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = _create_access_token(str(user["_id"]), user.get("email", ""))
        response.set_cookie(
            "access_token", access,
            httponly=True, secure=True, samesite="lax",
            max_age=ACCESS_TOKEN_TTL_MIN * 60, path="/",
        )
        return {"ok": True}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


# ---------------- Public blog routes ----------------
@router.get("/blog/posts")
async def list_published_posts():
    db = _db_or_raise()
    cursor = db.blog_posts.find({"status": "published"}).sort("publish_date", -1)
    docs = await cursor.to_list(length=500)
    return {"posts": [_doc_to_post_out(d) for d in docs]}


@router.get("/blog/posts/{slug}")
async def get_published_post(slug: str):
    db = _db_or_raise()
    doc = await db.blog_posts.find_one({"slug": slug, "status": "published"})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    return _doc_to_post_out(doc)


# ---------------- Admin blog routes ----------------
@router.get("/admin/posts")
async def list_all_posts(_: dict = Depends(require_admin)):
    db = _db_or_raise()
    cursor = db.blog_posts.find({}).sort("updated_at", -1)
    docs = await cursor.to_list(length=1000)
    return {"posts": [_doc_to_post_out(d) for d in docs]}


@router.get("/admin/posts/{post_id}")
async def get_post_admin(post_id: str, _: dict = Depends(require_admin)):
    db = _db_or_raise()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post id")
    doc = await db.blog_posts.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    return _doc_to_post_out(doc)


@router.post("/admin/posts", status_code=201)
async def create_post(payload: BlogPostCreate, user: dict = Depends(require_admin)):
    db = _db_or_raise()
    slug = _slugify(payload.slug or payload.title)
    if await db.blog_posts.find_one({"slug": slug}):
        raise HTTPException(status_code=409, detail="A post with this slug already exists")
    if payload.status not in ("draft", "published"):
        raise HTTPException(status_code=400, detail="status must be 'draft' or 'published'")

    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "title": payload.title.strip(),
        "slug": slug,
        "seo_title": (payload.seo_title or "").strip(),
        "meta_description": (payload.meta_description or "").strip(),
        "author": payload.author.strip(),
        "publish_date": payload.publish_date,
        "featured_image_url": (payload.featured_image_url or "").strip(),
        "body_html": payload.body_html or "",
        "tags": [t.strip() for t in (payload.tags or []) if t.strip()],
        "status": payload.status,
        "created_by": user["_id"],
        "created_at": now,
        "updated_at": now,
    }
    result = await db.blog_posts.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _doc_to_post_out(doc)


@router.put("/admin/posts/{post_id}")
async def update_post(post_id: str, payload: BlogPostUpdate, _: dict = Depends(require_admin)):
    db = _db_or_raise()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post id")

    existing = await db.blog_posts.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")

    update: dict = {}
    data = payload.model_dump(exclude_unset=True)
    if "slug" in data and data["slug"]:
        new_slug = _slugify(data["slug"])
        if new_slug != existing.get("slug"):
            clash = await db.blog_posts.find_one({"slug": new_slug, "_id": {"$ne": oid}})
            if clash:
                raise HTTPException(status_code=409, detail="A post with this slug already exists")
        update["slug"] = new_slug
    if "title" in data and data["title"]:
        update["title"] = data["title"].strip()
    if "seo_title" in data:
        update["seo_title"] = (data["seo_title"] or "").strip()
    if "meta_description" in data:
        update["meta_description"] = (data["meta_description"] or "").strip()
    if "author" in data and data["author"]:
        update["author"] = data["author"].strip()
    if "publish_date" in data and data["publish_date"]:
        update["publish_date"] = data["publish_date"]
    if "featured_image_url" in data:
        update["featured_image_url"] = (data["featured_image_url"] or "").strip()
    if "body_html" in data:
        update["body_html"] = data["body_html"] or ""
    if "tags" in data:
        update["tags"] = [t.strip() for t in (data["tags"] or []) if t.strip()]
    if "status" in data and data["status"]:
        if data["status"] not in ("draft", "published"):
            raise HTTPException(status_code=400, detail="status must be 'draft' or 'published'")
        update["status"] = data["status"]

    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.blog_posts.update_one({"_id": oid}, {"$set": update})
    doc = await db.blog_posts.find_one({"_id": oid})
    return _doc_to_post_out(doc)


@router.delete("/admin/posts/{post_id}")
async def delete_post(post_id: str, _: dict = Depends(require_admin)):
    db = _db_or_raise()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post id")
    result = await db.blog_posts.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"ok": True}


@router.post("/admin/posts/{post_id}/publish")
async def publish_post(post_id: str, _: dict = Depends(require_admin)):
    db = _db_or_raise()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post id")
    now = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.update_one(
        {"_id": oid}, {"$set": {"status": "published", "updated_at": now}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    doc = await db.blog_posts.find_one({"_id": oid})
    return _doc_to_post_out(doc)


@router.post("/admin/posts/{post_id}/unpublish")
async def unpublish_post(post_id: str, _: dict = Depends(require_admin)):
    db = _db_or_raise()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post id")
    now = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.update_one(
        {"_id": oid}, {"$set": {"status": "draft", "updated_at": now}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    doc = await db.blog_posts.find_one({"_id": oid})
    return _doc_to_post_out(doc)


# ---------------- Cloudinary upload ----------------
@router.post("/admin/upload")
async def upload_image(file: UploadFile = File(...), _: dict = Depends(require_admin)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are allowed")
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 10MB)")
    try:
        result = cloudinary.uploader.upload(
            contents,
            folder="posts",
            resource_type="image",
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Cloudinary upload failed: {e}")
    return {
        "url": result.get("secure_url"),
        "public_id": result.get("public_id"),
        "width": result.get("width"),
        "height": result.get("height"),
        "format": result.get("format"),
    }


# ---------------- Startup: indexes, admin seed, blog seed ----------------
async def ensure_indexes(db) -> None:
    await db.users.create_index("email", unique=True)
    await db.blog_posts.create_index("slug", unique=True)
    await db.blog_posts.create_index("status")
    await db.blog_posts.create_index([("publish_date", -1)])
    await db.login_attempts.create_index("identifier")


async def seed_admin(db) -> None:
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": _hash_password(admin_password),
            "name": "Greenline Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not _verify_password(admin_password, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": _hash_password(admin_password)}},
        )


def _csv_date_to_iso(value: str) -> str:
    """Convert M/D/YYYY → YYYY-MM-DD. Falls back to the raw string."""
    try:
        m, d, y = value.strip().split("/")
        return f"{int(y):04d}-{int(m):02d}-{int(d):02d}"
    except Exception:
        return value


def _slug_from_url(url: str) -> str:
    return url.rstrip("/").split("/")[-1]


async def seed_blog_posts_from_csv(db, csv_path: Path) -> int:
    """Seed blog posts from the CSV if the collection has fewer than 12 posts.
    Returns the number of inserted posts.
    """
    existing_count = await db.blog_posts.count_documents({})
    if existing_count >= 1:
        return 0
    if not csv_path.exists():
        return 0

    inserted = 0
    now = datetime.now(timezone.utc).isoformat()
    with csv_path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            slug = _slug_from_url(row.get("POST_URL", ""))
            if not slug:
                continue
            if await db.blog_posts.find_one({"slug": slug}):
                continue
            tags_raw = row.get("TAGS", "") or ""
            tags = [t.strip() for t in tags_raw.split(",") if t.strip()]
            doc = {
                "title": row.get("TITLE", "").strip(),
                "slug": slug,
                "seo_title": row.get("SEO_TITLE", "").strip(),
                "meta_description": row.get("META_DESCRIPTION", "").strip(),
                "author": row.get("AUTHOR", "").strip() or "Greenline",
                "publish_date": _csv_date_to_iso(row.get("PUBLISH_DATE", "")),
                "featured_image_url": (row.get("FEATURED_IMAGE", "") or "").strip(),
                "body_html": row.get("POST_BODY", ""),
                "tags": tags,
                "status": "published",
                "created_at": now,
                "updated_at": now,
            }
            await db.blog_posts.insert_one(doc)
            inserted += 1
    return inserted
