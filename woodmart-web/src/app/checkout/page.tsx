// src/app/checkout/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "woodmart-production.up.railway.app";
const money = (n?: number) => `$${Number(n || 0).toFixed(2)}`;

export default function CheckoutPageClient() {
  const router = useRouter();

  // Zustand cart
  const storeCart = useCart((s) => s.cart);
  const clearStore = useCart((s) => s.clear);

  // snapshot from localStorage (persist fallback)
  const [lsSnapshot, setLsSnapshot] = useState<any>(null);
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("woodmart-cart") : null;
      setLsSnapshot(raw ? JSON.parse(raw) : null);
    } catch {
      setLsSnapshot(null);
    }
  }, [storeCart]);

  function parseLocalCartItems(snap: any) {
    if (!snap) return [];
    return snap?.state?.cart || snap?.cart || snap?.items || [];
  }

  const localItems = useMemo(() => parseLocalCartItems(lsSnapshot), [lsSnapshot]);
  const displayCart = storeCart && storeCart.length > 0 ? storeCart : localItems;

  const computedSubtotal = useMemo(() => {
    if (!displayCart || displayCart.length === 0) return 0;
    return displayCart.reduce((s: number, it: any) => s + (Number(it.price || 0) * Number(it.qty || 1)), 0);
  }, [displayCart]);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [ship, setShip] = useState("standard");
  const [payment, setPayment] = useState("cod");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!displayCart || displayCart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }

    const items = displayCart.map((i: any) => ({
      productId: i._id ?? i.productId ?? null,
      title: i.title,
      slug: i.slug,
      image: i.image,
      price: Number(i.price || 0),
      qty: Number(i.qty || 1),
    }));

    const orderBody: any = {
      customer: {
        name,
        email,
        phone,
        zip,
        address1: address,
        city,
      },
      shipping: { method: ship, fee: 0 },
      payment: {
        method: payment,
        status: payment === "cod" ? "unpaid" : "paid",
      },
      items,
      amounts: {
        subtotal: computedSubtotal,
        shipping: 0,
        total: computedSubtotal,
      },
      createdAt: new Date().toISOString(),
    };

    // optional: explicitly set valid status (schema allows "pending" or "new")
    // orderBody.status = "new";

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // surface backend message when available
        const msg = data?.message || `Order failed (${res.status})`;
        setError(msg);
        return;
      }

      // success — clear cart
      clearStore();

      // store id for success page fallback
      const id = data?.id ?? data?._id ?? data?.data?.id ?? null;
      if (id && typeof window !== "undefined") {
        try {
          sessionStorage.setItem("lastOrderId", String(id));
        } catch {
          /* ignore */
        }
      }

      // redirect to your existing success route (/checkout/success)
      const target = id ? `/checkout/success?orderId=${encodeURIComponent(String(id))}` : `/checkout/success`;
      router.push(target);
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="border rounded p-6 lg:col-span-2 bg-white">
        <h2 className="text-xl font-semibold mb-4">Checkout</h2>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <label className="block mb-2 text-sm">
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border p-2 rounded" />
        </label>

        <label className="block mb-2 text-sm">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border p-2 rounded" />
        </label>

        <label className="block mb-2 text-sm">
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full border p-2 rounded" />
        </label>

        <label className="block mb-2 text-sm">
          ZIP / Postal code
          <input value={zip} onChange={(e) => setZip(e.target.value)} className="mt-1 w-full border p-2 rounded" />
        </label>

        <label className="block mb-2 text-sm">
          Address
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full border p-2 rounded" />
        </label>

        <label className="block mb-4 text-sm">
          City
          <input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 w-full border p-2 rounded" />
        </label>

        <div className="flex gap-4 mb-4">
          <label className="flex-1">
            Shipping method
            <select value={ship} onChange={(e) => setShip(e.target.value)} className="mt-1 w-full border p-2 rounded">
              <option value="standard">Standard (3–5 days)</option>
              <option value="express">Express (1–2 days)</option>
            </select>
          </label>

          <label className="flex-1">
            Payment method
            <select value={payment} onChange={(e) => setPayment(e.target.value)} className="mt-1 w-full border p-2 rounded">
              <option value="cod">Cash on delivery</option>
              <option value="card">Card (simulate)</option>
            </select>
          </label>
        </div>

        <button type="submit" disabled={loading} className="inline-block bg-black text-white px-4 py-2 rounded">
          {loading ? "Placing order..." : "Place order"}
        </button>
      </form>

      <aside className="border rounded p-6 bg-white">
        <h3 className="font-semibold mb-3">Your Order</h3>

        {displayCart && displayCart.length > 0 ? (
          <div className="space-y-3">
            {displayCart.map((it: any) => (
              <div key={it.slug ?? it._id} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt={it.title} className="w-12 h-12 object-cover" />
                <div className="flex-1 text-sm">
                  <div className="font-medium">{it.title}</div>
                  <div className="text-xs text-gray-500">{it.qty} × {money(it.price)}</div>
                </div>
                <div className="text-sm font-semibold">{money((it.price || 0) * (it.qty || 0))}</div>
              </div>
            ))}

            <hr />

            <div className="flex justify-between text-sm">
              <div>Subtotal</div>
              <div className="font-semibold">{money(computedSubtotal)}</div>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <div>Shipping</div>
              <div>Calculated at checkout</div>
            </div>

            <div className="flex justify-between text-lg font-bold mt-2">
              <div>Total</div>
              <div>{money(computedSubtotal)}</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Your cart is empty.</div>
        )}
      </aside>
    </div>
  );
}