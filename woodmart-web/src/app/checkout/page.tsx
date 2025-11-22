// src/app/checkout/page.tsx
// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// If your @ alias works, keep these:
import OrderSummary from "@/components/checkout/OrderSummary";
import CheckoutForm from "@/components/checkout/CheckoutForm";
// If your @ alias does NOT resolve, comment the two lines above and use these:
// import OrderSummary from "../../components/checkout/OrderSummary";
// import CheckoutForm from "../../components/checkout/CheckoutForm";

import { useCart } from "@/store/useCart";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api";

export default function CheckoutPage() {
  const router = useRouter();

  // cart store (typed loosely so nothing errors)
  const cart = (useCart as any)((s: any) => s.cart) as any[];
  const setQty = (useCart as any)((s: any) => s.setQty) as (id: string, qty: number) => void;
  const remove = (useCart as any)((s: any) => s.remove) as (id: string) => void;

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // totals (free shipping over $150)
  const { subtotal, shippingFee, total } = useMemo(() => {
    const subtotal = (cart ?? []).reduce((sum: number, item: any) => {
      const price = item?.salePrice ?? item?.price ?? 0;
      const qty = item?.qty ?? 1;
      return sum + price * qty;
    }, 0);

    const shippingFee = subtotal === 0 || subtotal >= 150 ? 0 : 12;
    const total = subtotal + shippingFee;
    return { subtotal, shippingFee, total };
  }, [cart]);

  async function placeOrder(values: any) {
    if (!cart || cart.length === 0) return;

    setPlacing(true);
    setError(null);

    try {
      const payload = {
        customer: values,
        shipping: { method: values.shippingMethod, fee: shippingFee },
        payment: { method: values.paymentMethod },
        items: cart.map((i: any) => ({
          productId: i?._id,
          title: i?.title,
          slug: i?.slug,
          image: i?.image || i?.images?.[0] || "",
          price: i?.salePrice ?? i?.price ?? 0,
          qty: i?.qty ?? 1,
        })),
        amounts: { subtotal, shipping: shippingFee, total },
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || `Order failed (${res.status})`);
      }

      const oid = data?.id || data?.orderId || "";
      router.push(oid ? `/checkout/success?order=${encodeURIComponent(oid)}` : "/checkout/success");
    } catch (e: any) {
      setError(e?.message || "Unable to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-12">
      {/* Left: form */}
      <section className="lg:col-span-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Checkout</h1>
          <p className="text-sm text-gray-500">
            Complete your details below to place the order.
          </p>
        </div>

        <CheckoutForm onSubmit={placeOrder} loading={placing} />

        {error && (
          <div className="mt-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
      </section>

      {/* Right: summary */}
      <aside className="lg:col-span-5">
        <OrderSummary
          cart={cart as any[]}
          subtotal={subtotal}
          shipping={shippingFee}
          total={total}
          onQtyChange={(id, qty) => setQty?.(id, qty)}
          onRemove={(id) => remove?.(id)}
        />
      </aside>
    </div>
  );
}