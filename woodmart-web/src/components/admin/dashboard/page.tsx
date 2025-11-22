"use client";
import AdminGuard from "@/components/admin/AdminGuard";
import ProductForm from "@/components/admin/ProductForm";
import OrderTable from "@/components/admin/OrderTable";
import { useAdmin } from "@/store/useAdmin";

export default function AdminDashboardPage() {
  const logout = useAdmin((s)=>s.logout);
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button onClick={logout} className="text-sm underline">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductForm />
          <div>
            <h3 className="font-semibold mb-2">Orders</h3>
            <OrderTable />
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}