"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import CategoryChips from "@/components/category/CategoryChips";
import { ALL_CATS } from "@/lib/categories";

type Item = {
  _id: string;
  title: string;
  slug: string;
  brand?: string;
  price?: number;
  salePrice?: number;
  image?: string;
  images?: string[];
};

type CountMap = Record<string, number>;

// ✅ FINAL: SINGLE SOURCE OF TRUTH
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

const CATEGORY_META: Record<
  string,
  { title: string; hero: string; description?: string }
> = {
  furniture: {
    title: "Furniture",
    hero: "https://files.catbox.moe/dfux91.jpeg",
    description: "Chairs, tables, storage and more to style your home.",
  },
  cooking: {
    title: "Cooking",
    hero: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1600&auto=format&fit=crop",
  },
  fashion: {
    title: "Fashion",
    hero: "https://files.catbox.moe/zw24zm.jpeg",
  },
  accessories: {
    title: "Accessories",
    hero: "https://files.catbox.moe/7wmool.jpeg",
  },
  clocks: {
    title: "Clocks",
    hero: "https://files.catbox.moe/dga7s3.jpeg",
  },
  lighting: {
    title: "Lighting",
    hero: "https://files.catbox.moe/c0g5ms.jpeg",
  },
  toys: {
    title: "Toys",
    hero: "https://images.unsplash.com/photo-1601758124499-1a5698617934?q=80&w=1600&auto=format&fit=crop",
  },
};

export default function CategoryPage() {
  const params = useParams<{ cat: string }>();
  const catKey = params.cat.toLowerCase();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<CountMap>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `${API_BASE}/products?cat=${encodeURIComponent(catKey)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (!cancelled) setItems(data.items || []);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }

      try {
        const entries = await Promise.all(
          ALL_CATS.map(async (c) => {
            const r = await fetch(
              `${API_BASE}/products?cat=${encodeURIComponent(c.key)}&limit=1`,
              { cache: "no-store" }
            );
            const d = await r.json();
            return [c.key, d.total ?? 0] as const;
          })
        );
        if (!cancelled) setCounts(Object.fromEntries(entries));
      } catch {
        if (!cancelled) setCounts({});
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [catKey]);

  const meta = CATEGORY_META[catKey];

  return (
    <div className="min-h-screen">
      <div
        className="h-56 md:h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${meta?.hero})` }}
      >
        <div className="h-full bg-black/40 flex items-center justify-center text-white">
          <h1 className="text-4xl font-bold">{meta?.title}</h1>
        </div>
      </div>
      <div className="mt-12 md:mt-2">
      <CategoryChips active={catKey} counts={counts} />
       </div>

      <div className="container mx-auto px-4 mt-6">
        {loading && <p>Loading…</p>}

        {!loading && items.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No products found for this category.
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((p) => (
            <Link
              key={p._id}
              href={`/shop/${p.slug}`}
              className="border rounded overflow-hidden"
            >
              <img
                src={p.image || p.images?.[0] || "/placeholder.png"}
                alt={p.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-2">
                <p className="font-medium">{p.title}</p>
                <p>${p.salePrice ?? p.price}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/" className="block text-center mt-6 underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}