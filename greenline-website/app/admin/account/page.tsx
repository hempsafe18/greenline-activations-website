"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { adminApi } from "@/lib/admin-api";

export default function AdminAccountPage() {
  const { user, loading } = useAdminAuth();
  const router = useRouter();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [user, loading, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (next === current) {
      setError("New password must be different from current password.");
      return;
    }
    setSubmitting(true);
    try {
      await adminApi.changePassword(current, next);
      setSuccess(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-sans text-ink/60">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20" data-testid="admin-account-page">
      <header className="bg-ink text-bone border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-xs font-display font-bold uppercase tracking-wider hover:text-canopy"
              data-testid="admin-account-back"
            >
              ← Dashboard
            </Link>
            <span className="font-display font-black uppercase tracking-tight">
              Account
            </span>
          </div>
          <span className="text-xs font-sans text-bone/60">{user.email}</span>
        </div>
      </header>

      <section className="max-w-xl mx-auto px-6 pt-12">
        <p className="eyebrow mb-2">Security</p>
        <h1 className="text-3xl font-display font-black text-ink mb-2">
          Change password
        </h1>
        <p className="font-sans text-ink/60 mb-8">
          You'll stay signed in after updating. Pick something at least 8 characters.
        </p>

        <form
          onSubmit={onSubmit}
          className="bg-white border-2 border-ink shadow-brutal p-8 space-y-5"
          data-testid="admin-change-password-form"
        >
          <div>
            <label className="label-brutal" htmlFor="current">Current password</label>
            <input
              id="current"
              type="password"
              autoComplete="current-password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="input-brutal"
              data-testid="admin-change-password-current"
            />
          </div>
          <div>
            <label className="label-brutal" htmlFor="next">New password</label>
            <input
              id="next"
              type="password"
              autoComplete="new-password"
              required
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="input-brutal"
              data-testid="admin-change-password-new"
            />
          </div>
          <div>
            <label className="label-brutal" htmlFor="confirm">Confirm new password</label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input-brutal"
              data-testid="admin-change-password-confirm"
            />
          </div>

          {error && (
            <p
              className="px-3 py-2 border-2 border-ink bg-street/20 text-ink font-bold text-sm"
              data-testid="admin-change-password-error"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              className="px-3 py-2 border-2 border-ink bg-canopy text-ink font-bold text-sm"
              data-testid="admin-change-password-success"
            >
              Password updated. You're still signed in with a fresh session.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-canopy w-full justify-center disabled:opacity-50"
            data-testid="admin-change-password-submit"
          >
            {submitting ? "Updating…" : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}
