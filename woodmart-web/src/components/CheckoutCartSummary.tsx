// src/components/CheckoutCartSummary.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";

type CartItem = {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  price?: number;
  image?: string;
  qty?: number;
};

const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;

export default function CheckoutCartSummary() {
  const [items, setItems] = useState<CartItem[] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("woodmart-cart");
      if (!raw) {
        setItems([]);
        return;
      }
      const parsed = JSON.parse(raw);
      const list: CartItem[] = parsed?.state?.cart || [];
      const normalized = list.map((i: any) => ({ ...i, qty: i.qty ?? i.quantity ?? 1 }));
      setItems(normalized);
    } catch (err) {
      console.error("CheckoutCartSummary: failed to read woodmart-cart", err);
      setItems([]);
    }
  }, []);

  const subtotal = useMemo(() => {
    if (!items) return 0;
    return items.reduce((s, it) => s + (it.price || 0) * (it.qty || 0), 0);
  }, [items]);

  if (items === null) return <div>Loading order summary…</div>;
  if (!items.length) return <div><p>Your cart is empty.</p></div>;

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        {items.map((i) => (
          <div key={i._id ?? i.id ?? i.slug} style={{ display: "flex", gap: 12, padding: 8, borderBottom: "1px solid #eee" }}>
            {i.image && <img src={i.image} alt={i.title} width={64} height={64} style={{ objectFit: "cover" }} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{i.title}</div>
              <div style={{ color: "#666", fontSize: 13 }}>
                {i.qty} × {money(i.price || 0)}
              </div>
            </div>
            <div style={{ fontWeight: 600 }}>{money((i.qty || 0) * (i.price || 0))}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span>Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#666", fontSize: 13 }}>
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <hr style={{ margin: "12px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
          <span>Total</span>
          <span>{money(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
