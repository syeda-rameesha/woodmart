// app/cart/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Local money formatter
const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;

type CartItem = {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  price?: number;
  image?: string;
  qty?: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[] | null>(null);

  // Read from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("woodmart-cart");
      if (!raw) {
        setItems([]);
        return;
      }
      const parsed = JSON.parse(raw);
      const list: CartItem[] = parsed?.state?.cart || [];
      // normalize qty
      const normalized = list.map((i: any) => ({ ...i, qty: i.qty ?? i.quantity ?? 1 }));
      setItems(normalized);
    } catch (err) {
      console.error("Cart page: failed to read localStorage woodmart-cart", err);
      setItems([]);
    }
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (items === null) return; // still loading
    try {
      // maintain existing wrapping shape but update state.cart
      const raw = localStorage.getItem("woodmart-cart");
      const parsed = raw ? JSON.parse(raw) : { state: { cart: [] }, version: 0 };
      parsed.state = parsed.state || {};
      parsed.state.cart = items;
      localStorage.setItem("woodmart-cart", JSON.stringify(parsed));
    } catch (err) {
      console.error("Cart page: failed to save woodmart-cart to localStorage", err);
    }
  }, [items]);

  // helpers to modify items
  const inc = (slugOrId: string) =>
    setItems((prev) =>
      (prev || []).map((it) =>
        it.slug === slugOrId || it._id === slugOrId || it.id === slugOrId
          ? { ...it, qty: (it.qty || 0) + 1 }
          : it
      )
    );

  const dec = (slugOrId: string) =>
    setItems((prev) =>
      (prev || []).map((it) =>
        (it.slug === slugOrId || it._id === slugOrId || it.id === slugOrId) && (it.qty || 0) > 1
          ? { ...it, qty: (it.qty || 0) - 1 }
          : it
      )
    );

  const remove = (slugOrId: string) =>
    setItems((prev) => (prev || []).filter((it) => !(it.slug === slugOrId || it._id === slugOrId || it.id === slugOrId)));

  const clear = () => setItems([]);

  // subtotal memoized
  const subtotal = useMemo(
    () => (items || []).reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0),
    [items]
  );

  // Loading state
  if (items === null) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <div>Loading cart…</div>
      </div>
    );
  }

  // Empty cart UI
  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p className="text-gray-600">Your cart is empty.</p>
        <Link href="/shop" className="mt-6 inline-block underline text-blue-600">
          Go shopping →
        </Link>
      </div>
    );
  }

  // Render cart + summary
  return (
    <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Items list */}
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

        {items.map((i) => (
          <div key={i._id ?? i.id ?? i.slug} className="flex items-center gap-4 border rounded-lg p-3">
            <img
              src={i.image}
              alt={i.title}
              className="w-24 h-24 object-cover rounded-md bg-gray-100"
            />

            <div className="flex-1">
              <Link href={`/shop/${i.slug}`} className="font-semibold hover:underline">
                {i.title}
              </Link>

              <div className="text-gray-500">{money(i.price || 0)}</div>

              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => dec(i.slug ?? i._id ?? (i.id as string))}
                  className="px-2 border rounded"
                  aria-label="Decrease quantity"
                >
                  –
                </button>

                <span className="w-8 text-center">{i.qty}</span>

                <button
                  onClick={() => inc(i.slug ?? i._id ?? (i.id as string))}
                  className="px-2 border rounded"
                  aria-label="Increase quantity"
                >
                  +
                </button>

                <button onClick={() => remove(i.slug ?? i._id ?? (i.id as string))} className="ml-4 text-red-600 underline">
                  Remove
                </button>
              </div>
            </div>

            <div className="font-semibold">{money((i.qty || 0) * (i.price || 0))}</div>
          </div>
        ))}

        <button onClick={() => clear()} className="text-sm underline text-gray-600">
          Clear cart
        </button>
      </div>

      {/* Summary */}
      <aside className="border rounded-lg p-6 h-fit">
        <h2 className="text-lg font-bold mb-2">Summary</h2>

        <div className="flex justify-between py-1">
          <span>Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>

        <div className="flex justify-between py-1 text-gray-500 text-sm">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between py-1 font-semibold">
          <span>Total</span>
          <span>{money(subtotal)}</span>
        </div>

        <Link
          href="/checkout"
          className="mt-4 w-full inline-flex items-center justify-center rounded-md bg-black px-4 py-3 text-white font-medium hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/30"
          aria-label="Go to checkout"
        >
          Checkout
        </Link>
      </aside>
    </div>
  );
}
