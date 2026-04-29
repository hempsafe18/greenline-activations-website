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
import uuid
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


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8, max_length=200)


class SeoSuggestRequest(BaseModel):
    title: str = Field(default="", max_length=300)
    body_html: str = Field(min_length=1)


class OutlineRequest(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    audience: Optional[str] = ""
    tone: Optional[str] = ""


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=200)
    name: str = Field(min_length=1, max_length=120)
    role: str = Field(default="author")  # admin | editor | author


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = Field(default=None, min_length=8, max_length=200)


class MarkdownImportRequest(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    slug: Optional[str] = ""
    author: Optional[str] = ""
    publish_date: Optional[str] = ""
    tags: List[str] = []
    markdown: str = Field(min_length=1)


class ScheduleRequest(BaseModel):
    scheduled_for: str = Field(min_length=1)  # ISO datetime


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
    status: str = Field(default="draft")  # "draft" | "published" | "scheduled"
    scheduled_for: Optional[str] = ""  # ISO datetime when status="scheduled"


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
    scheduled_for: Optional[str] = None


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
    """Issue session cookies. SameSite + Domain are env-controlled so the same
    code works in dev (host-only, SameSite=Lax) and prod across subdomains
    (Domain=.example.com, SameSite=None + Secure).
    """
    samesite = os.environ.get("COOKIE_SAMESITE", "lax").lower()  # "lax" | "none"
    domain = os.environ.get("COOKIE_DOMAIN") or None
    common = dict(
        httponly=True,
        secure=True,
        samesite=samesite,
        path="/",
    )
    if domain:
        common["domain"] = domain
    response.set_cookie("access_token", access, max_age=ACCESS_TOKEN_TTL_MIN * 60, **common)
    response.set_cookie("refresh_token", refresh, max_age=REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60, **common)


def _clear_auth_cookies(response: Response) -> None:
    domain = os.environ.get("COOKIE_DOMAIN") or None
    response.delete_cookie("access_token", path="/", domain=domain)
    response.delete_cookie("refresh_token", path="/", domain=domain)


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
        "scheduled_for": doc.get("scheduled_for", "") or "",
        "created_by": doc.get("created_by", "") or "",
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


# Roles
ROLES = ("admin", "editor", "author")


def _is_admin(user: dict) -> bool:
    return user.get("role") == "admin"


def _can_publish(user: dict) -> bool:
    return user.get("role") in ("admin", "editor")


async def require_staff(user: dict = Depends(get_current_user)) -> dict:
    """Any signed-in CMS user (admin/editor/author)."""
    if user.get("role") not in ROLES:
        raise HTTPException(status_code=403, detail="Staff access required")
    return user


async def require_publisher(user: dict = Depends(get_current_user)) -> dict:
    """Editor or admin."""
    if user.get("role") not in ("admin", "editor"):
        raise HTTPException(status_code=403, detail="Editor or admin access required")
    return user


async def _assert_can_mutate_post(user: dict, post_doc: dict) -> None:
    """Authors can only mutate posts they created. Editors/admins can mutate anything."""
    if _can_publish(user):
        return
    if str(post_doc.get("created_by", "")) != str(user.get("_id", "")):
        raise HTTPException(status_code=403, detail="You can only modify your own posts")


# ---------------- Brute-force protection ----------------
def _client_ip(request: Request) -> str:
    """Real client IP: prefer X-Forwarded-For (first hop) so the brute-force
    counter is consistent across replicas behind an ingress.
    """
    fwd = request.headers.get("x-forwarded-for", "")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def _brute_force_guard(identifier: str) -> None:
    db = _db_or_raise()
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=LOCKOUT_WINDOW_MIN)
    rec = await db.login_attempts.find_one({"identifier": identifier})
    if rec and rec.get("count", 0) >= LOCKOUT_THRESHOLD:
        last = rec.get("last_attempt")
        # Motor returns naive datetimes; coerce to UTC-aware for comparison.
        if isinstance(last, datetime):
            if last.tzinfo is None:
                last = last.replace(tzinfo=timezone.utc)
            if last >= cutoff:
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
    ip = _client_ip(request)
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
        samesite = os.environ.get("COOKIE_SAMESITE", "lax").lower()
        domain = os.environ.get("COOKIE_DOMAIN") or None
        kwargs = dict(httponly=True, secure=True, samesite=samesite,
                      max_age=ACCESS_TOKEN_TTL_MIN * 60, path="/")
        if domain:
            kwargs["domain"] = domain
        response.set_cookie("access_token", access, **kwargs)
        return {"ok": True}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.post("/auth/change-password")
