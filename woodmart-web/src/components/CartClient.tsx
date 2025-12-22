// components/CartClient.tsx
"use client";
import React, { useEffect, useState } from "react";

type CartItem = {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  price?: number;
  image?: string;
  qty?: number;
};

export default function CartClient() {
  const [items, setItems] = useState<CartItem[] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("woodmart-cart");
      if (!raw) {
        setItems([]);
        return;
      }
      const parsed = JSON.parse(raw);
      // In your project items live at parsed.state.cart
      const list: CartItem[] = parsed?.state?.cart || [];
      // Normalize qty
      const normalized = list.map((i: any) => ({ ...i, qty: i.qty ?? i.quantity ?? 1 }));
      setItems(normalized);
    } catch (err) {
      console.error("CartClient: failed to read localStorage woodmart-cart", err);
      setItems([]);
    }
  }, []);

  if (items === null) return <div>Loading cart…</div>;
  if (!items || items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div>
      {items.map((i) => (
        <div key={i._id ?? i.id} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
          {i.image && <img src={i.image} alt={i.title} width={80} style={{ objectFit: "cover" }} />}
          <div>
            <div style={{ fontWeight: 600 }}>{i.title}</div>
            <div>${i.price ?? "—"} × {i.qty}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
