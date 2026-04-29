/**
 * Tiny admin API client. All requests use cookies via `credentials: "include"`
 * so the JWT cookies set by the FastAPI backend are forwarded automatically.
 */

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8001";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  seo_title: string;
  meta_description: string;
  author: string;
  publish_date: string;
  featured_image_url: string;
  body_html: string;
  tags: string[];
  status: "draft" | "published" | "scheduled";
  scheduled_for: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor" | "author";
  created_at: string;
}

export interface MediaItem {
  id: string;
  url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  original_filename: string;
  created_at: string;
}

export interface PostInput {
  title: string;
  slug: string;
  seo_title?: string;
  meta_description?: string;
  author: string;
  publish_date: string;
  featured_image_url?: string;
  body_html: string;
  tags: string[];
  status: "draft" | "published" | "scheduled";
  scheduled_for?: string;
}

async function jsonFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BACKEND}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") detail = data.detail;
      else if (Array.isArray(data?.detail))
        detail = data.detail
          .map((e: { msg?: string }) => e?.msg ?? JSON.stringify(e))
          .join("; ");
    } catch {
      /* ignore */
    }
    const err = new Error(detail) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return (await res.json()) as T;
}

export const adminApi = {
  login: (email: string, password: string) =>
    jsonFetch<AdminUser>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => jsonFetch<{ ok: true }>("/api/auth/logout", { method: "POST" }),
  me: () => jsonFetch<AdminUser>("/api/auth/me"),
  refresh: () => jsonFetch<{ ok: true }>("/api/auth/refresh", { method: "POST" }),
  changePassword: (current_password: string, new_password: string) =>
    jsonFetch<{ ok: true }>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ current_password, new_password }),
    }),
  listPosts: () =>
    jsonFetch<{ posts: AdminBlogPost[] }>("/api/admin/posts"),
  getPost: (id: string) => jsonFetch<AdminBlogPost>(`/api/admin/posts/${id}`),
  createPost: (data: PostInput) =>
    jsonFetch<AdminBlogPost>("/api/admin/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePost: (id: string, data: Partial<PostInput>) =>
    jsonFetch<AdminBlogPost>(`/api/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePost: (id: string) =>
    jsonFetch<{ ok: true }>(`/api/admin/posts/${id}`, { method: "DELETE" }),
  publishPost: (id: string) =>
    jsonFetch<AdminBlogPost>(`/api/admin/posts/${id}/publish`, {
      method: "POST",
    }),
  unpublishPost: (id: string) =>
    jsonFetch<AdminBlogPost>(`/api/admin/posts/${id}/unpublish`, {
      method: "POST",
    }),
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BACKEND}/api/admin/upload`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    if (!res.ok) {
      let detail = `${res.status} ${res.statusText}`;
      try {
        const data = await res.json();
        detail = data?.detail ?? detail;
      } catch {
        /* ignore */
      }
      throw new Error(detail);
    }
    return (await res.json()) as { url: string };
  },
  suggestSeo: (title: string, body_html: string) =>
    jsonFetch<{ meta_description: string; length: number }>(
      "/api/admin/posts/seo-suggest",
      {
        method: "POST",
        body: JSON.stringify({ title, body_html }),
      }
    ),
  generateOutline: (title: string, audience?: string, tone?: string) =>
    jsonFetch<{ body_html: string }>("/api/admin/posts/outline", {
      method: "POST",
      body: JSON.stringify({ title, audience: audience ?? "", tone: tone ?? "" }),
    }),
  schedulePost: (id: string, scheduled_for: string) =>
    jsonFetch<AdminBlogPost>(`/api/admin/posts/${id}/schedule`, {
      method: "POST",
      body: JSON.stringify({ scheduled_for }),
    }),
  bulkRegenerateSeo: () =>
    jsonFetch<{
      updated: number;
      total: number;
      results: Array<{ id: string; slug: string; meta?: string; error?: string; skipped?: string }>;
    }>("/api/admin/posts/seo-regenerate-all", { method: "POST" }),
  listMedia: () =>
    jsonFetch<{ items: MediaItem[] }>("/api/admin/media"),
  importMarkdown: (data: {
    title: string;
    slug?: string;
    author?: string;
    publish_date?: string;
    tags?: string[];
    markdown: string;
  }) =>
    jsonFetch<AdminBlogPost>("/api/admin/posts/import-markdown", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // User management (admin-only)
  listUsers: () => jsonFetch<{ users: AdminUserRecord[] }>("/api/admin/users"),
  createUser: (data: { email: string; password: string; name: string; role: string }) =>
    jsonFetch<AdminUserRecord>("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateUser: (id: string, data: { name?: string; role?: string; password?: string }) =>
    jsonFetch<AdminUserRecord>(`/api/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteUser: (id: string) =>
    jsonFetch<{ ok: true }>(`/api/admin/users/${id}`, { method: "DELETE" }),
};
