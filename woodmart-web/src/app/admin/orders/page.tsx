"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/store/useAdmin";
import AdminGuard from "@/components/admin/AdminGuard";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "woodmart-production.up.railway.app";

type OrderItem = {
  title?: string;
  qty?: number;
  price?: number;
};

type Order = {
  _id: string;
  // new shape: nested customer object (preferred)
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address1?: string;
    address2?: string;
    city?: string;
    zip?: string;
  };
  // legacy / flattened fields
  customerName?: string;
  email?: string;
  phone?: string;

  // amounts stored by backend
  amounts?: {
    subtotal?: number;
    shipping?: number;
    total?: number;
  };

  // some older docs may have a top-level total
  total?: number;

  status?: string;
  items?: OrderItem[];
  createdAt?: string;
  address?: string;
};

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const money = (n?: number) => `$${Number(n || 0).toFixed(2)}`;

export default function AdminOrdersPage() {
  const token = useAdmin((s) => s.token);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---- Helper: get display name for order (Option 1: full email) ----
  function getCustomerName(o: Order) {
    const c = (o as any).customer || {};

    // 1️⃣ If backend includes customer.name
    if (c.name && String(c.name).trim().length) {
      return String(c.name).trim();
    }

    // 2️⃣ Fallback to email (full email)
    const email = c.email || o.email;
    if (email) {
      return String(email).trim();
    }

    // 3️⃣ Fallback to legacy field customerName
    if (o.customerName && String(o.customerName).trim().length) {
      return String(o.customerName).trim();
    }

    // 4️⃣ Final fallback
    return "Guest";
  }

  // ---- Helper: compute total (prefer stored amounts.total) ----
  function getOrderTotal(o: Order) {
    if (o.amounts && typeof o.amounts.total === "number") return o.amounts.total;
    if (typeof o.total === "number") return o.total;
    if (Array.isArray(o.items)) {
      return o.items.reduce((s, it) => s + (Number(it.price) || 0) * (it.qty || 0), 0);
    }
    return 0;
  }

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
      // backend may send { orders: [...] } or { items: [...] } or { items }
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

  // ---- Change status -> PUT /api/orders/:id/status ----
  const handleStatusChange = async (orderId: string, status: string) => {
    if (!token) return;

    setSavingId(orderId);
    setError(null);

    try {
      // NOTE: endpoint is /api/orders/:id/status (not /api/admin/orders/...)
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
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

      // update the local list (merge returned order if provided)
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                status: updated?.status ?? status,
                // merge amounts/total if backend returned new values
                amounts: updated?.amounts ?? o.amounts,
                total: updated?.total ?? o.total,
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
          {orders.map((o) => {
            const displayName = getCustomerName(o);
            const totalAmount = getOrderTotal(o);

            return (
              <div
                key={o._id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
                  {/* customer info */}
                  <div>
                    <div className="font-semibold">{displayName}</div>

                    {/* show email if available */}
                    { (o.customer && o.customer.email) || o.email ? (
                      <div className="text-xs text-gray-500">
                        {o.customer?.email ?? o.email}
                      </div>
                    ) : null }

                    {o.createdAt && (
                      <div className="text-xs text-gray-400">
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* total */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-lg font-bold">{money(totalAmount)}</div>
                  </div>

                  {/* status dropdown */}
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      Status
                    </label>
                    <select
                      className="rounded border px-2 py-1 text-sm"
                      value={o.status ?? "pending"}
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
            );
          })}
        </div>
      </div>
    </AdminGuard>
  );
}