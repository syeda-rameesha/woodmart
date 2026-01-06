"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type Product = {
  _id: string;
  title: string;
  slug: string;
  price?: number;
};

export default function Search() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await api<{ items: Product[] }>(
          `/products/search?q=${encodeURIComponent(q)}&limit=5`
        );
        setResults(res.items || []);
        setOpen(true);
      } catch {
        setResults([]);
        setOpen(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products…"
        className="
          block w-full px-4 py-2 text-sm
          border rounded-md bg-white
          focus:outline-none focus:ring-2 focus:ring-green-600
        "
      />

      {/* Suggestions */}
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg">
          {results.map((p) => (
            <button
              key={p._id}
              onClick={() => {
                setOpen(false);
                router.push(`/products/${p.slug}`);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              <div className="font-medium">{p.title}</div>
              {p.price && (
                <div className="text-xs text-green-600">
                  ${Number(p.price).toFixed(2)}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}