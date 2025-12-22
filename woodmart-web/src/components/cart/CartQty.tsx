// src/components/cart/CartQty.tsx
"use client";

import { useState, useEffect } from "react";

type Props = {
  productId: string;
  value: number; // current qty
  disabled?: boolean;
  /** Called immediately when user changes UI - parent should update its state */
  onChange: (productId: string, newQty: number) => void;
  /** Optional: if you want the component to call the API itself (debounced) */
  onRemoteChange?: (productId: string, newQty: number) => Promise<void>;
};

export default function CartQty({ productId, value, disabled, onChange, onRemoteChange }: Props) {
  const [qty, setQty] = useState<number>(Math.max(1, Number(value ?? 1)));

  // keep local qty in sync when parent value changes
  useEffect(() => {
    setQty(Math.max(1, Number(value ?? 1)));
  }, [value]);

  // debounce remote updates if onRemoteChange provided
  useEffect(() => {
    if (!onRemoteChange) return;
    const id = setTimeout(() => {
      // fire-and-forget
      onRemoteChange(productId, qty).catch((err) => {
        console.error("remote qty update failed", err);
      });
    }, 400); // 400ms debounce
    return () => clearTimeout(id);
  }, [qty, productId, onRemoteChange]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const n = Number(e.target.value);
    const newQty = isNaN(n) || n < 1 ? 1 : Math.floor(n);
    setQty(newQty);
    onChange(productId, newQty); // tell parent immediately
  }

  return (
    <input
      aria-label="Quantity"
      type="number"
      min={1}
      value={qty}
      onChange={handleChange}
      disabled={disabled}
      className="w-16 text-center border rounded px-1 py-0.5"
    />
  );
}