// src/components/checkout/OrderSummary.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

type CartItem = {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  images?: string[];
  price?: number;
  salePrice?: number;
  qty?: number;
};

type Props = {
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
};

export default function OrderSummary({
  cart,
  subtotal,
  shipping,
  total,
  onQtyChange,
  onRemove,
}: Props) {
  return (
    <div className="rounded-md border bg-white">
      <div className="border-b px-4 py-3 font-semibold">Your Order</div>

      {/* items */}
      <ul className="divide-y">
        {cart.length === 0 && (
          <li className="px-4 py-6 text-sm text-gray-500">Your cart is empty.</li>
        )}

        {cart.map((item) => {
          const img = item.image || item.images?.[0] || "";
          const price = item.salePrice ?? item.price ?? 0;
          const qty = item.qty ?? 1;

          return (
            <li key={item._id} className="flex gap-3 px-4 py-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
                {img ? (
                  <Image
                    src={img}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/shop/${item.slug}`} className="line-clamp-2">
                  {item.title}
                </Link>
                <div className="mt-1 text-sm text-gray-500">${price.toFixed(2)}</div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => onQtyChange(item._id, Math.max(1, Number(e.target.value) || 1))}
                    className="h-8 w-16 rounded border px-2 text-sm"
                  />
                  <button
                    className="text-xs text-red-600 underline"
                    onClick={() => onRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="ml-2 shrink-0 text-right">
                ${(price * qty).toFixed(2)}
              </div>
            </li>
          );
        })}
      </ul>

      {/* totals */}
      <div className="space-y-2 border-t px-4 py-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between border-t pt-2 font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}