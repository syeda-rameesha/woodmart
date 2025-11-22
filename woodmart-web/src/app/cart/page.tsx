"use client";

import Link from "next/link";
import { useCart } from "@/store/useCart";

// Local helper so we don't depend on any other file
const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;

export default function CartPage() {
  // Matches your store shape: { cart, inc, dec, remove, clear }
  const { cart, inc, dec, remove, clear } = useCart();

  const subtotal = cart.reduce(
    (sum: number, i: any) => sum + (i.price || 0) * (i.qty || 0),
    0
  );

  if (!cart.length) {
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

  return (
    <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Items list */}
      <div className="md:col-span-2 space-y-4">
        {cart.map((i: any) => (
          <div
            key={i.slug}
            className="flex items-center gap-4 border rounded-lg p-3"
          >
            <img
              src={i.image}
              alt={i.title}
              className="w-24 h-24 object-cover rounded-md bg-gray-100"
            />

            <div className="flex-1">
              <Link
                href={`/shop/${i.slug}`}
                className="font-semibold hover:underline"
              >
                {i.title}
              </Link>

              <div className="text-gray-500">{money(i.price)}</div>

              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => dec(i.slug)}
                  className="px-2 border rounded"
                  aria-label="Decrease quantity"
                >
                  –
                </button>

                <span className="w-8 text-center">{i.qty}</span>

                <button
                  onClick={() => inc(i.slug)}
                  className="px-2 border rounded"
                  aria-label="Increase quantity"
                >
                  +
                </button>

                <button
                  onClick={() => remove(i.slug)}
                  className="ml-4 text-red-600 underline"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="font-semibold">
              {money((i.qty || 0) * (i.price || 0))}
            </div>
          </div>
        ))}

        <button onClick={clear} className="text-sm underline text-gray-600">
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

        {/* ✅ Checkout Link button (added here) */}
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