"""
Greenline Activations — SaaS backend.
Handles cart pricing validation, order creation, Stripe checkout, and order lookup.
"""
import os
import uuid
import logging
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
)

load_dotenv()

logger = logging.getLogger("greenline")
logging.basicConfig(level=logging.INFO)

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
STRIPE_API_KEY = os.environ["STRIPE_API_KEY"]

mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client[DB_NAME]

app = FastAPI(title="Greenline Activations API")
api = APIRouter(prefix="/api")

# CORS: allow the production domain(s) + any origin when ALLOWED_ORIGINS is unset (dev).
_raw_origins = os.environ.get("ALLOWED_ORIGINS", "").strip()
if _raw_origins:
    allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]
else:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Pricing (single source of truth, server-side) ----------
# Tier min/max activation qty and per-activation USD price.
TIERS = [
    {
        "id": "test_sprint",
        "name": "Test Sprint",
        "tagline": "Validate in market",
        "min_qty": 1,
        "max_qty": 11,
        "price_per": 200.00,
        "recommended_qty": 6,
        "badge": "Start small",
        "description": "Perfect for brands testing a new market, SKU, or channel. Get 1–6 activations executed with full reporting before you commit to a sprint.",
        "highlights": [
            "1–6 branded activations",
            "HempSafe-certified ambassadors",
            "Per-activation recap & photos",
            "No long-term contract",
        ],
    },
    {
        "id": "sprint_1",
        "name": "Sprint 1",
        "tagline": "Get into rhythm",
        "min_qty": 12,
        "max_qty": 29,
        "price_per": 190.00,
        "recommended_qty": 20,
        "badge": "Most popular",
        "description": "The entry sprint for brands ready to move product every week. Builds repetition in priority accounts and generates real velocity data.",
        "highlights": [
            "12–29 activations",
            "Priority account selection",
            "Weekly performance recap",
            "Dedicated field lead",
        ],
    },
    {
        "id": "sprint_2",
        "name": "Sprint 2",
        "tagline": "Scale the state",
        "min_qty": 30,
        "max_qty": 59,
        "price_per": 180.00,
        "recommended_qty": 45,
        "badge": "Best value",
        "description": "A proper statewide push. Ideal for brands that need consistent Florida coverage across chains and independents.",
        "highlights": [
            "30–59 activations",
            "Multi-region coverage",
            "Bi-weekly strategy sync",
            "Shelf & merchandising audits",
        ],
    },
    {
        "id": "sprint_3",
        "name": "Sprint 3",
        "tagline": "Own the shelf",
        "min_qty": 60,
        "max_qty": 9999,
        "price_per": 165.00,
        "recommended_qty": 75,
        "badge": "Volume pricing",
        "description": "Heavy-weight sell-through program for brands defending distribution. Lowest per-activation price, fastest deployment windows.",
        "highlights": [
            "60+ activations",
            "Dedicated account manager",
            "Monthly executive recap",
            "First-call on new markets",
        ],
    },
]


def get_tier_by_qty(qty: int) -> Optional[dict]:
    if qty < 1:
        return None
    for tier in TIERS:
        if tier["min_qty"] <= qty <= tier["max_qty"]:
            return tier
    return None


def price_quote(qty: int) -> Optional[dict]:
    """Return pricing quote for a given quantity. Always uses auto-tier rule.
    If qty falls in the 7-11 'gap' (between Test max 6 and Sprint 1 min 12),
    the gap is bridged by Test Sprint pricing for qty<=6, else buyer must pick 12+.
    Here we allow qty 1-6 (Test), 12+ (Sprint tiers). 7-11 is invalid (caller should upsell).
    """
    if qty < 1:
        return None
    # Handle the gap 7-11: price at Test Sprint rate but flag upsell
    if 7 <= qty <= 11:
        tier = next(t for t in TIERS if t["id"] == "test_sprint")
        return {
            "qty": qty,
            "tier_id": tier["id"],
            "tier_name": tier["name"],
            "price_per": tier["price_per"],
            "subtotal": round(tier["price_per"] * qty, 2),
            "upsell": {
                "message": f"Add {12 - qty} more to unlock Sprint 1 pricing at $190/activation — save ${round((tier['price_per'] - 190.00) * 12, 2)}.",
                "next_tier_id": "sprint_1",
                "next_tier_qty": 12,
                "next_tier_price_per": 190.00,
            },
        }
    tier = get_tier_by_qty(qty)
    if tier is None:
        return None
    return {
        "qty": qty,
        "tier_id": tier["id"],
        "tier_name": tier["name"],
        "price_per": tier["price_per"],
        "subtotal": round(tier["price_per"] * qty, 2),
        "upsell": None,
    }


