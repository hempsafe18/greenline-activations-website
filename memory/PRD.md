# Greenline — Internal Blog CMS PRD

## Original problem statement
> BUILD AN INTERNAL CMS TO RUN OUR BLOG USING THE ATTACHED BLOG POSTS TO START.
> START BY REVIEWING ALL PREVIOUS BUILDS UNSUCCESSFULLY ATTEMPTING TO RUN THIS WITH CONTENTFUL.

## Background
- Multiple prior attempts (HubSpot RSS → HubSpot API → Contentful) failed because
  the site was deployed as a Next.js static export (`output: "export"`) — every
  publish required a redeploy and the third-party tokens were brittle at build time.
- This iteration replaces Contentful entirely with an internal CMS owned end-to-end
  (FastAPI + MongoDB + Cloudinary), independent of any 3rd-party content service.

## User choices
- **Auth**: JWT email + password (custom, no Emergent auth)
- **Rendering**: dynamic Next.js (live publish, no redeploy)
- **Editor**: TipTap WYSIWYG (bold, headings, lists, links, images, blockquote)
- **Image upload**: Cloudinary (cloud_name=`activation`)
- **Admin seed**: `admin@greenlineactivations.com` / `ChangeMe123!`

## Architecture
- **Backend** `/app/backend/server.py` (existing storefront) + new `/app/backend/cms.py`
  module mounted on the same FastAPI app.
- **Auth**: bcrypt + PyJWT (HS256). httpOnly `access_token` (8h) and
  `refresh_token` (7d) cookies. Brute-force lockout: 5 attempts / 15-min window
  keyed by `X-Forwarded-For` first hop + email.
- **CMS data**: MongoDB collection `blog_posts` with unique `slug` index, status
  `draft|published`. `users` (admin), `login_attempts` for lockout.
- **Cloudinary**: backend direct upload (admin-only) → returns `secure_url`,
  saved on the post as `featured_image_url`. TipTap inline images also use it.
- **Frontend** Next.js 15 App Router at `/app/greenline-website` — switched off
  static export. Public pages `/blog` and `/blog/[slug]` fetch the FastAPI API
  with `cache: "no-store"` (instant publishing). Admin UI at `/admin/*`.

## API surface
### Public
- `GET /api/blog/posts`
- `GET /api/blog/posts/{slug}`

### Auth
- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`,
  `POST /api/auth/refresh`

### Admin (cookie-protected)
- `GET /api/admin/posts`, `GET /api/admin/posts/{id}`
- `POST /api/admin/posts`, `PUT /api/admin/posts/{id}`, `DELETE /api/admin/posts/{id}`
- `POST /api/admin/posts/{id}/publish`, `POST /api/admin/posts/{id}/unpublish`
- `POST /api/admin/upload` (multipart `file` → Cloudinary)

## Frontend pages added/changed
- `/blog`, `/blog/[slug]`, `/sitemap.ts` — now driven by `lib/blog-api.ts` (was Contentful)
- `/admin/login`, `/admin`, `/admin/posts/new`, `/admin/posts/[id]/edit`
- Components: `AdminAuthContext`, `RichTextEditor` (TipTap), `PostForm`, `PublicChrome`

## Seed
On first startup the backend imports 12 posts from
`/app/backend/seed_data/blog.csv` (the `greenline-blog-12posts.csv` provided by
the user). All seeded as `published`.

## What's been implemented (2026-04-29)
- ✅ JWT email/password auth with httpOnly cookies + brute-force lockout
- ✅ Admin user seeded; bcrypt-hashed; `/api/auth/me` round-trip working
- ✅ Public blog API + dynamic Next.js pages (no redeploy needed to publish)
- ✅ Admin dashboard: counts, list, publish/unpublish/delete, logout
- ✅ TipTap WYSIWYG editor with inline image upload to Cloudinary
- ✅ Featured-image upload + URL paste in post form sidebar
- ✅ 12 CSV posts auto-imported and live at `/blog`
- ✅ Storefront APIs untouched — no regression on Stripe/orders flow
- ✅ Brute-force tz-naive datetime bug fixed; 5+ failed attempts → HTTP 429
- ✅ Self-serve **Change password** screen at `/admin/account` (verified end-to-end)
- ✅ Real client IP from `X-Forwarded-For` confirmed reaching the brute-force keying
- ✅ Startup admin-seed no longer clobbers a self-changed password on restart
- ✅ `/app/backend/.env` confirmed gitignored (`*.env` rule), Cloudinary secret safe

## Known caveats
- Cloudinary credentials live in `/app/backend/.env` — make sure that file is
  in `.gitignore` for any production push (it currently is).
- Brute-force identifier uses first hop of `X-Forwarded-For`; if your ingress
  strips that header, fall back is `request.client.host`.

## Backlog (P1 / P2)
- [ ] Per-post draft auto-save (save every N seconds while editing)
- [ ] Multi-author support (currently `author` is just a free-text string)
- [ ] Tag pages: `/blog/tags/{tag}` listing posts by tag
- [ ] Image library / re-use uploaded media across posts
- [ ] Scheduled publishing (publish at a future date/time)
- [ ] Markdown ↔ HTML import/export for migrating posts in/out
- [ ] CSV bulk export of all posts (mirror of the original import)
- [ ] Optional Cloudinary delete-on-asset-replace on the backend
- [ ] Optional admin role granularity (writer vs publisher)

## Test credentials
See `/app/memory/test_credentials.md`.
