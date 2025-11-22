"use client";

import { useCart } from "@/store/useCart";

// Local money formatter (avoids import issues)
const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    isFinite(n) ? n : 0
  );

export default function CartTotals() {
  // Be tolerant of store typing differences
  const cart = useCart() as any;

  const items: any[] = Array.isArray(cart?.items) ? cart.items : [];
  const subtotalNum: number =
    typeof cart?.subtotal === "number"
      ? cart.subtotal
      : Number(cart?.subtotal ?? 0);

  const totalItems = items.reduce(
    (sum, i) => sum + (typeof i?.qty === "number" ? i.qty : Number(i?.qty ?? 0)),
    0
  );

  // Adjust later if you add real shipping logic
  const shipping = 0;
  const grand = subtotalNum + shipping;

  const clear =
    typeof cart?.clear === "function" ? (cart.clear as () => void) : () => {};

  return (
    <aside className="sticky top-20 border rounded-lg p-4 bg-white">
      <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

      <div className="flex justify-between text-sm mb-2">
        <span>Items</span>
        <span>{totalItems}</span>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <span>Subtotal</span>
        <span>{money(subtotalNum)}</span>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <span>Shipping</span>
        <span>{money(shipping)}</span>
      </div>

      <hr className="my-2" />

      <div className="flex justify-between font-semibold text-sm mb-4">
        <span>Total</span>
        <span>{money(grand)}</span>
      </div>

      <button
        onClick={clear}
        className="w-full rounded-md bg-gray-100 hover:bg-gray-200 text-sm py-2"
      >
        Clear cart
      </button>
    </aside>
  );
}