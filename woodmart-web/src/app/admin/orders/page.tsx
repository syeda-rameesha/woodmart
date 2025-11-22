// src/app/admin/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/store/useAdmin";
import AdminGuard from "@/components/admin/AdminGuard";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type OrderItem = {
  title: string;
  qty: number;
  price: number;
};

type Order = {
  _id: string;
  customerName?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: string;
  total: number;
  items: OrderItem[];
  createdAt?: string;
};

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;

export default function AdminOrdersPage() {
  const token = useAdmin((s) => s.token);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---- Fetch orders from backend (/api/orders/admin) ----
  const loadOrders = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/orders/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to load orders (${res.status})`);
      }

      const data = await res.json();
      // backend may send { orders: [...] } or { items: [...] }
      const list = (data.orders || data.items || []) as Order[];
      setOrders(list);
    } catch (err: any) {
      console.error("Load orders error:", err);
      setError(err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ---- Change status -> PUT /api/admin/orders/:id/status ----
  const handleStatusChange = async (orderId: string, status: string) => {
    if (!token) return;

    setSavingId(orderId);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update status (${res.status})`);
      }

      const data = await res.json();
      const updated = data.order as Order | undefined;

      // update the local list
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                status: updated?.status ?? status,
              }
            : o
        )
      );
    } catch (err: any) {
      console.error("Update status error:", err);
      setError(err?.message || "Failed to update order status");
      // optional: re-load to sync
      await loadOrders();
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        {/* header row */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Orders</h1>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="rounded border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {/* error */}
        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* empty state */}
        {!loading && orders.length === 0 && (
          <p className="text-sm text-gray-500">No orders yet.</p>
        )}

        {/* orders list */}
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o._id}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
                {/* customer info */}
                <div>
                  <div className="font-semibold">
                    {o.customerName || o.email || "Guest"}
                  </div>
                  {o.email && (
                    <div className="text-xs text-gray-500">{o.email}</div>
                  )}
                  {o.createdAt && (
                    <div className="text-xs text-gray-400">
                      {new Date(o.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* total */}
                <div className="text-right">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-lg font-bold">{money(o.total)}</div>
                </div>

                {/* status dropdown */}
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    Status
                  </label>
                  <select
                    className="rounded border px-2 py-1 text-sm"
                    value={o.status}
                    disabled={savingId === o._id}
                    onChange={(e) =>
                      handleStatusChange(o._id, e.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* address */}
              {o.address && (
                <div className="mb-3 text-xs text-gray-600">
                  <span className="font-medium">Address: </span>
                  {o.address}
                </div>
              )}

              {/* items table */}
              {o.items && o.items.length > 0 && (
                <table className="mt-2 w-full text-xs">
                  <thead className="border-b text-gray-500">
                    <tr>
                      <th className="py-1 text-left">Item</th>
                      <th className="py-1 text-center">Qty</th>
                      <th className="py-1 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {o.items.map((it, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-1 pr-2">{it.title}</td>
                        <td className="py-1 text-center">{it.qty}</td>
                        <td className="py-1 text-right">
                          {money((it.qty || 0) * (it.price || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}