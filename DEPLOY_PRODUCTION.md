# Greenline CMS — Production deployment guide

This is the cross-subdomain setup. Frontend and backend share `greenlineactivations.com` so cookies stay first-party.

```
Browser
  ├── frontend  https://greenlineactivations.com         (Vercel — Next.js)
  └── backend   https://api.greenlineactivations.com     (Render / Railway / Fly — FastAPI)
```

---

## 1) DNS

Create two records on `greenlineactivations.com`:

| Host | Type | Value |
|------|------|-------|
| `@` (or `www`) | CNAME | your Vercel project's domain (e.g. `cname.vercel-dns.com`) |
| `api`          | CNAME | your backend host's domain (e.g. `your-app.onrender.com`) |

Wait for DNS to propagate (a few minutes).

---

## 2) Backend host (Render / Railway / Fly)

Deploy `/app/backend` (`server.py` + `cms.py` + `requirements.txt`) and set the following env vars. The `COOKIE_*` and `ALLOWED_ORIGINS` ones are the new bits — everything else carries over from the existing `.env`.

```
# Required
MONGO_URL=mongodb+srv://...                            # your prod Mongo
DB_NAME=greenline_activations
JWT_SECRET=<run: openssl rand -hex 32>
ADMIN_EMAIL=admin@greenlineactivations.com
ADMIN_PASSWORD=<one-time bootstrap; change at /admin/account>

# Cloudinary
CLOUDINARY_CLOUD_NAME=activation
CLOUDINARY_API_KEY=181953178748152
CLOUDINARY_API_SECRET=<your secret>

# LLM (Universal Key — used by /seo-suggest, /outline, /seo-regenerate-all)
EMERGENT_LLM_KEY=sk-emergent-...

# Storefront (already in use)
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=orders@greenlineactivations.com

# === Cross-subdomain cookies (NEW) ===
COOKIE_DOMAIN=.greenlineactivations.com
COOKIE_SAMESITE=lax

# === CORS — exact frontend origins (NEW) ===
ALLOWED_ORIGINS=https://greenlineactivations.com,https://www.greenlineactivations.com
```

Notes:
- The leading dot on `COOKIE_DOMAIN` is intentional — it lets the cookie be sent to **any** subdomain of `greenlineactivations.com`.
- `SameSite=lax` is enough because `greenlineactivations.com` and `api.greenlineactivations.com` are *same-site*. If you ever need to call the API from a totally different domain, switch to `COOKIE_SAMESITE=none`.
- Do **NOT** put `*` in `ALLOWED_ORIGINS` — browsers reject wildcard CORS when `credentials: include` is used.

Custom domain on the backend host:
- Render: Settings → Custom Domains → add `api.greenlineactivations.com`. Render auto-issues TLS.
- Railway / Fly: equivalent steps.

---

## 3) Vercel (frontend)

Project → Settings:

- **Root Directory**: `greenline-website`
- **Framework Preset**: Next.js (auto-detected)
- **Environment Variables**:
  ```
  NEXT_PUBLIC_BACKEND_URL=https://api.greenlineactivations.com
  ```

Then redeploy. Vercel reads `greenline-website/vercel.json` for the redirects.

---

## 4) Verification (post-deploy)

```
# 1. Public blog reads
curl https://api.greenlineactivations.com/api/blog/posts | jq '.posts | length'   # expect 12+

# 2. Admin login from the production frontend
#    Go to https://greenlineactivations.com/admin/login
#    Sign in. Then visit /admin → posts list loads.
#    Open DevTools → Application → Cookies → look for access_token + refresh_token
#    on api.greenlineactivations.com with Domain=.greenlineactivations.com

# 3. Tag and post pages
curl https://api.greenlineactivations.com/api/blog/tags | jq
curl https://greenlineactivations.com/blog/                                   # SSR render
curl https://greenlineactivations.com/blog/tags/Florida/                      # SSR render

# 4. Storefront (no regression)
curl https://api.greenlineactivations.com/api/tiers
```

---

## 5) Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| 401 on `/api/auth/me` after login | Cookie `Domain` mismatch | Confirm `COOKIE_DOMAIN=.greenlineactivations.com` on backend; redeploy backend. |
| CORS error on login | Frontend origin missing from `ALLOWED_ORIGINS` | Add the exact origin (`https://greenlineactivations.com`) and restart backend. |
| Admin pages return 404 on Vercel | Static export still active | Confirm `next.config.ts` does NOT have `output: "export"` (we removed it). Confirm Vercel Root Directory = `greenline-website`. |
| `Set-Cookie: SameSite=Lax; Secure; HttpOnly` but Domain missing | `COOKIE_DOMAIN` env var not set | Set it on the backend, redeploy. |
| Cookies set but not sent on next request | Browser rejected because `Secure` cookie is on `http://` | Force HTTPS on both subdomains (Vercel + backend host both auto-issue TLS — make sure custom domain is verified). |
