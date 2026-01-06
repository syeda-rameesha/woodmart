// src/components/category/CategoryChips.tsx
"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import CatIcon from "@/components/ui/CatIcon";

export type CountMap = Record<string, number>;

export const ALL_CATS = [
  { key: "clocks",      label: "Clocks" },
  { key: "lighting",    label: "Lighting" },
  { key: "furniture",   label: "Furniture" },
  { key: "accessories", label: "Accessories" },
  { key: "cooking",     label: "Cooking" },
  { key: "toys",        label: "Toys" },
  { key: "fashion",     label: "Fashion" },
] as const;

type Props = {
  active?: string;
  counts?: CountMap;
  /** "hero" = pills used inside the slider overlay */
  variant?: "default" | "hero";
};

export default function CategoryChips({
  active = "",
  counts = {},
  variant = "default",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const wrapClass =
    variant === "hero"
      ? "flex flex-wrap items-center justify-center gap-3"
      : "flex flex-wrap items-center gap-3";

  const chipBase =
    "transition rounded-full border flex items-center gap-2 whitespace-nowrap";

  const chipHero =
    "bg-white/90 hover:bg-white shadow px-4 py-2 backdrop-blur text-gray-900";
  const chipDefault = "bg-white hover:bg-gray-50 px-3 py-1.5";

  return (
    <div className={wrapClass}>
      {ALL_CATS.map((c) => {
        const isActive = active === c.key || pathname.endsWith(`/${c.key}`);
        const n = counts[c.key] ?? 0;

        return (
          <button
            key={c.key}
            onClick={() => router.push(`/category/${c.key}`)}
            className={[
              chipBase,
              variant === "hero" ? chipHero : chipDefault,
              isActive ? "ring-2 ring-black/10" : "",
            ].join(" ")}
            aria-pressed={isActive}
            title={c.label}
          >
            {/* ✅ FIX: type-safe cast to satisfy CatIcon props */}
            <CatIcon {...({ name: c.key, className: "h-5 w-5" } as any)} />

            <span className="text-sm">{c.label}</span>
            <span className="text-xs text-gray-500">
              {n} {n === 1 ? "product" : "products"}
            </span>
          </button>
        );
      })}
    </div>
  );
}