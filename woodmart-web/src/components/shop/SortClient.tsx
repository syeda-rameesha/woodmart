// src/components/shop/SortClient.tsx
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type SortOption = { v: string; label: string };
type Props = {
  defaultValue: string;
  options: readonly SortOption[] | SortOption[];
};

export default function SortClient({ defaultValue, options }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const q = sp?.get("q") ?? "";
  const page = sp?.get("page") ?? "1";
  const limit = sp?.get("limit") ?? "12";

  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => {
        const sort = e.target.value;
        const query = `?q=${encodeURIComponent(q)}&page=${encodeURIComponent(
          page
        )}&limit=${encodeURIComponent(limit)}&sort=${encodeURIComponent(sort)}`;
        router.push(`/shop${query}`);
      }}
      className="border rounded-md px-3 py-2"
    >
      {(options || []).map((o) => (
        <option key={o.v} value={o.v}>
          {o.label}
        </option>
      ))}
    </select>
  );
}