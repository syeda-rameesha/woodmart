"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminGuard from "@/components/admin/AdminGuard";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex">
        <div className="admin-sidebar w-64 flex-shrink-0">
          <AdminSidebar />
        </div>

        <main className="admin-content flex-1 px-4 py-6">
          <div className="w-full">
            {children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}