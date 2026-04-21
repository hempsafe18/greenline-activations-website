# Greenline Activations — SaaS Upgrade PRD

## Original problem statement
> Read the connected repository and develop a site upgrade plan: I want to go from
> "book a call" agency to SaaS "add to cart and checkout" agency for retail activations.
> Our current pricing reads like: Test Sprint: 1-6 activations = $200/per, Sprint 1:
> 12-29 activations=$190/per, Sprint 2: 30-59 activations=$180/per, Sprint 3:
> 60+ activations=$165/per.

## User choices (from initial clarification)
- Repo already in `/app` (Next.js 15 App Router static export, deployed on Vercel).
- Payment processor: **Stripe** (test key `sk_test_emergent` from env).
- Pricing UX: **Both** — quantity slider (auto-tier) + tier SKU cards.
- Event capture: event brief form with **toggle to skip details and schedule onboarding call**.
- Design direction: **bold SaaS aesthetic with retail activation energy** (neubrutalist, high-contrast, pill/sticker motifs).

## Architecture
- **Frontend**: Next.js 15 App Router (TS, Tailwind) at `/app/greenline-website`
  (symlinked `/app/frontend` for the supervisor). `next.config.ts` keeps
  `output: "export"` so Vercel deployment is unchanged.
- **Backend**: FastAPI at `/app/backend` on port 8001 using `emergentintegrations`
  Stripe wrapper + Motor (MongoDB). Exposed under `/api/*` via ingress.
- **Storage**: MongoDB `greenline_activations` with collections `orders`,
  `payment_transactions`, `onboarding_requests`.
- **Pricing engine**: server-authoritative in `backend/server.py::TIERS` +
  `price_quote()`. Client mirror at `greenline-website/lib/pricing.ts` for live UX.

## Core requirements (static)
1. Single-source pricing tiers (1-6 $200, 12-29 $190, 30-59 $180, 60+ $165).
2. Quantity slider auto-selects tier in real time + live total.
3. Persistent cart with drawer + header badge.
4. Event brief form with skip-to-onboarding-call toggle.
5. Stripe Checkout (hosted) with server-recomputed amounts (never trust FE).
6. Order lookup + webhook-driven status updates.
7. Preserve all existing agency pages (pilot, ROI calc, ambassadors, policy, etc).

## User personas
- **Brand operator** (beverage CPG). Wants: predictable per-activation cost, no RFPs.
- **Field ops buyer**. Wants: quick reorder, clear receipts, staffing notes in one place.
- **Ambassador program lead**. Wants: preserved ambassador recruitment funnel.

## What's been implemented (2026-04-21)
- ✅ Bold SaaS redesign: Cabinet Grotesk display + Manrope body; obsidian/bone/canopy-green/street-coral palette; neubrutalist cards; pill badges; marquee ticker; sticker hero motifs.
- ✅ Homepage rewrite with "Build Your Sprint" instant quote as the hero.
- ✅ `/sprints` page with 4 tier SKU cards + custom quantity builder.
- ✅ `/cart` page with line items, event brief form, skip-details toggle, Stripe checkout redirect.
- ✅ `/order/success` page with polling (status fallback to DB when Stripe proxy retrieval fails), receipt card, next-steps timeline.
- ✅ Persistent cart (localStorage, CartContext + CartDrawer).
- ✅ Header with cart button + qty badge + pop-in animation.
- ✅ FastAPI backend with `/api/tiers`, `/api/quote` (with retiering + upsell nudges), `/api/checkout/session`, `/api/checkout/status/{id}` (DB fallback), `/api/webhook/stripe`, `/api/orders/{id}`, `/api/onboarding/request`.
- ✅ HubSpot script conditionally suppressed on /cart and /order/* to prevent popup overlap.
- ✅ `data-testid` coverage on all interactive elements.

## Prioritized backlog / P0-P2 remaining
### P1 (next iteration)
- [ ] Customer order lookup page (`/order/lookup?id=...`) with email verification.
- [ ] Post-checkout email notification (SendGrid / Resend integration).
- [ ] Stripe webhook signature validation with `STRIPE_WEBHOOK_SECRET` for production.
- [ ] Update `/pilot-program`, `/retail-activation-roi-calculator`, `/schedule-an-intro-call` CTAs to funnel into /sprints (still use old Book Call CTAs in places).
- [ ] Admin dashboard listing all orders (for internal ops team).

### P2 (nice-to-have)
- [ ] Multi-brand cart (multiple brand lines per cart).
- [ ] Volume-discount code overrides.
- [ ] Activation scheduling calendar built-in (vs HubSpot meetings link).
- [ ] Proper "/order/success" retry when Stripe retrieval proxy fails (currently falls back to DB after 1 attempt).

## Known caveats
- `sk_test_emergent` Stripe proxy does not support session retrieval round-trip;
  backend gracefully falls back to DB-sourced `payment_status`. Real production
  Stripe key will not have this limitation.
- The ingress only exposes `/api/*` externally for the backend. FastAPI root `/` handler
  was removed per test agent note.
- Site is deployed as `output: "export"` static for Vercel; backend must be hosted
  separately (Render/Railway/Fly) for Vercel production.
