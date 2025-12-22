// src/components/admin/OrdersTable.tsx
"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi"; // named import (matches your adminApi)
import toast from "react-hot-toast";

// money formatter
const money = (n?: number) =>
  n == null ? "$0.00" : `$${Number(n || 0).toFixed(2)}`;

type OrderItem = {
  productId?: string;
  title?: string;
  slug?: string;
  image?: string;
  price?: number;
  qty?: number;
};

type Order = {
  _id: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address1?: string;
    address2?: string;
    city?: string;
    country?: string;
    zip?: string;
  };
  items?: OrderItem[];
  amounts?: {
    subtotal?: number;
    shipping?: number;
    total?: number;
  };
  status?: string;
  createdAt?: string;
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await adminApi<{ items: Order[]; total?: number }>(
        "/orders/admin",
        null,
        { method: "GET" }
      );
      setOrders(res.items || []);
    } catch (err: any) {
      console.error("Failed to load orders:", err);
      toast.error(err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  function customerName(order: Order) {
    const c = order.customer || {};
    // prefer explicit name
    if (c.name && String(c.name).trim().length) return String(c.name).trim();
    // fallback: use email username part if available
    if (c.email && String(c.email).includes("@")) {
      return String(c.email).split("@")[0];
    }
    // fallback: full email if present
    if (c.email) return String(c.email);
    // fallback: possible alternate fields
    if ((order as any).customerName) return (order as any).customerName;
    return "Guest";
  }

  function computeTotal(order: Order) {
    // prefer stored total
    if (order.amounts && typeof order.amounts.total === "number") {
      return order.amounts.total;
    }
    // fallback: compute from items
    if (Array.isArray(order.items)) {
      return order.items.reduce((s, it) => s + (Number(it.price) || 0) * (it.qty || 0), 0);
    }
    return 0;
  }

  async function updateStatus(orderId: string, status: string) {
    setSavingId(orderId);
    try {
      const res = await adminApi<{ message?: string; order?: Order }>(
        `/orders/${orderId}/status`,
        null,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...(o as any), ...(res.order || { status }) } : o))
      );

      toast.success(res.message || "Status updated");
    } catch (err: any) {
      console.error("Update status failed:", err);
      toast.error(err?.message || "Failed to update status");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <div className="text-sm text-gray-600">Loading orders…</div>;

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const total = computeTotal(order);
        const itemsSummary =
          order.items?.map((it) => `${it.title}${it.qty ? ` x${it.qty}` : ""}`).join(", ") || "-";

        return (
          <div key={order._id} className="bg-white border rounded p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-sm text-gray-500">{customerName(order)}</div>
                <div className="text-xs text-gray-400">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                </div>

                <div className="mt-3">
                  <div className="text-xs text-gray-400 font-semibold">Item</div>
                  <div className="text-sm mt-1">{itemsSummary}</div>
                </div>
              </div>

              <div className="text-center w-36">
                <div className="text-lg font-bold">{money(total)}</div>
              </div>

              <div className="w-48">
                <label className="block text-xs text-gray-500 mb-2">Status</label>
                <select
                  value={order.status || "pending"}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  disabled={savingId === order._id}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="pending">pending</option>
                  <option value="processing">processing</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            </div>
          </div>
        );
      })}

      {orders.length === 0 && <div className="text-gray-600">No orders found.</div>}
    </div>
  );
}