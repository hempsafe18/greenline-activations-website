"""
Greenline Activations — SaaS backend.
Handles cart pricing validation, order creation, Stripe checkout, order lookup,
and the internal blog CMS (auth + posts + uploads, mounted from cms.py).
"""
from dotenv import load_dotenv
load_dotenv()

import asyncio
import os
import uuid
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional, Dict, Any

import stripe as stripe_lib
import resend as resend_lib

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

import cms

logger = logging.getLogger("greenline")
logging.basicConfig(level=logging.INFO)

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
STRIPE_API_KEY = os.environ["STRIPE_API_KEY"]
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
RESEND_FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "orders@greenlineactivations.com")
APP_URL = os.environ.get("APP_URL", "https://www.greenlineactivations.com").rstrip("/")

stripe_lib.api_key = STRIPE_API_KEY

mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client[DB_NAME]

if not STRIPE_WEBHOOK_SECRET:
    logger.warning("STRIPE_WEBHOOK_SECRET not set — webhook signature validation is DISABLED")
if RESEND_API_KEY:
    resend_lib.api_key = RESEND_API_KEY
else:
    logger.warning("RESEND_API_KEY not set — order confirmation emails will not be sent")

app = FastAPI(title="Greenline Activations API")
api = APIRouter(prefix="/api")

# CORS: allow the production domain(s) + any origin when ALLOWED_ORIGINS is unset (dev).
# Set ALLOWED_ORIGINS as a comma-separated list of exact origins on Render.
# All Vercel preview URLs for this project are allowed via regex regardless.
_raw_origins = os.environ.get("ALLOWED_ORIGINS", "").strip()
if _raw_origins:
    allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]
else:
    allowed_origins = ["*"]

