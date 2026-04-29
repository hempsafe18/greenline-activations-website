"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { adminApi, AdminBlogPost } from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAdminAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { posts } = await adminApi.listPosts();
        setPosts(posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setFetched(true);
      }
    })();
  }, [user]);

  const refresh = async () => {
    const { posts } = await adminApi.listPosts();
    setPosts(posts);
  };

  const togglePublish = async (post: AdminBlogPost) => {
    setBusyId(post.id);
    try {
      if (post.status === "published") await adminApi.unpublishPost(post.id);
      else await adminApi.publishPost(post.id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (post: AdminBlogPost) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setBusyId(post.id);
    try {
      await adminApi.deletePost(post.id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-sans text-ink/60">Loading…</p>
      </main>
    );
  }

  const counts = {
    total: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    drafts: posts.filter((p) => p.status === "draft").length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
  };

  const canPublish = user.role === "admin" || user.role === "editor";

  const onBulkSeo = async () => {
    if (
      !window.confirm(
        "Regenerate the meta description for ALL posts using Claude? " +
          "This calls the LLM once per post and uses Universal Key credits."
      )
    )
      return;
    setBusyId("__bulk__");
    try {
      const result = await adminApi.bulkRegenerateSeo();
      alert(
        `Regenerated ${result.updated}/${result.total} meta descriptions.${
          result.results.find((r) => r.error)
            ? "\nSome posts errored — check console."
            : ""
        }`
      );
      // eslint-disable-next-line no-console
      console.log("Bulk SEO results:", result);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Bulk regenerate failed");
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/api/admin/export.csv`;
    window.open(url, "_blank");
  };

  return (
    <main className="min-h-screen pb-20">
      <header className="bg-ink text-bone border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 bg-canopy" />
            <span className="font-display font-black uppercase tracking-tight">
              Greenline CMS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-sans text-bone/60" data-testid="admin-user-email">
              {user.email}
            </span>
            <Link
              href="/admin/account"
              className="text-xs font-display font-bold uppercase tracking-wider hover:text-canopy"
              data-testid="admin-account-link"
            >
              Account
            </Link>
            {user.role === "admin" && (
              <Link
                href="/admin/users"
                className="text-xs font-display font-bold uppercase tracking-wider hover:text-canopy"
                data-testid="admin-users-link"
              >
                Users
              </Link>
            )}
            <Link
              href="/blog"
              target="_blank"
              className="text-xs font-display font-bold uppercase tracking-wider hover:text-canopy"
              data-testid="admin-view-site-link"
            >
              View site ↗
            </Link>
            <button
              type="button"
              onClick={() => logout().then(() => router.replace("/admin/login"))}
              className="text-xs font-display font-bold uppercase tracking-wider hover:text-street"
              data-testid="admin-logout-button"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <p className="eyebrow mb-2">The Activation</p>
            <h1 className="text-4xl font-display font-black text-ink">
              Posts dashboard
            </h1>
            <p className="font-sans text-ink/60 mt-2 max-w-xl">
              Create, edit, publish, and unpublish blog posts. Changes go live the
              moment you hit publish — no redeploy needed.
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="btn-canopy"
            data-testid="admin-new-post-button"
            id="new-post-button"
          >
            + New post
          </Link>
        </div>

        {/* Toolbar: bulk actions */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-4 bg-bone-warm border-2 border-ink">
          <span className="eyebrow mr-2">Bulk actions:</span>
          <button
            type="button"
            onClick={exportCsv}
            className="text-[11px] font-display font-bold uppercase tracking-wider px-3 py-2 border-2 border-ink bg-bone hover:bg-canopy"
            data-testid="admin-export-csv-button"
          >
            ⬇ Export CSV
          </button>
          {canPublish && (
            <button
              type="button"
              onClick={onBulkSeo}
              disabled={busyId === "__bulk__"}
              className="text-[11px] font-display font-bold uppercase tracking-wider px-3 py-2 border-2 border-ink bg-canopy hover:bg-canopy-dark disabled:opacity-50"
              data-testid="admin-bulk-seo-button"
              title="Regenerate every meta description with Claude"
            >
              {busyId === "__bulk__" ? "Working… (this can take a minute)" : "✨ Regenerate ALL SEO"}
            </button>
          )}
          <Link
            href="/admin/posts/new?import=md"
            className="text-[11px] font-display font-bold uppercase tracking-wider px-3 py-2 border-2 border-ink bg-bone hover:bg-canopy ml-auto"
            data-testid="admin-import-md-link"
          >
            ⬆ Import markdown
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="card !p-5">
            <p className="eyebrow mb-1">Total</p>
            <p className="text-3xl font-display font-black" data-testid="admin-stat-total">
              {counts.total}
            </p>
          </div>
          <div className="card !p-5">
            <p className="eyebrow mb-1 text-canopy-dark">Published</p>
            <p className="text-3xl font-display font-black" data-testid="admin-stat-published">
              {counts.published}
            </p>
          </div>
          <div className="card !p-5">
            <p className="eyebrow mb-1 text-street">Drafts</p>
            <p className="text-3xl font-display font-black" data-testid="admin-stat-drafts">
              {counts.drafts}
            </p>
          </div>
          <div className="card !p-5">
            <p className="eyebrow mb-1">Scheduled</p>
            <p className="text-3xl font-display font-black" data-testid="admin-stat-scheduled">
              {counts.scheduled}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 border-2 border-ink bg-street/20 px-4 py-3 font-bold">
            {error}
          </div>
        )}

        {!fetched ? (
          <p className="font-sans text-ink/60">Loading posts…</p>
        ) : posts.length === 0 ? (
          <div className="card text-center py-16" data-testid="admin-empty-state">
            <p className="text-2xl font-display font-bold mb-2">No posts yet</p>
            <p className="font-sans text-ink/60 mb-6">
              Create your first post to get rolling.
            </p>
            <Link href="/admin/posts/new" className="btn-canopy">
              + New post
            </Link>
          </div>
        ) : (
          <div className="bg-white border-2 border-ink shadow-brutal overflow-hidden" data-testid="admin-posts-table">
            <table className="w-full">
              <thead className="bg-bone-warm border-b-2 border-ink">
                <tr>
                  <th className="text-left px-5 py-3 text-[11px] font-display font-bold uppercase tracking-[0.18em]">
                    Title
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-display font-bold uppercase tracking-[0.18em] hidden md:table-cell">
                    Author
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-display font-bold uppercase tracking-[0.18em] hidden md:table-cell">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-display font-bold uppercase tracking-[0.18em]">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 text-[11px] font-display font-bold uppercase tracking-[0.18em]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-ink/15 hover:bg-bone-warm/40 transition-colors"
                    data-testid={`admin-post-row-${post.slug}`}
                  >
                    <td className="px-5 py-4 align-top">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="font-display font-bold text-ink hover:text-canopy-dark"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs font-mono text-ink/50 mt-1 truncate max-w-xs">
                        /{post.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-sm font-sans">
                      {post.author}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-sm font-sans">
                      {post.publish_date}
                    </td>
                    <td className="px-5 py-4">
                      {post.status === "published" ? (
                        <span className="inline-block text-[10px] font-display font-bold uppercase tracking-[0.18em] bg-canopy text-ink border-2 border-ink px-2 py-1">
                          Published
                        </span>
                      ) : post.status === "scheduled" ? (
                        <span
                          className="inline-block text-[10px] font-display font-bold uppercase tracking-[0.18em] bg-bone-warm text-ink border-2 border-ink px-2 py-1"
                          title={`Goes live ${post.scheduled_for}`}
                        >
                          ⏰ Scheduled
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] font-display font-bold uppercase tracking-[0.18em] bg-street text-bone border-2 border-ink px-2 py-1">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => togglePublish(post)}
                          disabled={busyId === post.id}
                          className="text-[11px] font-display font-bold uppercase tracking-wider px-3 py-1.5 border-2 border-ink hover:bg-ink hover:text-bone transition disabled:opacity-50"
                          data-testid={`admin-toggle-publish-${post.slug}`}
                        >
                          {post.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="text-[11px] font-display font-bold uppercase tracking-wider px-3 py-1.5 border-2 border-ink bg-bone hover:bg-canopy"
                          data-testid={`admin-edit-${post.slug}`}
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(post)}
                          disabled={busyId === post.id}
                          className="text-[11px] font-display font-bold uppercase tracking-wider px-3 py-1.5 border-2 border-ink bg-street text-bone hover:bg-street-dark disabled:opacity-50"
                          data-testid={`admin-delete-${post.slug}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
