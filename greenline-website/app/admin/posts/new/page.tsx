"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  const { user, loading } = useAdminAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/admin/login");
    else setReady(true);
  }, [user, loading, router]);

  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-sans text-ink/60">Loading…</p>
      </main>
    );
  }

  return <PostForm mode="create" />;
}
