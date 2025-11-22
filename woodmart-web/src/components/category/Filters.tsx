"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

function useMergeQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return useCallback(
    (patch: Record<string, string | number | undefined>) => {
      const sp = new URLSearchParams(params.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === undefined || v === "") sp.delete(k);
        else sp.set(k, String(v));
      });
      // reset page on any filter change
      sp.delete("page");
      router.push(`${pathname}?${sp.toString()}`);
    },
    [params, pathname, router]
  );
}

export default function Filters({
  total,
  page,
  pages,
}: {
  total: number;
  page: number;
  pages: number;
}) {
  const params = useSearchParams();
  const merge = useMergeQuery();

  const [min, setMin] = useState(params.get("min") || "");
  const [max, setMax] = useState(params.get("max") || "");
  const sort = params.get("sort") || "";
  const limit = params.get("limit") || "12";

  const pageInfo = useMemo(() => `${total} products`, [total]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-gray-600">{pageInfo}</div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Price range */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-24 rounded border px-2 py-1"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            onBlur={() => merge({ min: min || undefined })}
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            placeholder="Max"
            className="w-24 rounded border px-2 py-1"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            onBlur={() => merge({ max: max || undefined })}
          />
        </div>

        {/* Per page */}
        <select
          className="rounded border px-2 py-1"
          value={limit}
          onChange={(e) => merge({ limit: e.target.value })}
        >
          {["9", "12", "18", "24"].map((n) => (
            <option key={n} value={n}>
              Show: {n}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="rounded border px-2 py-1"
          value={sort}
          onChange={(e) => merge({ sort: e.target.value })}
        >
          <option value="">Default sorting</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="title-asc">Title: A → Z</option>
          <option value="title-desc">Title: Z → A</option>
          <option value="brand-asc">Brand: A → Z</option>
        </select>
      </div>
    </div>
  );
}