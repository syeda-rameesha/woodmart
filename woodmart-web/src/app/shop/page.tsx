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
  pages?: number;
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // ✅ Next.js 15 requirement
  const params = (await searchParams) ?? {};

  const q = (params.q ?? "").toString();
  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 12);
  const sort = (params.sort ?? "createdAt-desc").toString();

  let items: any[] = [];
  let pages = 1;

  // 🔍 SEARCH (not paginated)
  if (q.trim()) {
    const data = await api<ProductsResp>(
      `/products/search?q=${encodeURIComponent(q)}&limit=48`
    );
    items = data.items ?? [];
    pages = 1;
  }
  // 📦 NORMAL LIST (paginated)
  else {
    const data = await api<ProductsResp>(
      `/products?page=${page}&limit=${limit}&sort=${sort}`
    );
    items = data.items ?? [];
    pages = data.pages ?? 1;
  }

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
      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((p) => (
            <ProductCard key={p._id} {...p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <span>
          Page <b>{page}</b> of <b>{pages}</b>
        </span>

        {/* Previous */}
        <Link
          href={`/shop${qs({ q, page: page - 1, limit, sort })}`}
          className={`px-3 py-2 border rounded ${
            page <= 1 ? "pointer-events-none opacity-50" : ""
          }`}
          aria-disabled={page <= 1}
        >
          Previous
        </Link>

        {/* Next */}
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