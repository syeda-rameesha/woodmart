// src/components/checkout/CheckoutForm.tsx
"use client";

import React, { useState } from "react";

export type CheckoutFormValues = {
  fullName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  zip: string;
  shippingMethod: "standard" | "express";
  paymentMethod: "cod" | "card";
};

type Props = {
  loading?: boolean;
  onSubmit: (values: CheckoutFormValues) => void | Promise<void>;
};

export default function CheckoutForm({ loading, onSubmit }: Props) {
  const [values, setValues] = useState<CheckoutFormValues>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    shippingMethod: "standard",
    paymentMethod: "cod",
  });

  function update<K extends keyof CheckoutFormValues>(key: K, v: CheckoutFormValues[K]) {
    setValues((s) => ({ ...s, [key]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(values);
  }

  const field =
    "w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-md border bg-white p-4">
      <h2 className="text-lg font-semibold">Billing details</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">Full name</label>
          <input
            className={field}
            value={values.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input
            type="email"
            className={field}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Phone</label>
          <input
            className={field}
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">ZIP / Postal code</label>
          <input
            className={field}
            value={values.zip}
            onChange={(e) => update("zip", e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm">Address</label>
          <input
            className={field}
            value={values.address}
            onChange={(e) => update("address", e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm">City</label>
          <input
            className={field}
            value={values.city}
            onChange={(e) => update("city", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">Shipping method</label>
          <select
            className={field}
            value={values.shippingMethod}
            onChange={(e) => update("shippingMethod", e.target.value as any)}
          >
            <option value="standard">Standard (3–5 days)</option>
            <option value="express">Express (1–2 days)</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm">Payment method</label>
          <select
            className={field}
            value={values.paymentMethod}
            onChange={(e) => update("paymentMethod", e.target.value as any)}
          >
            <option value="cod">Cash on delivery</option>
            <option value="card">Credit / Debit card</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Placing order…" : "Place order"}
        </button>
      </div>
    </form>
  );
}