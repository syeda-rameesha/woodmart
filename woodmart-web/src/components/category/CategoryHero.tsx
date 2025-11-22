// src/components/category/CategoryHero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function CategoryHero({ slug }: { slug: string }) {
  const cfg = CATEGORIES[slug];
  if (!cfg) return null;

  return (
    <div className="relative overflow-hidden rounded-lg">
      <Image
        src={cfg.heroImage}
        alt={cfg.label}
        width={1600}
        height={500}
        className="h-60 w-full object-cover md:h-72"
        priority
      />

      {/* dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow">
          {cfg.label}
        </h1>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {(cfg.sub ?? []).map((s) => (
            <Link
              key={s.slug}
              href={`/category/${cfg.slug}?sub=${s.slug}`}
              className="rounded-full bg-white/90 px-4 py-1 text-sm font-medium hover:bg-white transition"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}