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
- `GET  /api/admin/posts`
- `GET  /api/admin/posts/{id}`
- `POST /api/admin/posts`
- `PUT  /api/admin/posts/{id}`
- `DELETE /api/admin/posts/{id}`
- `POST /api/admin/posts/{id}/publish`
- `POST /api/admin/posts/{id}/unpublish`
- `POST /api/admin/upload` (multipart/form-data, field `file`) → returns `{ url }` from Cloudinary
- `POST /api/admin/posts/seo-suggest` (body `{title, body_html}`) → returns `{ meta_description, length }` (Claude Sonnet 4.5 via Universal Key)

## Initial seed
- 12 blog posts auto-seeded from `/app/backend/seed_data/blog.csv` on first startup (when `blog_posts` collection is empty). All seeded as `published`.
