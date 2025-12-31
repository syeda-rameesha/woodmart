"use client";

import { useCart } from "@/store/useCart";

export default function CartBadge() {
  const cart = useCart((s) => s.cart);

  const count = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  if (!count) return null;

  return (
    <span className="absolute -top-2 -right-2 text-[10px] bg-black text-white rounded-full px-1.5 py-[2px] leading-none">
      {count}
    </span>
  );
}