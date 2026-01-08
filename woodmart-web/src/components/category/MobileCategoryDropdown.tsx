"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CatIcon from "@/components/ui/CatIcon";
import { ALL_CATS, CountMap } from "@/components/category/CategoryChips";

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
    <div className="md:hidden relative">
      {/* Toggle */}
      <button
        onClick={() => setOpen(true)}
        className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-white/90"
      >
        Categories
        <span className="text-xs">⌄</span>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60">
          <div className="absolute inset-x-0 top-24 mx-auto w-[92%] max-w-sm rounded-xl bg-black/70 backdrop-blur p-4">
            {ALL_CATS.map((c) => {
              const isActive = active === c.key;
              const n = counts[c.key] ?? 0;

              return (
                <button
                  key={c.key}
                  onClick={() => {
                    setOpen(false);
                    router.push(`/category/${c.key}`);
                  }}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-white ${
                    isActive ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <CatIcon name={c.key} className="h-5 w-5 opacity-90" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{c.label}</div>
                    <div className="text-xs opacity-70">
                      {n} {n === 1 ? "Product" : "Products"}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="mt-3 w-full rounded-lg border border-white/20 py-2 text-sm text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}