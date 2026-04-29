"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { adminApi, AdminUserRecord } from "@/lib/admin-api";

const ROLES = ["admin", "editor", "author"] as const;

export default function AdminUsersPage() {
  const { user, loading } = useAdminAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  // Invite form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<typeof ROLES[number]>("author");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/admin/login");
    else if (user.role !== "admin") router.replace("/admin");
  }, [user, loading, router]);

  const refresh = async () => {
    try {
      const { users } = await adminApi.listUsers();
      setUsers(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    }
  };

  useEffect(() => {
    if (user?.role === "admin") refresh();
  }, [user]);

  const onInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await adminApi.createUser({ email, password, name, role });
      setEmail("");
      setName("");
      setPassword("");
      setRole("author");
      setShowInvite(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create user");
    } finally {
      setSubmitting(false);
    }
  };

  const onChangeRole = async (u: AdminUserRecord, newRole: string) => {
    if (newRole === u.role) return;
    setBusy(u.id);
    try {
      await adminApi.updateUser(u.id, { role: newRole });
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(null);
    }
  };

  const onDelete = async (u: AdminUserRecord) => {
    if (!window.confirm(`Delete user ${u.email}?`)) return;
    setBusy(u.id);
    try {
      await adminApi.deleteUser(u.id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(null);
    }
  };

  if (loading || !user || user.role !== "admin") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-sans text-ink/60">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <header className="bg-ink text-bone border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-xs font-display font-bold uppercase tracking-wider hover:text-canopy"
              data-testid="admin-users-back"
            >
              ← Dashboard
            </Link>
            <span className="font-display font-black uppercase tracking-tight">
              Users
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowInvite(!showInvite)}
            className="text-xs font-display font-bold uppercase tracking-wider px-3 py-2 bg-canopy text-ink border-2 border-canopy hover:bg-canopy-dark"
            data-testid="admin-invite-user-toggle"
          >
            {showInvite ? "Cancel" : "+ Invite user"}
          </button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-10">
        <h1 className="text-4xl font-display font-black mb-2">Team & roles</h1>
        <p className="font-sans text-ink/60 mb-6 max-w-xl">
          <strong>Admins</strong> manage users and posts. <strong>Editors</strong> publish
          and edit any post. <strong>Authors</strong> only edit their own drafts.
        </p>

        {error && (
          <div className="mb-4 border-2 border-ink bg-street/20 px-4 py-3 font-bold" data-testid="admin-users-error">
            {error}
          </div>
        )}

        {showInvite && (
          <form
            onSubmit={onInvite}
            className="bg-white border-2 border-ink shadow-brutal p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
            data-testid="admin-invite-form"
          >
            <div>
              <label className="label-brutal" htmlFor="invite-email">Email</label>
              <input
                id="invite-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-brutal"
                data-testid="admin-invite-email"
              />
            </div>
            <div>
              <label className="label-brutal" htmlFor="invite-name">Name</label>
              <input
                id="invite-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-brutal"
                data-testid="admin-invite-name"
              />
            </div>
            <div>
              <label className="label-brutal" htmlFor="invite-password">Initial password</label>
              <input
                id="invite-password"
                type="text"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-brutal font-mono"
                placeholder="≥ 8 characters"
                data-testid="admin-invite-password"
              />
            </div>
            <div>
              <label className="label-brutal" htmlFor="invite-role">Role</label>
              <select
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value as typeof ROLES[number])}
                className="input-brutal"
                data-testid="admin-invite-role"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-canopy disabled:opacity-50"
                data-testid="admin-invite-submit"
              >
                {submitting ? "Creating…" : "Create user"}
              </button>
            </div>
          </form>
        )}

        <div className="bg-white border-2 border-ink shadow-brutal overflow-hidden" data-testid="admin-users-table">
          <table className="w-full">
            <thead className="bg-bone-warm border-b-2 border-ink">
              <tr>
                <th className="text-left px-5 py-3 text-[11px] font-display font-bold uppercase tracking-[0.18em]">User</th>
                <th className="text-left px-5 py-3 text-[11px] font-display font-bold uppercase tracking-[0.18em]">Role</th>
                <th className="text-right px-5 py-3 text-[11px] font-display font-bold uppercase tracking-[0.18em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-ink/15" data-testid={`admin-user-row-${u.email}`}>
                  <td className="px-5 py-4">
                    <p className="font-display font-bold">{u.name || "(no name)"}</p>
                    <p className="text-xs font-mono text-ink/50">{u.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={u.role}
                      disabled={busy === u.id || u.id === user.id}
                      onChange={(e) => onChangeRole(u, e.target.value)}
                      className="input-brutal !py-1.5 !text-sm"
                      data-testid={`admin-user-role-${u.email}`}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {u.id !== user.id && (
                      <button
                        type="button"
                        onClick={() => onDelete(u)}
                        disabled={busy === u.id}
                        className="text-[11px] font-display font-bold uppercase tracking-wider px-3 py-1.5 border-2 border-ink bg-street text-bone hover:bg-street-dark disabled:opacity-50"
                        data-testid={`admin-user-delete-${u.email}`}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