# ---------- Pydantic Models ----------
class CartItem(BaseModel):
    tier_id: str
    qty: int = Field(..., ge=1, le=9999)


class QuoteRequest(BaseModel):
    items: List[CartItem]


class EventBrief(BaseModel):
    brand_name: str
    contact_name: str
    contact_email: EmailStr
    contact_phone: Optional[str] = ""
    product_skus: Optional[str] = ""
    preferred_start_date: Optional[str] = ""
    preferred_end_date: Optional[str] = ""
    locations: Optional[str] = ""
    staffing_notes: Optional[str] = ""
    additional_notes: Optional[str] = ""


class CheckoutRequest(BaseModel):
    items: List[CartItem]
    origin_url: str
    event_brief: Optional[EventBrief] = None
    skip_details: bool = False  # if true, we schedule onboarding call after payment


class CheckoutResponse(BaseModel):
    url: str
    session_id: str
    order_id: str
    subtotal: float


# ---------- API Routes ----------
@api.get("/")
async def root():
    return {"service": "Greenline Activations API", "status": "ok"}


@api.get("/tiers")
async def get_tiers():
    return {"tiers": TIERS}


@api.post("/quote")
async def quote(req: QuoteRequest):
    """Server-side pricing calculation. Frontend shows a live preview but this is the source of truth.
    If a user-supplied tier_id doesn't match the correct tier for their qty, we auto-correct
    (server is authoritative) and surface a 'retiered' flag so the UI can show a notice.
    """
    line_items = []
    subtotal = 0.0
    for item in req.items:
        # Validate the tier_id at least corresponds to a known tier
        if not any(t["id"] == item.tier_id for t in TIERS):
            raise HTTPException(status_code=400, detail=f"Unknown tier: {item.tier_id}")
        q = price_quote(item.qty)
        if q is None:
            raise HTTPException(status_code=400, detail=f"Invalid quantity: {item.qty}")
        retiered = q["tier_id"] != item.tier_id
        line_items.append(
            {
                "tier_id": q["tier_id"],
                "tier_name": q["tier_name"],
                "qty": q["qty"],
                "price_per": q["price_per"],
                "subtotal": q["subtotal"],
                "upsell": q["upsell"],
                "retiered": retiered,
                "requested_tier_id": item.tier_id if retiered else None,
            }
        )
        subtotal += q["subtotal"]
    return {"line_items": line_items, "subtotal": round(subtotal, 2), "currency": "usd"}


@api.post("/checkout/session", response_model=CheckoutResponse)
async def create_checkout(req: CheckoutRequest, http_request: Request):
    if not req.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Recompute on server (never trust frontend amounts)
    line_items = []
    subtotal = 0.0
    for item in req.items:
        q = price_quote(item.qty)
        if q is None:
            raise HTTPException(status_code=400, detail=f"Invalid quantity: {item.qty}")
        line_items.append(
            {
                "tier_id": q["tier_id"],
                "tier_name": q["tier_name"],
                "qty": q["qty"],
                "price_per": q["price_per"],
                "subtotal": q["subtotal"],
            }
        )
        subtotal += q["subtotal"]
    subtotal = round(subtotal, 2)

    order_id = str(uuid.uuid4())
    origin = req.origin_url.rstrip("/")
    success_url = f"{origin}/order/success/?session_id={{CHECKOUT_SESSION_ID}}&order_id={order_id}"
    cancel_url = f"{origin}/cart/?cancelled=1"

    # Create Stripe checkout session
    host_url = str(http_request.base_url)
    webhook_url = f"{host_url.rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    metadata = {
        "order_id": order_id,
        "qty_total": str(sum(li["qty"] for li in line_items)),
        "brand_name": (req.event_brief.brand_name if req.event_brief else "—"),
        "contact_email": (req.event_brief.contact_email if req.event_brief else ""),
        "skip_details": "1" if req.skip_details else "0",
    }

    checkout_req = CheckoutSessionRequest(
        amount=float(subtotal),
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_req)

    # Persist order + payment transaction before redirect
    now = datetime.now(timezone.utc).isoformat()
    order_doc = {
        "order_id": order_id,
        "stripe_session_id": session.session_id,
        "status": "pending",
        "payment_status": "initiated",
        "subtotal": subtotal,
        "currency": "usd",
        "line_items": line_items,
        "event_brief": (req.event_brief.model_dump() if req.event_brief else None),
        "skip_details": req.skip_details,
        "created_at": now,
        "updated_at": now,
    }
    await db.orders.insert_one(order_doc)
    await db.payment_transactions.insert_one(
        {
            "order_id": order_id,
            "session_id": session.session_id,
            "amount": subtotal,
            "currency": "usd",
            "payment_status": "initiated",
            "metadata": metadata,
            "created_at": now,
            "updated_at": now,
        }
    )

    return CheckoutResponse(
        url=session.url,
        session_id=session.session_id,
        order_id=order_id,
        subtotal=subtotal,
    )


