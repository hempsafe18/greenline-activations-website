# Greenline CMS — Test Credentials

## Admin (blog CMS)
- **Email**: `admin@greenlineactivations.com`
- **Password**: `ChangeMe123!`
- **Role**: `admin`
- **Login URL**: `${REACT_APP_BACKEND_URL}/admin/login`
- **Login API**: `POST /api/auth/login` with `{"email":"admin@greenlineactivations.com","password":"ChangeMe123!"}`
- **Sets httpOnly cookies**: `access_token`, `refresh_token` (SameSite=Lax, Secure)

## Auth endpoints
- `POST /api/auth/login` — returns user + sets cookies
- `POST /api/auth/logout` — clears cookies
- `GET /api/auth/me` — current user (cookie-protected)
- `POST /api/auth/refresh` — refresh access token
- `POST /api/auth/change-password` — body `{current_password, new_password}` (cookie-protected); reissues fresh session cookies on success

## Public blog endpoints (no auth)
- `GET /api/blog/posts` — list of published posts
- `GET /api/blog/posts/{slug}` — single published post

## Admin (cookie-protected) endpoints
### Posts
- `GET  /api/admin/posts` (staff) — authors see only their own
- `GET  /api/admin/posts/{id}` (staff)
- `POST /api/admin/posts` (staff) — authors forced to draft
- `PUT  /api/admin/posts/{id}` (staff, ownership-checked for authors)
- `DELETE /api/admin/posts/{id}` (staff, ownership-checked)
- `POST /api/admin/posts/{id}/publish` (editor+)
- `POST /api/admin/posts/{id}/unpublish` (editor+)
- `POST /api/admin/posts/{id}/schedule` body `{scheduled_for}` (editor+)
- `POST /api/admin/posts/seo-suggest` body `{title, body_html}`
- `POST /api/admin/posts/outline` body `{title, audience?, tone?}`
- `POST /api/admin/posts/seo-regenerate-all` (editor+) — bulk Claude run
- `POST /api/admin/posts/import-markdown` body `{title, markdown, ...}` → creates draft
- `GET  /api/admin/posts/{id}/export.md` — markdown download (frontmatter + body)
- `GET  /api/admin/export.csv` (editor+) — bulk CSV download

### Media
- `POST /api/admin/upload` (multipart `file`) → Cloudinary, tracked in DB
- `GET  /api/admin/media` — recent uploads (image library)

### Users (admin only)
- `GET  /api/admin/users`
- `POST /api/admin/users` body `{email, password, name, role}`
- `PUT  /api/admin/users/{id}` body `{name?, role?, password?}`
- `DELETE /api/admin/users/{id}`

## Initial seed
- 12 blog posts auto-seeded from `/app/backend/seed_data/blog.csv` on first startup (when `blog_posts` collection is empty). All seeded as `published`.
