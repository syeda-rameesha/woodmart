"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CatIcon from "@/components/ui/CatIcon";
import { ALL_CATS, CountMap } from "./CategoryChips";

type Props = {
  active?: string;
  counts?: CountMap;
};

export default function MobileCategoryDropdown({
  active = "",
  counts = {},
}: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="sm:hidden relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="mx-auto flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow"
      >
        Categories
        <span className="text-xs">▾</span>
      </button>

      {/* Overlay */}
      {open && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* panel */}
          <div className="fixed inset-x-4 top-28 z-50 rounded-xl bg-white shadow-xl p-4">
            <div className="space-y-3">
              {ALL_CATS.map((c) => {
                const n = counts[c.key] ?? 0;
                const isActive = active === c.key;

                return (
                  <button
                    key={c.key}
                    onClick={() => {
                      setOpen(false);
                      router.push(`/category/${c.key}`);
                    }}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left ${
                      isActive ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <CatIcon name={c.key} className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{c.label}</div>
                      <div className="text-xs text-gray-500">
                        {n} {n === 1 ? "product" : "products"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}