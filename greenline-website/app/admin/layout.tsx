import type { Metadata } from "next";
import { AdminAuthProvider } from "@/components/admin/AdminAuthContext";

export const metadata: Metadata = {
  title: "CMS · Greenline",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-bone-warm" data-testid="admin-shell">
        {children}
      </div>
    </AdminAuthProvider>
  );
}
