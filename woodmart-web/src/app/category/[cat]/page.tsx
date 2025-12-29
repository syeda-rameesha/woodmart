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

/* ✅ USE ENV VARIABLE ONLY */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001/api"; // local fallback ONLY

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
    hero: "https://images.unsplash.com/photo-1447933601403-0c6688de566e",
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
    hero: "https://images.unsplash.com/photo-1601758124499-1a5698617934",
  },
};

export default function CategoryPage() {
  const params = useParams<{ cat: string }>();
  const catKey = (params?.cat || "").toLowerCase();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<CountMap>({});

  const meta =
    CATEGORY_META[catKey] ?? {
      title: catKey,
      hero:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    };

  useEffect(() => {
    if (!catKey) return;

    let cancelled = false;

    async function load() {
      try {
        /* ✅ PRODUCTS */
        const res = await fetch(
          `${API_BASE}/products?cat=${encodeURIComponent(catKey)}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (!cancelled) {
          setItems(Array.isArray(data.items) ? data.items : []);
        }

        /* ✅ COUNTS */
        const entries = await Promise.all(
          ALL_CATS.map(async (c) => {
            const r = await fetch(
              `${API_BASE}/products?cat=${encodeURIComponent(
                c.key
              )}&limit=1`,
              { cache: "no-store" }
            );
            const d = await r.json();
            return [
              c.key,
              Number(d.total ?? d.items?.length ?? 0),
            ] as const;
          })
        );

        if (!cancelled) {
          setCounts(Object.fromEntries(entries));
        }
      } catch (err) {
        console.error("Category fetch failed:", err);
        if (!cancelled) {
          setItems([]);
          setCounts({});
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [catKey]);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <div
        className="h-56 md:h-72 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${meta.hero})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div>
            <h1 className="text-4xl font-bold">{meta.title}</h1>
            {meta.description && (
              <p className="mt-2 opacity-90">{meta.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* CHIPS */}
      <div className="mt-4">
        <CategoryChips active={catKey} counts={counts} />
      </div>

      {/* PRODUCTS */}
      <div className="container mx-auto px-4 mt-6">
        <p className="text-sm text-gray-500 mb-4">
          {loading ? "Loading…" : `${items.length} product(s)`}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((p) => (
            <Link
              key={p._id}
              href={`/shop/${p.slug}`}
              className="border rounded-md overflow-hidden hover:shadow bg-white"
            >
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src={p.image || p.images?.[0] || "/placeholder.png"}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <div className="text-xs text-gray-500">{p.brand}</div>
                <div className="font-medium truncate">{p.title}</div>
                <div className="text-sm mt-1 font-semibold">
                  ${p.salePrice ?? p.price}
                </div>
              </div>
            </Link>
          ))}

          {!loading && items.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              No products found for this category.
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link href="/" className="text-sm underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}