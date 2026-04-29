"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";

export default function AdminLoginPage() {
  const { user, loading, login } = useAdminAuth();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [user, loading, next, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      router.replace(next);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white border-2 border-ink shadow-brutal p-10"
        data-testid="admin-login-form"
      >
        <p className="eyebrow text-canopy-dark mb-2">Greenline CMS</p>
        <h1 className="text-3xl font-display font-black text-ink mb-1">Sign in</h1>
        <p className="font-sans text-sm text-ink/60 mb-8">
          Internal blog administration. Authorized staff only.
        </p>

        <label className="label-brutal" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-brutal mb-5"
          data-testid="admin-login-email"
        />

        <label className="label-brutal" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-brutal mb-6"
          data-testid="admin-login-password"
        />

        {error && (
          <p
            className="mb-5 px-3 py-2 border-2 border-ink bg-street/20 text-ink font-bold text-sm"
            data-testid="admin-login-error"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-canopy w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="admin-login-submit"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
