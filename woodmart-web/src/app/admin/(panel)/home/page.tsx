"use client";

import { useAdmin } from "@/store/useAdmin";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import OrdersTable from "@/components/admin/OrdersTable";

export default function AdminDashboardPage() {
  const doLogout = useAdmin((s) => s.logout);
  const router = useRouter();

  return (
    <AdminGuard>
      <div className="px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <button
            type="button"
            className="border rounded-md px-3 py-1 text-sm"
            onClick={() => {
              doLogout();
              router.replace("/admin/login");
            }}
          >
            Logout
          </button>
        </div>

        {/* 📌 Recent Orders Section */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

          {/* ⭐ WRAP ORDERS TABLE TO PREVENT OVERFLOW */}
          <div className="admin-table-wrapper bg-white border rounded p-3">
            <OrdersTable />
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}