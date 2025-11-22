"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/store/useCart";

type Props = { open: boolean; onClose: () => void };

// tiny helper
const money = (n: number) => `$${Number(n || 0).toFixed(2)}`;

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, inc, dec, remove, clear } = useCart();
  const subtotal = cart.reduce((s: number, i: any) => s + (i.price || 0) * (i.qty || 0), 0);

  // close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 h-full w-[92%] sm:w-[420px] bg-white shadow-xl z-[60]
        transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <header className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold">Your cart</h3>
          <button onClick={onClose} className="text-sm underline">Close</button>
        </header>

        {/* Empty state */}
        {!cart.length ? (
          <div className="p-6">
            <p className="text-gray-600">Your cart is empty.</p>
            <Link href="/shop" onClick={onClose} className="inline-block mt-3 underline">
              Continue shopping →
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="p-5 space-y-4 overflow-y-auto h-[calc(100%-190px)]">
              {cart.map((i: any) => (
                <div key={i.slug} className="flex gap-3">
                  <img
                    src={i.image}
                    alt={i.title}
                    className="w-20 h-20 rounded-md object-cover bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${i.slug}`}
                      className="font-medium hover:underline line-clamp-1"
                      onClick={onClose}
                    >
                      {i.title}
                    </Link>

                    <div className="text-gray-500 text-sm">{money(i.price)}</div>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => dec(i.slug)}
                        className="h-7 px-2 border rounded"
                        aria-label="Decrease"
                      >
                        –
                      </button>
                      <span className="w-8 text-center">{i.qty}</span>
                      <button
                        onClick={() => inc(i.slug)}
                        className="h-7 px-2 border rounded"
                        aria-label="Increase"
                      >
                        +
                      </button>

                      <button
                        onClick={() => remove(i.slug)}
                        className="ml-3 text-red-600 text-sm underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="font-semibold whitespace-nowrap">
                    {money((i.qty || 0) * (i.price || 0))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <footer className="border-t p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">{money(subtotal)}</span>
              </div>
              <div className="text-xs text-gray-500">
                Shipping & taxes calculated at checkout.
              </div>
              <div className="flex gap-3">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex-1 border rounded-md py-3 text-center"
                >
                  View cart
                </Link>
                <button className="flex-1 bg-black text-white rounded-md py-3">
                  Checkout
                </button>
              </div>
              <button onClick={clear} className="text-xs underline text-gray-600">
                Clear cart
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}