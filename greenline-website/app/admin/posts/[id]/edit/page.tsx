"use client";

import { useEffect, useState, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import PostForm from "@/components/admin/PostForm";
import { adminApi, AdminBlogPost } from "@/lib/admin-api";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: Props) {
  const { id } = usePromise(params);
  const { user, loading } = useAdminAuth();
  const router = useRouter();
  const [post, setPost] = useState<AdminBlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/admin/login?next=/admin/posts/${id}/edit`);
      return;
    }
    (async () => {
      try {
        const p = await adminApi.getPost(id);
        setPost(p);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      }
    })();
  }, [id, user, loading, router]);

  if (loading || (!post && !error)) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-sans text-ink/60">Loading post…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <p className="font-display font-black text-2xl mb-2">Could not load post</p>
          <p className="font-sans text-ink/60 mb-4">{error}</p>
          <button onClick={() => router.push("/admin")} className="btn-canopy">
            ← Back to dashboard
          </button>
        </div>
      </main>
    );
  }

  return <PostForm mode="edit" initial={post!} />;
}
