"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  productId: string;
  title: string;
  qty: number;
  price: number;
};
type Order = {
  _id: string;
  customer?: { name?: string; email?: string };
  amounts?: { total?: number };
  status?: string;
  createdAt?: string;
  items?: OrderItem[];
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function OrdersTable() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/orders`, { cache: "no-store" });
        const data = await res.json();
        setRows(data?.items || []);
      } catch (e) {
        console.error("Fetch orders failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-sm text-gray-500">Loading…</div>;
  if (!rows.length) return <div className="text-sm text-gray-500">No orders yet.</div>;

  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left p-3">Order ID</th>
            <th className="text-left p-3">Customer</th>
            <th className="text-left p-3">Items</th>
            <th className="text-left p-3">Total</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o._id} className="border-t">
              <td className="p-3 font-mono text-xs">{o._id}</td>
              <td className="p-3">{o.customer?.name || "-"}</td>
              <td className="p-3">
                {(o.items || []).map((it) => `${it.title} x${it.qty}`).join(", ")}
              </td>
              <td className="p-3">${Number(o.amounts?.total || 0).toFixed(2)}</td>
              <td className="p-3">{o.status || "pending"}</td>
              <td className="p-3">{o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}