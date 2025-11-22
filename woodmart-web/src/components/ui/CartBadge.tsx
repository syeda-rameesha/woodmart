"use client";
import { useCart } from "@/store/useCart";

export default function CartBadge() {
  const count = useCart((s) => s.count());
  if (!count) return null;
  return (
    <span className="absolute -top-2 -right-2 text-[10px] bg-black text-white rounded-full px-1.5 py-[2px] leading-none">
      {count}
    </span>
  );
}