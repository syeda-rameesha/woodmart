// src/components/ui/CartDrawer.tsx
"use client";

import React from "react";
import { useCart } from "@/store/useCart";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: Props) {
  const { cart = [], inc, dec, remove, clear } = useCart();
  const subtotal = cart.reduce((s: number, i: any) => s + (i.price || 0) * (i.qty || 0), 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* drawer */}
      <aside className="absolute right-0 top-0 w-full md:w-[420px] max-w-full bg-white shadow-xl flex flex-col
                        h-[105vh] md:h-[100vh]">
        {/* header */}
        <header className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Your cart</h3>
          <button onClick={onClose} className="text-sm px-2 py-1">Close</button>
        </header>

        {/* item list (scrollable) */}
        <div className="p-4 overflow-auto flex-1">
          {cart.length === 0 ? (
            <div className="text-gray-500 py-8 text-center">Your cart is empty.</div>
          ) : (
            cart.map((i: any) => (
              <div key={i.slug} className="flex items-center gap-3 mb-4">
                <img
                  src={i.image || "/placeholder.png"}
                  alt={i.title}
                  className="w-16 h-16 object-cover rounded-md bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{i.title}</div>
                  <div className="text-sm text-gray-500">${i.price}</div>

                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => dec(i.slug)} className="px-2 py-1 border rounded">−</button>
                    <div className="w-8 text-center">{i.qty}</div>
                    <button onClick={() => inc(i.slug)} className="px-2 py-1 border rounded">+</button>

                    <button onClick={() => remove(i.slug)} className="ml-3 text-red-600 text-sm">Remove</button>
                  </div>
                </div>

                <div className="font-semibold ml-2">${((i.qty || 0) * (i.price || 0)).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>

        {/* footer: fixed inside drawer */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex gap-3">
            {/* View cart button (bigger height) */}
            <a
              href="/cart"
              onClick={onClose}
              className="flex-1 text-center py-4 rounded-md border hover:bg-gray-50"
            >
              View cart
            </a>

            {/* Checkout button (bigger height & primary) */}
            <a
              href="/checkout"
              onClick={onClose}
              className="flex-1 text-center py-4 rounded-md bg-black text-white"
            >
              Checkout
            </a>
          </div>

          <button
            onClick={() => clear()}
            className="mt-3 w-full text-sm text-gray-600 underline"
            type="button"
          >
            Clear cart
          </button>
        </div>
      </aside>
    </div>
  );
}