@api.get("/checkout/status/{session_id}")
async def checkout_status(session_id: str, http_request: Request):
    host_url = str(http_request.base_url)
    webhook_url = f"{host_url.rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    # Attempt to retrieve live from Stripe. If the Stripe proxy can't retrieve
    # the session (common with the emergent test proxy), fall back to our DB state
    # populated by the webhook. The DB is the source of truth.
    try:
        status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        now = datetime.now(timezone.utc).isoformat()
        tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        if tx and tx.get("payment_status") != status.payment_status:
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": status.payment_status, "status": status.status, "updated_at": now}},
            )
            await db.orders.update_one(
                {"stripe_session_id": session_id, "payment_status": {"$ne": "paid"}},
                {"$set": {
                    "payment_status": status.payment_status,
                    "status": "paid" if status.payment_status == "paid" else status.status,
                    "updated_at": now,
                }},
            )
        return {
            "session_id": session_id,
            "status": status.status,
            "payment_status": status.payment_status,
            "amount_total": status.amount_total,
            "currency": status.currency,
            "metadata": status.metadata,
            "source": "stripe",
        }
    except Exception as e:
        logger.warning("Stripe status fetch failed; falling back to DB: %s", e)
        tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        order = await db.orders.find_one({"stripe_session_id": session_id}, {"_id": 0})
        if not tx and not order:
            raise HTTPException(status_code=404, detail="Session not found")
        amount = int(round(float((order or tx).get("subtotal", tx.get("amount", 0))) * 100))
        return {
            "session_id": session_id,
            "status": (order or tx or {}).get("status", "open"),
            "payment_status": (order or tx or {}).get("payment_status", "initiated"),
            "amount_total": amount,
            "currency": (order or tx or {}).get("currency", "usd"),
            "metadata": (tx or {}).get("metadata", {}),
            "source": "db",
        }


@api.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")
    host_url = str(request.base_url)
    webhook_url = f"{host_url.rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    try:
        event = await stripe_checkout.handle_webhook(body, signature)
    except Exception as e:
        logger.exception("Stripe webhook error")
        raise HTTPException(status_code=400, detail=str(e))

    if event.session_id:
        now = datetime.now(timezone.utc).isoformat()
        await db.payment_transactions.update_one(
            {"session_id": event.session_id},
            {"$set": {"payment_status": event.payment_status, "updated_at": now}},
        )
        await db.orders.update_one(
            {"stripe_session_id": event.session_id, "payment_status": {"$ne": "paid"}},
            {
                "$set": {
                    "payment_status": event.payment_status,
                    "status": "paid" if event.payment_status == "paid" else "pending",
                    "updated_at": now,
                }
            },
        )
    return {"received": True}


@api.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


# ---------- Contact/onboarding (for "skip the details" flow) ----------
class OnboardingRequest(BaseModel):
    order_id: str
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    preferred_times: Optional[str] = ""
    notes: Optional[str] = ""


@api.post("/onboarding/request")
async def onboarding_request(req: OnboardingRequest):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "order_id": req.order_id,
        "name": req.name,
        "email": req.email,
        "phone": req.phone,
        "preferred_times": req.preferred_times,
        "notes": req.notes,
        "created_at": now,
        "status": "pending",
    }
    await db.onboarding_requests.insert_one(doc)
    return {"ok": True, "message": "Onboarding request received. We'll reach out within one business day."}


app.include_router(api)
