# Auth + CMS Testing Guide

## Auth flow

### Step 1 — MongoDB Verification
```
mongosh
use greenline_activations
db.users.find({role: "admin"}).pretty()
db.blog_posts.countDocuments({})         // expect >= 12
db.blog_posts.findOne({status: "published"})
```
Verify: `password_hash` starts with `$2b$`. Indexes exist on `users.email` (unique), `blog_posts.slug` (unique), `blog_posts.status`, `login_attempts.identifier`.

### Step 2 — API
```
API=https://blog-cms-hub-2.preview.emergentagent.com
curl -c /tmp/c.txt -X POST $API/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@greenlineactivations.com","password":"ChangeMe123!"}'
curl -b /tmp/c.txt $API/api/auth/me
curl -b /tmp/c.txt $API/api/admin/posts
```

### Step 3 — Public reads (no auth)
```
curl $API/api/blog/posts | jq '.posts | length'   // expect 12
curl $API/api/blog/posts/what-is-brand-ambassador-certification-hemp-brands
```

### Step 4 — CRUD round trip
1. POST /api/admin/posts (status=draft) → 201, returns id
2. GET /api/blog/posts/{slug} → 404 (not published)
3. POST /api/admin/posts/{id}/publish → 200
4. GET /api/blog/posts/{slug} → 200
5. PUT /api/admin/posts/{id} → 200, fields updated
6. POST /api/admin/posts/{id}/unpublish → 200
7. DELETE /api/admin/posts/{id} → 200

### Step 5 — Admin auth required
- Hitting `/api/admin/posts` without cookies → 401
- Hitting `/api/admin/posts` with bad token → 401

### Step 6 — Frontend
- Visit `/admin/login`, log in with admin creds, expect redirect to `/admin`
- Dashboard shows ≥ 12 posts and counts
- Click "+ New post" → editor loads, type title/body, click "Save draft" → redirected to edit URL `/admin/posts/{id}/edit`
- On edit page, click "Publish" → status changes to published
- Visit `/blog/{slug}` (public) → renders the new post
- Click "Unpublish" on dashboard row → status flips
- Click "Delete" on dashboard row → row removed
- Log out → redirect to /admin/login
