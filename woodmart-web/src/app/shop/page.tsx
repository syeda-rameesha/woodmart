// src/app/shop/page.tsx
import Link from "next/link";
import api from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import SortClient from "@/components/shop/SortClient";

export const revalidate = 0;

/** build a querystring safely */
function qs(obj: Record<string, any>) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    params.set(k, String(v));
  });
  return `?${params.toString()}`;
}

type ProductsResp = {
  items: any[];
  total?: number;
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // ✅ NEXT 15: must await searchParams
  const params = (await searchParams) ?? {};

  const q = (params.q ?? "").toString();
  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 12);
  const sort = (params.sort ?? "createdAt-desc").toString();

  let items: any[] = [];

  if (q.trim()) {
    const data = await api<ProductsResp>(
      `/products/search?q=${encodeURIComponent(q)}&limit=48`
    );
    items = data.items ?? [];
  } else {
    const data = await api<ProductsResp>(`/products`);
    items = data.items ?? [];
  }

  // sort
  const sorted = [...items].sort((a, b) => {
    const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;

    switch (sort) {
      case "createdAt-asc":
        return ta - tb;
      case "createdAt-desc":
      default:
        return tb - ta;
    }
  });

  // pagination
  const start = (page - 1) * limit;
  const pageItems = sorted.slice(start, start + limit);
  const pages = Math.max(1, Math.ceil(sorted.length / limit));

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Shop</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <form className="flex-1" action="/shop" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search products…"
            className="w-full border px-3 py-2 rounded"
          />
        </form>

        <SortClient
          defaultValue={sort}
          options={[
            { v: "createdAt-desc", label: "Newest first" },
            { v: "createdAt-asc", label: "Oldest first" },
          ]}
        />
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pageItems.map((p) => (
          <ProductCard key={p._id} {...p} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <span>
          Page <b>{page}</b> of <b>{pages}</b>
        </span>

        <Link
          href={`/shop${qs({ q, page: page + 1, limit, sort })}`}
          className={`px-3 py-2 border rounded ${
            page >= pages ? "pointer-events-none opacity-50" : ""
          }`}
          aria-disabled={page >= pages}
        >
          Next
        </Link>
      </div>
    </div>
  );
}