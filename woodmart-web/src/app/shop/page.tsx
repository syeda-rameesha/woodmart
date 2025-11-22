import Link from "next/link";
import { api } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";

/** build a querystring safely */
function qs(obj: Record<string, any>) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    params.set(k, String(v));
  });
  return `?${params.toString()}`;
}

export const revalidate = 0;

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  // read search params (not awaited)
  const q = (searchParams?.q ?? "").toString();
  const page = Number(searchParams?.page ?? 1);
  const limit = Number(searchParams?.limit ?? 12);
  const sort = (searchParams?.sort ?? "title-asc").toString();

  // sort options
  const sorts = [
    { v: "title-asc", label: "Title (A→Z)" },
    { v: "title-desc", label: "Title (Z→A)" },
    { v: "price-asc", label: "Price (Low→High)" },
    { v: "price-desc", label: "Price (High→Low)" },
    { v: "brand-asc", label: "Brand (A→Z)" },
  ] as const;

  // fetch items (search when q present, else all)
  // define the response shape once (top of file is fine)
type ProductsResp = { items: any[]; total?: number };

// fetch items (search when q present, else all)
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

  // simple client-side sort for the demo (your API can do this server-side)
  const sorted = [...items].sort((a, b) => {
    switch (sort) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "price-asc":
        return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
      case "price-desc":
        return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
      case "brand-asc":
        return (a.brand ?? "").localeCompare(b.brand ?? "");
      default:
        return 0;
    }
  });

  // paginate
  const start = (page - 1) * limit;
  const pageItems = sorted.slice(start, start + limit);
  const pages = Math.max(1, Math.ceil(sorted.length / limit));

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Shop</h1>

      {/* Filters row */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        {/* search box */}
        <form className="flex-1" action="/shop" method="get">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search products…"
            className="w-full border rounded-md px-3 py-2"
          />
        </form>

        {/* sort */}
        <div>
          <label className="mr-2 text-sm text-gray-600">Sort</label>
          <select
            className="border rounded-md px-3 py-2"
            defaultValue={sort}
            onChange={(e) => {
              // no client nav here: this file runs on server
              // users will change & submit using link buttons below
            }}
          >
            {sorts.map((s) => (
              <option key={s.v} value={s.v}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* If searching, show result count */}
      {q && (
        <p className="text-gray-600 mb-4">
          Results for <span className="font-medium">“{q}”</span> — {sorted.length} items
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pageItems.map((p) => (
          <ProductCard key={p._id} {...p} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex items-center justify-between">
        <Link
          href={`/shop${qs({
            q,
            page: Math.max(1, page - 1),
            limit,
            sort,
          })}`}
          className={`px-3 py-2 border rounded ${
            page <= 1 ? "pointer-events-none opacity-50" : ""
          }`}
          aria-disabled={page <= 1}
        >
          Prev
        </Link>

        <span className="text-sm text-gray-600">
          Page <span className="font-medium">{page}</span> of {pages || 1}
        </span>

        <Link
          href={`/shop${qs({
            q,
            page: page + 1,
            limit,
            sort,
          })}`}
          className={`px-3 py-2 border rounded ${
            pages && page >= pages ? "pointer-events-none opacity-50" : ""
          }`}
          aria-disabled={!pages || page >= pages}
        >
          Next
        </Link>
      </div>
    </div>
  );
}