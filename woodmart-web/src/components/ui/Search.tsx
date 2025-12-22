"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Item = {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  images?: string[];
  brand?: string;
};

export default function Search() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Item[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // close on outside click
  useEffect(() => {
    const f = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", f);
    return () => window.removeEventListener("click", f);
  }, []);

  // fetch suggestions
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q.trim()) {
        setResults([]);
        setOpen(false);
        return;
      }
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_API_BASE || "woodmart-production.up.railway.app";
        const r = await fetch(`${base}/products/search?q=${encodeURIComponent(q)}&limit=6`);
        const data = await r.json();
        setResults(data.items || []);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const submit = (e: any) => {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="relative w-full max-w-md" ref={ref}>
      <form onSubmit={submit}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q && setOpen(true)}
          placeholder="Search products…"
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </form>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-white shadow max-h-80 overflow-auto">
          {!loading && results.length === 0 ? (
            <div className="px-3 py-3 text-sm text-gray-500">No results</div>
          ) : (
            <ul>
              {results.map((it) => {
                const img = it.images?.[0] || it.image || "/placeholder.png";
                return (
                  <li key={it._id}>
                    <Link
                      href={`/shop/${it.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
                    >
                      <img
                        src={img}
                        className="w-10 h-10 rounded object-cover bg-gray-100"
                      />
                      <div className="text-sm">
                        <div className="font-medium line-clamp-1">{it.title}</div>
                        {it.brand && <div className="text-xs text-gray-500">{it.brand}</div>}
                      </div>
                    </Link>
                  </li>
                );
              })}
              {loading && (
                <li className="px-3 py-2 text-sm text-gray-500">Searching…</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}