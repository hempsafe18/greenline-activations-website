# Greenline Activations — SaaS Upgrade

This repo has been upgraded from a static "book a call" marketing site to a full
productized **"add to cart and checkout"** SaaS-style e-commerce experience for
retail activations.

## What's new

- **`/` (Homepage)** — Redesigned hero with the "Build Your Sprint" instant quote
  calculator. Quantity slider that auto-selects the right pricing tier in real time.
- **`/sprints`** — Full catalog of tier SKUs (Test Sprint, Sprint 1, Sprint 2, Sprint 3)
  with recommended quantity "Add to Cart" shortcuts + custom quantity builder.
- **`/cart`** — Cart review with a full event-brief form (dates, locations, brand info,
  SKUs, staffing notes) and a one-click **"Skip the details — schedule onboarding call
  instead"** toggle. Stripe checkout redirect.
- **`/order/success/`** — Post-payment confirmation with receipt, next-steps timeline,
  and order lookup. Polls backend every 2s until Stripe confirms payment.
- **Persistent Cart** — LocalStorage-backed with a slide-in drawer, item-count badge
  in header, and add-to-cart bounce animation.

## Pricing engine (single source of truth: `/app/backend/server.py`)

| Tier          | Qty range | $/activation |
|---------------|-----------|--------------|
| Test Sprint   | 1–11      | $200         |
| Sprint 1      | 12–29     | $190         |
| Sprint 2      | 30–59     | $180         |
| Sprint 3      | 60+       | $165         |

The 7–11 range uses Test Sprint pricing but the UI flags an **upsell** nudge to
reach Sprint 1 for automatic savings. The backend **always recomputes** from the
server-side tier map before creating a Stripe session (no price manipulation).

## Architecture

- **Frontend**: Next.js 15 App Router (TS, Tailwind), static-export compatible
- **Backend**: FastAPI + Motor (MongoDB) with `emergentintegrations` Stripe wrapper
- **Payments**: Stripe Checkout (hosted). Webhook endpoint `/api/webhook/stripe`.
- **Storage**: MongoDB collections: `orders`, `payment_transactions`, `onboarding_requests`

## Deploying on Vercel

The Next.js frontend deploys via Vercel as-is (`vercel.json` unchanged). The FastAPI
backend needs to be hosted elsewhere (Render, Railway, Fly.io, etc.). Point
`NEXT_PUBLIC_BACKEND_URL` at the deployed backend host. The preview env here runs
both on a single domain via ingress routing (`/api/*` → port 8001, else → 3000).

## Running locally

```bash
# Backend
cd backend && pip install -r requirements.txt
uvicorn server:app --port 8001

# Frontend
cd greenline-website && yarn && yarn dev
```

Env:
- `backend/.env`: `MONGO_URL`, `DB_NAME`, `STRIPE_API_KEY`
- `greenline-website/.env`: `NEXT_PUBLIC_BACKEND_URL`
