# Production Deploy — Backend on Render + Frontend on Vercel

This guide walks you through getting the Greenline Activations commerce stack live
at `https://greenlineactivations.com` with:

- **Frontend** on **Vercel** (already connected; static Next.js export)
- **Backend** on **Render** (free plan; `render.yaml` blueprint included)
- **Database** on **MongoDB Atlas** (free M0 cluster)
- **Payments** via **Stripe** (your own live or test secret key)

Total time: ~20–30 minutes.

---

## 1. Create a MongoDB Atlas cluster (free tier)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → sign up / log in.
2. Click **Build a Database** → choose **M0 Free**.
3. Pick a provider/region (AWS `us-east-1` or `us-west-2` recommended to be near Render).
4. Name it `greenline` and click **Create**.
5. In **Database Access**, click **Add New Database User**:
   - Auth method: **Password**
   - Username: `greenline_api`
   - Password: generate a strong one → **save it, you'll need it in step 3**
   - Privileges: **Atlas admin** (simplest) or **Read and write to any database**
6. In **Network Access**, click **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`).
   (Render's outbound IPs change; whitelisting all is standard for small apps. Upgrade to
   Atlas peering later if you need stricter isolation.)
7. Go to **Database → Connect → Drivers → Python**. Copy the connection string. It looks like:
   ```
   mongodb+srv://greenline_api:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<password>` with the password you saved.
   **This is your `MONGO_URL`.**

---

## 2. Get your Stripe secret key

1. Log into your [Stripe Dashboard](https://dashboard.stripe.com/apikeys).
2. Copy the **Secret key** (starts with `sk_live_...` for production or `sk_test_...` for testing).
   **This is your `STRIPE_API_KEY`.** Keep it private — treat it like a password.
3. (Optional, recommended for production) Create a webhook endpoint now so it's ready
   for step 5. Go to **Developers → Webhooks → Add endpoint**:
   - URL: `https://<your-render-service>.onrender.com/api/webhook/stripe`
     (you'll know the exact URL after step 3 — come back and update it)
   - Events to send: `checkout.session.completed`, `checkout.session.expired`,
     `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the **Signing secret** (`whsec_...`) for later webhook signature validation
     if you enable it.

---

## 3. Deploy the backend to Render

The repo ships with a [`render.yaml`](./render.yaml) blueprint, so deployment is one click.

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Blueprint**.
2. Connect your GitHub account and select this repo.
3. Render will read `render.yaml` and propose a single service named **`greenline-api`**.
   Review the defaults:
   - Runtime: `python`
   - Root directory: `backend`
   - Build: `pip install --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/ -r requirements.txt`
   - Start: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - Plan: `free`
   - Health check: `/api/`
4. Click **Apply**. Render will ask you to **fill in the secret env vars**:
   - **`MONGO_URL`** → paste the Atlas connection string from step 1.
   - **`STRIPE_API_KEY`** → paste your Stripe secret key from step 2.
     (`DB_NAME`, `APP_URL`, `ALLOWED_ORIGINS`, `PYTHON_VERSION` are pre-set in `render.yaml`.)
5. Click **Deploy**. First build takes ~3–5 min.
6. Once it shows **Live**, copy the service URL — something like:
   ```
   https://greenline-api.onrender.com
   ```
   **This is your `NEXT_PUBLIC_BACKEND_URL`.**
7. Verify the backend:
   ```bash
   curl https://greenline-api.onrender.com/api/tiers
   # should return {"tiers":[{"id":"test_sprint",...}]}
   ```

> **Heads up — Render free plan**: the service spins down after 15 min of inactivity
> and takes ~30 sec to cold-start on the first request. For smoother UX, upgrade to
> the **Starter ($7/mo)** plan — zero downtime, faster builds. You can do this
> anytime from the Render dashboard without redeploying.

---

## 4. Point the frontend (Vercel) at the Render backend

1. Go to your Vercel project → **Settings → Environment Variables**.
2. Add a new variable:
   - **Name:** `NEXT_PUBLIC_BACKEND_URL`
   - **Value:** `https://greenline-api.onrender.com` (no trailing slash)
   - **Environments:** check `Production`, `Preview`, and `Development`.
3. Save.
4. Go to **Deployments** → click the three dots on the latest deployment → **Redeploy**.
   (Env vars only take effect on new builds.)
5. Visit `https://greenlineactivations.com` — the `/sprints` → `/cart` → Stripe Checkout
   flow should now work end-to-end against your production backend.

---

## 5. Update the Stripe webhook with the real URL (recommended)

Once Render is live, go back to **Stripe → Developers → Webhooks** and make sure the
endpoint URL matches:
```
https://greenline-api.onrender.com/api/webhook/stripe
```
Send a test event to confirm you see a `200` response.

---

## 6. Smoke test the live site

```bash
# Pricing engine live
curl https://greenline-api.onrender.com/api/tiers | jq

# Quote — Sprint 2 for 35 activations → should recompute to $6300
curl -X POST https://greenline-api.onrender.com/api/quote \
  -H "Content-Type: application/json" \
  -d '{"items":[{"tier_id":"sprint_2","qty":35}]}' | jq
```

Then on the live site:
1. Homepage → drag the Build-Your-Sprint slider → confirm tier + total update.
2. `/sprints` → click **Add 20 activations** on Sprint 1 → cart drawer opens.
3. `/cart` → fill brief → **Checkout with Stripe** → Stripe hosted page loads.
4. Complete a test card (`4242 4242 4242 4242`, any future date, any CVC) → you should
   land on `/order/success/` with a receipt.

---

## Troubleshooting

| Symptom                                        | Likely cause / fix                                                                 |
| ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| `CORS` errors in browser console               | Add your Vercel preview domain to `ALLOWED_ORIGINS` on Render and redeploy.        |
| `/api/checkout/session` returns 500            | Check Render logs — usually bad `MONGO_URL` or Atlas IP allowlist.                 |
| First request of the day takes 30+ seconds     | Render free-plan cold start. Upgrade to Starter for zero downtime.                 |
| `No such checkout.session` on success page     | Only happens with the preview `sk_test_emergent` proxy key. Use a real Stripe key. |
| Vercel build fails on `NEXT_PUBLIC_BACKEND_URL`| Make sure you re-deployed after adding the env var (envs only apply to new builds).|

---

## File reference

- `/render.yaml` — Render blueprint (one-click deploy)
- `/backend/.env.example` — documented env var template
- `/backend/server.py` — FastAPI app, reads `ALLOWED_ORIGINS` from env
- `/greenline-website/.env` — local frontend env (Vercel takes over in prod)
- `/vercel.json` — existing Vercel config for the Next.js static export (unchanged)