# Matches greenline-activations-website-*.vercel.app and the production domain
_vercel_preview_regex = (
    r"https://greenline-activations-website(-git-[a-z0-9-]+-hempsafe18s-projects)?\.vercel\.app"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=_vercel_preview_regex,
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
    deposit = round(subtotal * 0.5, 2)  # 50% deposit collected at checkout

    order_id = str(uuid.uuid4())
    origin = req.origin_url.rstrip("/")
    success_url = f"{origin}/order/success/?session_id={{CHECKOUT_SESSION_ID}}&order_id={order_id}"
    cancel_url = f"{origin}/cart/?cancelled=1"

    metadata = {
        "order_id": order_id,
        "qty_total": str(sum(li["qty"] for li in line_items)),
        "brand_name": (req.event_brief.brand_name if req.event_brief else "—"),
        "contact_email": (req.event_brief.contact_email if req.event_brief else ""),
        "skip_details": "1" if req.skip_details else "0",
        "deposit_only": "1",
        "total_subtotal": str(subtotal),
    }

    tiers_desc = ", ".join(f"{li['qty']} × {li['tier_name']}" for li in line_items)

    # Create Stripe checkout session via native SDK so we can set the product image
    raw_session = await asyncio.to_thread(
        stripe_lib.checkout.Session.create,
        mode="payment",
        line_items=[{
            "price_data": {
                "currency": "usd",
                "unit_amount": int(round(deposit * 100)),
                "product_data": {
                    "name": "Greenline Activation Sprint — 50% Deposit",
                    "description": f"{tiers_desc} · Balance due after activation sprint",
                    "images": [f"{APP_URL}/images/greenline-activation-sprint-product-v2.png"],
                },
            },
            "quantity": 1,
        }],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )

    # Persist order + payment transaction before redirect
    now = datetime.now(timezone.utc).isoformat()
    order_doc = {
        "order_id": order_id,
        "stripe_session_id": raw_session.id,
        "status": "pending",
        "payment_status": "initiated",
        "subtotal": subtotal,
        "deposit": deposit,
        "balance_due": deposit,  # remaining 50% due after activation sprint
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
            "session_id": raw_session.id,
            "amount": deposit,
            "currency": "usd",
            "payment_status": "initiated",
            "metadata": metadata,
            "created_at": now,
            "updated_at": now,
        }
    )

    return CheckoutResponse(
        url=raw_session.url,
        session_id=raw_session.id,
        order_id=order_id,
        subtotal=deposit,
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


async def send_order_confirmation(order: dict) -> None:
    if not RESEND_API_KEY:
        return
    brief = order.get("event_brief") or {}
    contact_email = brief.get("contact_email") or ""
    if not contact_email:
        logger.info("No contact email on order %s — skipping confirmation", order.get("order_id"))
        return

    contact_name = brief.get("contact_name") or "there"
    brand_name = brief.get("brand_name") or "Your Sprint"
    order_id = order.get("order_id", "")
    short_id = order_id[:8].upper()
    line_items = order.get("line_items", [])
    subtotal = order.get("subtotal", 0)
    deposit = order.get("deposit", round(subtotal * 0.5, 2))
    balance_due = order.get("balance_due", deposit)

    rows = "".join(
        f"<tr>"
        f"<td style='padding:10px 14px;border-bottom:1px solid #E5D9D2;font-size:14px;color:#0A0A0A'>{li['tier_name']}</td>"
        f"<td style='padding:10px 14px;border-bottom:1px solid #E5D9D2;text-align:center;font-size:14px;color:#0A0A0A'>{li['qty']}</td>"
        f"<td style='padding:10px 14px;border-bottom:1px solid #E5D9D2;text-align:right;font-size:14px;color:#0A0A0A'>${li['price_per']:.2f}</td>"
        f"<td style='padding:10px 14px;border-bottom:1px solid #E5D9D2;text-align:right;font-size:14px;color:#0A0A0A'>${li['subtotal']:,.2f}</td>"
        f"</tr>"
        for li in line_items
    )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF0EA;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF0EA;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid #E5D9D2;box-shadow:4px 4px 0 #0A0A0A;">
        <tr>
          <td style="background:#0A0A0A;padding:32px 40px;">
            <p style="margin:0;color:#5BB011;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Greenline Activations</p>
            <h1 style="margin:8px 0 0;color:#FAF0EA;font-size:26px;font-weight:800;letter-spacing:-0.02em;">Order Confirmed ✓</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 6px;color:#0A0A0A;font-size:16px;">Hey {contact_name},</p>
            <p style="margin:0 0 28px;color:#0A0A0A;font-size:15px;line-height:1.7;">
              Your sprint is locked in. Our field ops team will be in touch within <strong>1 business day</strong> to kick things off.
            </p>

            <p style="margin:0 0 10px;color:#0A0A0A;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Order #{short_id}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5D9D2;border-collapse:collapse;">
              <tr style="background:#FAF0EA;">
                <th style="padding:8px 14px;text-align:left;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0A0A0A;border-bottom:1px solid #E5D9D2;">Sprint</th>
                <th style="padding:8px 14px;text-align:center;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0A0A0A;border-bottom:1px solid #E5D9D2;">Activations</th>
                <th style="padding:8px 14px;text-align:right;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0A0A0A;border-bottom:1px solid #E5D9D2;">Each</th>
                <th style="padding:8px 14px;text-align:right;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0A0A0A;border-bottom:1px solid #E5D9D2;">Total</th>
              </tr>
              {rows}
              <tr style="background:#FAF0EA;">
                <td colspan="3" style="padding:10px 14px;text-align:right;font-size:12px;font-weight:600;color:#0A0A0A;">Sprint Total</td>
                <td style="padding:10px 14px;text-align:right;font-size:13px;font-weight:700;color:#0A0A0A;">${subtotal:,.2f}</td>
              </tr>
              <tr style="background:#FAF0EA;">
                <td colspan="3" style="padding:10px 14px;text-align:right;font-size:12px;font-weight:600;color:#0A0A0A;">Deposit Paid (50%)</td>
                <td style="padding:10px 14px;text-align:right;font-size:15px;font-weight:800;color:#5BB011;">${deposit:,.2f}</td>
              </tr>
              <tr style="background:#FAF0EA;">
                <td colspan="3" style="padding:10px 14px;text-align:right;font-size:12px;font-weight:600;color:#0A0A0A;">Balance Due After Activation Sprint</td>
                <td style="padding:10px 14px;text-align:right;font-size:13px;font-weight:700;color:#0A0A0A;">${balance_due:,.2f}</td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;border-left:3px solid #5BB011;">
              <tr><td style="padding:0 0 0 16px;">
                <p style="margin:0 0 10px;color:#0A0A0A;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">What happens next</p>
                <p style="margin:0 0 7px;color:#0A0A0A;font-size:14px;line-height:1.6;">1. We review your event brief and confirm ambassador availability.</p>
                <p style="margin:0 0 7px;color:#0A0A0A;font-size:14px;line-height:1.6;">2. A kickoff call is scheduled to finalize dates, locations, and brand guidelines.</p>
                <p style="margin:0;color:#0A0A0A;font-size:14px;line-height:1.6;">3. Activations go live on your preferred start date with real-time field reporting.</p>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#FAF0EA;padding:20px 40px;border-top:1px solid #E5D9D2;">
            <p style="margin:0;color:#0A0A0A;font-size:13px;line-height:1.6;">Questions? <a href="mailto:hello@greenlineactivations.com" style="color:#5BB011;text-decoration:none;font-weight:600;">hello@greenlineactivations.com</a></p>
            <p style="margin:6px 0 0;color:#888;font-size:11px;">Greenline Activations · Florida Retail Field Marketing</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    params: resend_lib.Emails.SendParams = {
        "from": f"Greenline Activations <{RESEND_FROM_EMAIL}>",
        "to": [contact_email],
        "subject": f"Order Confirmed — {brand_name} #{short_id}",
        "html": html,
    }
    try:
        await asyncio.to_thread(resend_lib.Emails.send, params)
        logger.info("Confirmation email sent to %s (order %s)", contact_email, order_id)
    except Exception:
        logger.exception("Failed to send confirmation email for order %s", order_id)


@api.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")

    # Reject unsigned webhooks when a signing secret is configured.
    if STRIPE_WEBHOOK_SECRET:
        try:
            stripe_lib.Webhook.construct_event(body, signature, STRIPE_WEBHOOK_SECRET)
        except (stripe_lib.error.SignatureVerificationError, ValueError) as e:
            logger.warning("Rejected webhook with invalid Stripe signature: %s", e)
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

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

        if event.payment_status == "paid":
            order = await db.orders.find_one(
                {"stripe_session_id": event.session_id, "confirmation_email_sent": {"$ne": True}},
                {"_id": 0},
            )
            if order:
                await send_order_confirmation(order)
                await db.orders.update_one(
                    {"stripe_session_id": event.session_id},
                    {"$set": {"confirmation_email_sent": True, "updated_at": now}},
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

# ---------- CMS module (auth + blog posts + Cloudinary uploads) ----------
cms.init(db)
app.include_router(cms.router)


@app.on_event("startup")
async def _cms_startup() -> None:
    try:
        await cms.ensure_indexes(db)
        await cms.seed_admin(db)
        seeded = await cms.seed_blog_posts_from_csv(
            db, Path(__file__).parent / "seed_data" / "blog.csv"
        )
        if seeded:
            logger.info("Seeded %s blog posts from CSV", seeded)
        # Launch background scheduler that promotes due posts every 60s.
        asyncio.create_task(cms.scheduled_publisher_loop(db))
    except Exception:
        logger.exception("CMS startup failed")
