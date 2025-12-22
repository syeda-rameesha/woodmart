// src/app/category/[cat]/page.tsx
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

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

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
    description: "Cookware, tools & accessories for your kitchen.",
  },
  fashion: {
    title: "Fashion",
    hero: "https://files.catbox.moe/zw24zm.jpeg",
    description: "Trending apparel & accessories.",
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
  // ✅ read [cat] from URL
  const params = useParams<{ cat: string }>();
  const catKey = (params?.cat || "").toLowerCase(); // e.g. "fashion"

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Category");
  const [hero, setHero] = useState("");
  const [desc, setDesc] = useState("");
  const [counts, setCounts] = useState<CountMap>({});

  useEffect(() => {
    if (!catKey) return; // nothing to load yet

    let cancelled = false;

    (async () => {
      console.log("CategoryPage catKey =", catKey);

      // ----- meta / hero -----
      const meta =
        CATEGORY_META[catKey] ?? {
          title: catKey || "Category",
          hero: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
        };

      if (!cancelled) {
        setTitle(meta.title);
        setHero(meta.hero);
        setDesc(meta.description || "");
      }

      // ----- fetch products for this category -----
      try {
        const res = await fetch(
          `${API_BASE}/products?cat=${encodeURIComponent(catKey)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        console.log("Category products response", data);

        if (!cancelled) {
          setItems(Array.isArray(data.items) ? data.items : []);
        }
      } catch (err) {
        console.error("Category products fetch error", err);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }

      // ----- counts for chips -----
      try {
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
        if (!cancelled) setCounts(Object.fromEntries(entries));
      } catch (err) {
        console.error("Category counts fetch error", err);
        if (!cancelled) setCounts({});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [catKey]);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <div
        className="h-56 md:h-72 w-full bg-cover bg-center rounded-md relative"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="px-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              {title}
            </h1>
            {!!desc && (
              <p className="mt-2 text-white/90 max-w-2xl">{desc}</p>
            )}
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="mt-4">
        {/* ✅ use catKey for active */}
        <CategoryChips active={catKey} counts={counts} />
      </div>

      {/* RESULTS */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mt-6 mb-2">
          <p className="text-sm text-gray-500">
            {loading ? "Loading…" : `${items.length} product(s)`}
          </p>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-black underline"
          >
            ← Back to home
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((p) => (
            <Link
              key={p._id}
              href={`/shop/${p.slug}`}
              className="border rounded-md overflow-hidden hover:shadow transition bg-white"
            >
              <div className="aspect-[4/3] bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image || p.images?.[0] || "/placeholder.png"}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <div className="text-xs text-gray-500">{p.brand}</div>
                <div className="font-medium truncate">{p.title}</div>
                <div className="text-sm mt-1">
                  {p.salePrice != null ? (
                    <>
                      <span className="font-semibold">
                        ${p.salePrice}
                      </span>{" "}
                      <span className="line-through text-gray-400">
                        ${p.price}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold">
                      ${p.price}
                    </span>
                  )}
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
      </div>
    </div>
  );
}