async def change_password(
    payload: ChangePasswordRequest,
    response: Response,
    user: dict = Depends(get_current_user),
):
    """Allow the signed-in user to rotate their own password.
    On success the existing session cookies are reissued so the user
    stays logged in with a fresh access token.
    """
    db = _db_or_raise()
    fresh = await db.users.find_one({"_id": ObjectId(user["_id"])})
    if not fresh:
        raise HTTPException(status_code=401, detail="User not found")
    if not _verify_password(payload.current_password, fresh.get("password_hash", "")):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if payload.current_password == payload.new_password:
        raise HTTPException(status_code=400, detail="New password must be different from current password")

    await db.users.update_one(
        {"_id": fresh["_id"]},
        {"$set": {
            "password_hash": _hash_password(payload.new_password),
            "password_changed_at": datetime.now(timezone.utc).isoformat(),
        }},
    )

    user_id = str(fresh["_id"])
    access = _create_access_token(user_id, fresh.get("email", ""))
    refresh_tok = _create_refresh_token(user_id)
    _set_auth_cookies(response, access, refresh_tok)
    return {"ok": True}


async def _promote_due_scheduled(db) -> int:
    """Flip any 'scheduled' posts whose `scheduled_for` is past to 'published'.
    Returns the number of promotions. Cheap; safe to call from any read path.
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.update_many(
        {"status": "scheduled", "scheduled_for": {"$lte": now_iso, "$ne": ""}},
        {"$set": {"status": "published", "updated_at": now_iso}},
    )
    return result.modified_count


# ---------------- Public blog routes ----------------
@router.get("/blog/posts")
async def list_published_posts():
    db = _db_or_raise()
    await _promote_due_scheduled(db)
    cursor = db.blog_posts.find({"status": "published"}).sort("publish_date", -1)
    docs = await cursor.to_list(length=500)
    return {"posts": [_doc_to_post_out(d) for d in docs]}


@router.get("/blog/posts/{slug}")
async def get_published_post(slug: str):
    db = _db_or_raise()
    await _promote_due_scheduled(db)
    doc = await db.blog_posts.find_one({"slug": slug, "status": "published"})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    return _doc_to_post_out(doc)


@router.get("/blog/tags")
async def list_tags():
    """Public — distinct tags across published posts, with post counts."""
    db = _db_or_raise()
    await _promote_due_scheduled(db)
    pipeline = [
        {"$match": {"status": "published"}},
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
        {"$sort": {"count": -1, "_id": 1}},
    ]
    cursor = db.blog_posts.aggregate(pipeline)
    items = []
    async for row in cursor:
        items.append({"tag": row["_id"], "count": row["count"]})
    return {"tags": items}


@router.get("/blog/tags/{tag}")
async def list_posts_by_tag(tag: str):
    """Public — published posts that carry the given tag (case-insensitive)."""
    db = _db_or_raise()
    await _promote_due_scheduled(db)
    cursor = db.blog_posts.find(
        {
            "status": "published",
            "tags": {"$regex": f"^{re.escape(tag)}$", "$options": "i"},
        }
    ).sort("publish_date", -1)
    docs = await cursor.to_list(length=500)
    return {"tag": tag, "posts": [_doc_to_post_out(d) for d in docs]}


# ---------------- Admin blog routes ----------------
@router.get("/admin/posts")
async def list_all_posts(user: dict = Depends(require_staff)):
    db = _db_or_raise()
    # Authors only see their own posts; editors/admins see everything.
    query: dict = {} if _can_publish(user) else {"created_by": str(user["_id"])}
    cursor = db.blog_posts.find(query).sort("updated_at", -1)
    docs = await cursor.to_list(length=1000)
    return {"posts": [_doc_to_post_out(d) for d in docs]}


@router.get("/admin/posts/{post_id}")
async def get_post_admin(post_id: str, user: dict = Depends(require_staff)):
    db = _db_or_raise()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post id")
    doc = await db.blog_posts.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    await _assert_can_mutate_post(user, doc)
    return _doc_to_post_out(doc)


@router.post("/admin/posts", status_code=201)
async def create_post(payload: BlogPostCreate, user: dict = Depends(require_staff)):
    db = _db_or_raise()
    slug = _slugify(payload.slug or payload.title)
    if await db.blog_posts.find_one({"slug": slug}):
        raise HTTPException(status_code=409, detail="A post with this slug already exists")
    if payload.status not in ("draft", "published", "scheduled"):
        raise HTTPException(status_code=400, detail="status must be 'draft', 'published', or 'scheduled'")
    # Authors can't publish or schedule directly — force draft.
    requested_status = payload.status
    if not _can_publish(user) and requested_status != "draft":
        requested_status = "draft"

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
        "status": requested_status,
        "scheduled_for": (payload.scheduled_for or "").strip(),
        "created_by": str(user["_id"]),
        "created_at": now,
        "updated_at": now,
    }
    result = await db.blog_posts.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _doc_to_post_out(doc)


@router.put("/admin/posts/{post_id}")
async def update_post(post_id: str, payload: BlogPostUpdate, user: dict = Depends(require_staff)):
    db = _db_or_raise()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post id")

    existing = await db.blog_posts.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")
    await _assert_can_mutate_post(user, existing)

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
    if "scheduled_for" in data:
        update["scheduled_for"] = (data["scheduled_for"] or "").strip()
    if "status" in data and data["status"]:
        if data["status"] not in ("draft", "published", "scheduled"):
            raise HTTPException(status_code=400, detail="status must be 'draft', 'published', or 'scheduled'")
        # Authors can't move to published or scheduled.
        new_status = data["status"]
        if not _can_publish(user) and new_status != "draft":
            raise HTTPException(status_code=403, detail="Only editors/admins can publish or schedule posts")
        update["status"] = new_status

    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.blog_posts.update_one({"_id": oid}, {"$set": update})
    doc = await db.blog_posts.find_one({"_id": oid})
    return _doc_to_post_out(doc)


@router.delete("/admin/posts/{post_id}")
async def delete_post(post_id: str, user: dict = Depends(require_staff)):
    db = _db_or_raise()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post id")
    existing = await db.blog_posts.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")
    await _assert_can_mutate_post(user, existing)
    await db.blog_posts.delete_one({"_id": oid})
    return {"ok": True}


@router.post("/admin/posts/{post_id}/publish")
async def publish_post(post_id: str, _: dict = Depends(require_publisher)):
    db = _db_or_raise()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post id")
    now = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.update_one(
        {"_id": oid}, {"$set": {"status": "published", "scheduled_for": "", "updated_at": now}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    doc = await db.blog_posts.find_one({"_id": oid})
    return _doc_to_post_out(doc)


@router.post("/admin/posts/{post_id}/unpublish")
async def unpublish_post(post_id: str, _: dict = Depends(require_publisher)):
    db = _db_or_raise()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post id")
    now = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.update_one(
        {"_id": oid}, {"$set": {"status": "draft", "scheduled_for": "", "updated_at": now}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    doc = await db.blog_posts.find_one({"_id": oid})
    return _doc_to_post_out(doc)


@router.post("/admin/posts/{post_id}/schedule")
async def schedule_post(post_id: str, payload: ScheduleRequest, _: dict = Depends(require_publisher)):
    db = _db_or_raise()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post id")
    # Validate ISO datetime — accept "YYYY-MM-DDTHH:MM" or full ISO.
    raw = payload.scheduled_for.strip()
    try:
        # Allow "YYYY-MM-DDTHH:MM" by appending seconds when needed.
        candidate = raw if "T" in raw else raw + "T00:00:00"
        if len(candidate) == 16:  # YYYY-MM-DDTHH:MM
            candidate += ":00"
        dt = datetime.fromisoformat(candidate.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid scheduled_for datetime (use ISO 8601)")
    if dt <= datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="scheduled_for must be in the future")

    now = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.update_one(
        {"_id": oid},
        {"$set": {
            "status": "scheduled",
            "scheduled_for": dt.isoformat(),
            "updated_at": now,
        }},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    doc = await db.blog_posts.find_one({"_id": oid})
    return _doc_to_post_out(doc)


# ---------------- Cloudinary upload + media library ----------------
@router.post("/admin/upload")
async def upload_image(file: UploadFile = File(...), user: dict = Depends(require_staff)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are allowed")
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 10MB)")
    try:
        result = cloudinary.uploader.upload(contents, folder="posts", resource_type="image")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Cloudinary upload failed: {e}")
    db = _db_or_raise()
    media_doc = {
        "url": result.get("secure_url"),
        "public_id": result.get("public_id"),
        "width": result.get("width"),
        "height": result.get("height"),
        "format": result.get("format"),
        "bytes": result.get("bytes"),
        "original_filename": file.filename or "",
        "uploaded_by": str(user["_id"]),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.media.insert_one(media_doc)
    return {
        "url": media_doc["url"],
        "public_id": media_doc["public_id"],
        "width": media_doc["width"],
        "height": media_doc["height"],
        "format": media_doc["format"],
    }


@router.get("/admin/media")
async def list_media(_: dict = Depends(require_staff)):
    db = _db_or_raise()
    cursor = db.media.find({}).sort("created_at", -1).limit(200)
    items = []
    async for d in cursor:
        items.append({
            "id": str(d["_id"]),
            "url": d.get("url"),
            "public_id": d.get("public_id"),
            "width": d.get("width"),
            "height": d.get("height"),
            "format": d.get("format"),
            "original_filename": d.get("original_filename", ""),
            "created_at": d.get("created_at", ""),
        })
    return {"items": items}


# ---------------- AI: SEO meta description ----------------
def _strip_html(html: str) -> str:
    """Quick & cheap HTML→text. Good enough for sending to an LLM."""
    text = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    # Decode the few HTML entities that show up most often.
    replacements = {
        "&nbsp;": " ", "&amp;": "&", "&quot;": '"', "&#39;": "'",
        "&lt;": "<", "&gt;": ">", "&mdash;": "—", "&ndash;": "–",
        "&hellip;": "…", "&rsquo;": "’", "&lsquo;": "‘",
        "&ldquo;": "“", "&rdquo;": "”",
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    return re.sub(r"\s+", " ", text).strip()


@router.post("/admin/posts/seo-suggest")
async def seo_suggest(payload: SeoSuggestRequest, _: dict = Depends(require_staff)):
    """Return an SEO meta description (≤160 chars) generated by Claude
    from the post title + body. Uses the Emergent Universal Key.
    """
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="LLM key not configured")

    body_text = _strip_html(payload.body_html)
    if not body_text:
        raise HTTPException(status_code=400, detail="Body is empty after stripping HTML")
    # Cap input so we never blow up the model context for a tiny task.
    body_text = body_text[:4000]
    title = (payload.title or "").strip()[:240]

    # Lazy-import so the storefront still boots if the package is absent.
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"LLM library unavailable: {e}")

    system = (
        "You write tight SEO meta descriptions for B2B field-marketing blog posts. "
        "Output exactly one meta description, 140-160 characters, no quotes, "
        "no preface, no trailing period required. Plain text only — no markdown, "
        "no emoji. Active voice, concrete nouns, one specific value prop, end with "
        "a soft hook when natural."
    )
    prompt = (
        f"Title: {title or '(untitled)'}\n\n"
        f"Body:\n{body_text}\n\n"
        "Write the meta description now."
    )

    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=f"seo-suggest-{uuid.uuid4().hex[:8]}",
            system_message=system,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        response = await chat.send_message(UserMessage(text=prompt))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM call failed: {e}")

    text = (response or "").strip().strip('"').strip("'")
    # Hard-cap at 160 in case the model overshoots.
    if len(text) > 160:
        # Try to cut on a word boundary.
        cut = text[:160]
        space = cut.rfind(" ")
        text = cut[:space] if space > 120 else cut
    return {"meta_description": text, "length": len(text)}


# ---------------- AI: post outline generator ----------------
@router.post("/admin/posts/outline")
async def generate_outline(payload: OutlineRequest, _: dict = Depends(require_staff)):
    """Generate a structured H2/H3 outline (HTML) from a working title.
    Returns body_html ready to drop into the TipTap editor.
    """
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="LLM key not configured")
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"LLM library unavailable: {e}")

    audience = (payload.audience or "B2B brand operators in CPG, hemp, and functional beverage").strip()[:240]
    tone = (payload.tone or "direct, expert, no fluff, Greenline Activations field-marketing voice").strip()[:240]

    system = (
        "You are an experienced B2B field-marketing editor. Given a working post "
        "title, return a tight outline as clean HTML — only <h2>, <h3>, <p>, <ul>, <li> tags. "
        "No <html>/<body> wrapper, no inline styles, no markdown. "
        "Structure: a 1-paragraph hook (<p>), then 4-6 <h2> sections, each with one short "
        "<p> brief and an optional <ul> of 2-4 bullet talking points. End with a closing "
        "<h2>The takeaway</h2> + <p>. Skip emoji and rhetorical questions."
    )
    prompt = (
        f"Working title: {payload.title.strip()}\n"
        f"Target audience: {audience}\n"
        f"Tone: {tone}\n\n"
        "Write the outline now."
    )
    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=f"outline-{uuid.uuid4().hex[:8]}",
            system_message=system,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        response = await chat.send_message(UserMessage(text=prompt))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM call failed: {e}")

    body_html = (response or "").strip()
    # Strip code-fence wrappers if Claude wrapped in ```html blocks.
    body_html = re.sub(r"^```(?:html)?\s*", "", body_html)
    body_html = re.sub(r"\s*```$", "", body_html)
    return {"body_html": body_html}


@router.post("/admin/posts/seo-regenerate-all")
async def seo_regenerate_all(_: dict = Depends(require_publisher)):
    """Regenerate meta descriptions for ALL posts via Claude. This costs $$ —
    use sparingly. Returns a per-post result list.
    """
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="LLM key not configured")
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"LLM library unavailable: {e}")

    db = _db_or_raise()
    cursor = db.blog_posts.find({}).sort("publish_date", -1)
    docs = await cursor.to_list(length=1000)
    results = []
    system = (
        "You write tight SEO meta descriptions for B2B field-marketing blog posts. "
        "Output exactly one meta description, 140-160 characters, no quotes, "
        "plain text only — no markdown, no emoji."
    )
    for d in docs:
        title = (d.get("title") or "")[:240]
        body_text = _strip_html(d.get("body_html", ""))[:4000]
        if not body_text:
            results.append({"id": str(d["_id"]), "slug": d.get("slug"), "skipped": "empty body"})
            continue
        try:
            chat = LlmChat(
                api_key=api_key,
                session_id=f"bulk-seo-{uuid.uuid4().hex[:8]}",
                system_message=system,
            ).with_model("anthropic", "claude-sonnet-4-5-20250929")
            resp = await chat.send_message(
                UserMessage(text=f"Title: {title}\n\nBody:\n{body_text}\n\nWrite the meta description.")
            )
            meta = (resp or "").strip().strip('"').strip("'")
            if len(meta) > 160:
                cut = meta[:160]
                sp = cut.rfind(" ")
                meta = cut[:sp] if sp > 120 else cut
            await db.blog_posts.update_one(
                {"_id": d["_id"]},
                {"$set": {"meta_description": meta, "updated_at": datetime.now(timezone.utc).isoformat()}},
            )
            results.append({"id": str(d["_id"]), "slug": d.get("slug"), "meta": meta, "length": len(meta)})
        except Exception as e:
            results.append({"id": str(d["_id"]), "slug": d.get("slug"), "error": str(e)[:200]})
    return {"updated": sum(1 for r in results if "meta" in r), "total": len(results), "results": results}


# ---------------- User management (admin only) ----------------
def _doc_to_user_out(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "email": doc.get("email", ""),
        "name": doc.get("name", ""),
        "role": doc.get("role", "author"),
        "created_at": doc.get("created_at", ""),
    }


@router.get("/admin/users")
async def list_users(_: dict = Depends(require_admin)):
    db = _db_or_raise()
    cursor = db.users.find({}).sort("created_at", 1)
    docs = await cursor.to_list(length=200)
    return {"users": [_doc_to_user_out(d) for d in docs]}


@router.post("/admin/users", status_code=201)
async def create_user(payload: UserCreate, _: dict = Depends(require_admin)):
    db = _db_or_raise()
    if payload.role not in ROLES:
        raise HTTPException(status_code=400, detail=f"role must be one of {ROLES}")
    email = payload.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="A user with this email already exists")
    doc = {
        "email": email,
        "password_hash": _hash_password(payload.password),
        "name": payload.name.strip(),
        "role": payload.role,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _doc_to_user_out(doc)


@router.put("/admin/users/{user_id}")
async def update_user(user_id: str, payload: UserUpdate, current: dict = Depends(require_admin)):
    db = _db_or_raise()
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user id")
    target = await db.users.find_one({"_id": oid})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    update: dict = {}
    data = payload.model_dump(exclude_unset=True)
    if "name" in data and data["name"]:
        update["name"] = data["name"].strip()
    if "password" in data and data["password"]:
        update["password_hash"] = _hash_password(data["password"])
        update["password_changed_at"] = datetime.now(timezone.utc).isoformat()
    if "role" in data and data["role"]:
        if data["role"] not in ROLES:
            raise HTTPException(status_code=400, detail=f"role must be one of {ROLES}")
        # Don't allow demoting the last admin.
        if target.get("role") == "admin" and data["role"] != "admin":
            admins = await db.users.count_documents({"role": "admin"})
            if admins <= 1:
                raise HTTPException(status_code=400, detail="Cannot demote the last admin")
        update["role"] = data["role"]

    if not update:
        return _doc_to_user_out(target)
    await db.users.update_one({"_id": oid}, {"$set": update})
    fresh = await db.users.find_one({"_id": oid})
    return _doc_to_user_out(fresh)


@router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, current: dict = Depends(require_admin)):
    db = _db_or_raise()
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user id")
    if str(oid) == str(current["_id"]):
        raise HTTPException(status_code=400, detail="You can't delete your own account")
    target = await db.users.find_one({"_id": oid})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    if target.get("role") == "admin":
        admins = await db.users.count_documents({"role": "admin"})
        if admins <= 1:
            raise HTTPException(status_code=400, detail="Cannot delete the last admin")
    await db.users.delete_one({"_id": oid})
    return {"ok": True}


# ---------------- Export / Import ----------------
@router.get("/admin/export.csv")
async def export_csv(_: dict = Depends(require_publisher)):
    """Download all posts as a CSV (mirrors the original import shape)."""
    from fastapi.responses import StreamingResponse
    db = _db_or_raise()
    cursor = db.blog_posts.find({}).sort("publish_date", -1)
    docs = await cursor.to_list(length=2000)

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow([
        "POST_URL", "TITLE", "SEO_TITLE", "PUBLISH_DATE", "AUTHOR",
        "META_DESCRIPTION", "FEATURED_IMAGE", "POST_BODY", "TAGS", "STATUS",
    ])
    for d in docs:
        slug = d.get("slug", "")
        writer.writerow([
            f"/blog/{slug}",
            d.get("title", ""),
            d.get("seo_title", ""),
            d.get("publish_date", ""),
            d.get("author", ""),
            d.get("meta_description", ""),
            d.get("featured_image_url", ""),
            d.get("body_html", ""),
            ", ".join(d.get("tags", []) or []),
            d.get("status", ""),
        ])
    csv_bytes = buf.getvalue().encode("utf-8")
    filename = f"greenline-blog-{datetime.now(timezone.utc).strftime('%Y%m%d')}.csv"
    return StreamingResponse(
        io.BytesIO(csv_bytes),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/admin/posts/{post_id}/export.md")
async def export_post_markdown(post_id: str, user: dict = Depends(require_staff)):
    """Download a single post as Markdown with YAML frontmatter."""
    from fastapi.responses import Response as PlainResponse
    from markdownify import markdownify
    db = _db_or_raise()
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post id")
    doc = await db.blog_posts.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    await _assert_can_mutate_post(user, doc)

    md_body = markdownify(doc.get("body_html", "") or "", heading_style="ATX").strip()
    front = [
        "---",
        f'title: "{(doc.get("title") or "").replace(chr(34), chr(39))}"',
        f'slug: {doc.get("slug", "")}',
        f'author: {doc.get("author", "")}',
        f'publish_date: {doc.get("publish_date", "")}',
        f'status: {doc.get("status", "")}',
        f'featured_image: {doc.get("featured_image_url", "")}',
        f'tags: [{", ".join(doc.get("tags", []) or [])}]',
        f'meta_description: "{(doc.get("meta_description") or "").replace(chr(34), chr(39))}"',
        "---",
        "",
        md_body,
        "",
    ]
    md = "\n".join(front)
    filename = f"{doc.get('slug', 'post')}.md"
    return PlainResponse(
        content=md,
        media_type="text/markdown; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.post("/admin/posts/import-markdown", status_code=201)
async def import_markdown_post(payload: MarkdownImportRequest, user: dict = Depends(require_staff)):
    """Create a draft post from a markdown body. Authors save as draft;
    editors/admins can promote afterward.
    """
    import markdown as md_lib
    db = _db_or_raise()
    slug = _slugify(payload.slug or payload.title)
    if await db.blog_posts.find_one({"slug": slug}):
        raise HTTPException(status_code=409, detail="A post with this slug already exists")

    body_html = md_lib.markdown(
        payload.markdown,
        extensions=["extra", "sane_lists", "smarty"],
    )
    now = datetime.now(timezone.utc).isoformat()
    publish_date = (payload.publish_date or "").strip() or datetime.now(timezone.utc).date().isoformat()
    doc = {
        "title": payload.title.strip(),
        "slug": slug,
        "seo_title": "",
        "meta_description": "",
        "author": (payload.author or user.get("name") or "Greenline").strip(),
        "publish_date": publish_date,
        "featured_image_url": "",
        "body_html": body_html,
        "tags": [t.strip() for t in (payload.tags or []) if t.strip()],
        "status": "draft",
        "scheduled_for": "",
        "created_by": str(user["_id"]),
        "created_at": now,
        "updated_at": now,
    }
    result = await db.blog_posts.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _doc_to_post_out(doc)


# ---------------- Scheduled-publish background task ----------------
async def scheduled_publisher_loop(db, interval_seconds: int = 60) -> None:
    """Background task that promotes scheduled posts whose time has come.
    Started once from server.py on app startup.
    """
    import asyncio as _asyncio
    while True:
        try:
            promoted = await _promote_due_scheduled(db)
            if promoted:
                # Best-effort log.
                import logging as _logging
                _logging.getLogger("greenline").info("Promoted %s scheduled post(s) to published", promoted)
        except Exception:
            import logging as _logging
            _logging.getLogger("greenline").exception("scheduled_publisher_loop error")
        await _asyncio.sleep(interval_seconds)



# ---------------- Startup: indexes, admin seed, blog seed ----------------
async def ensure_indexes(db) -> None:
    await db.users.create_index("email", unique=True)
    await db.users.create_index("role")
    await db.blog_posts.create_index("slug", unique=True)
    await db.blog_posts.create_index("status")
    await db.blog_posts.create_index([("publish_date", -1)])
    await db.blog_posts.create_index("tags")
    await db.blog_posts.create_index("scheduled_for")
    await db.blog_posts.create_index("created_by")
    await db.media.create_index([("created_at", -1)])
    await db.login_attempts.create_index("identifier")


async def seed_admin(db) -> None:
    """Create the admin user on first boot only.

    On subsequent boots we DO NOT touch the password hash — that would clobber
    a self-serve password change. To force-reset the admin password, delete
    the user document or run a maintenance script that updates `password_hash`
    directly.
    """
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
    """Seed blog posts from the CSV on first boot (when the collection is empty).
    Returns the number of inserted posts. No-op if any posts already exist.
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
