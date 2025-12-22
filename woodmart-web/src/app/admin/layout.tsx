// src/app/admin/layout.tsx
"use client";

import "./admin.css";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar: fixed width */}
      <div className="admin-sidebar w-64 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Main content: flexible, left-aligned */}
      <main className="admin-content flex-1 p-6">
        {/* Use full width but constrain inner content to a max width while keeping it left aligned */}
        <div className="w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
