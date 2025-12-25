// src/components/shop/SortClient.tsx
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type SortOption = {
  v: string;
  label: string;
};

type Props = {
  /** current sort value from server (page.tsx) */
  defaultValue: string;
  /** available sort options */
  options: SortOption[];
};

export default function SortClient({ defaultValue, options }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams?.get("q") ?? "";
  const page = searchParams?.get("page") ?? "1";
  const limit = searchParams?.get("limit") ?? "12";

  return (
    <select
      value={defaultValue}
      onChange={(e) => {
        const sort = e.target.value;

        const params = new URLSearchParams();
        if (q) params.set("q", q);
        params.set("page", page);
        params.set("limit", limit);
        params.set("sort", sort);

        router.push(`/shop?${params.toString()}`);
      }}
      className="border rounded-md px-3 py-2"
    >
      {options.map((o) => (
        <option key={o.v} value={o.v}>
          {o.label}
        </option>
      ))}
    </select>
  );
}