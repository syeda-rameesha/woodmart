import CategoriesMenu from "@/components/ui/CategoriesMenu";
import ProductGrid from "@/components/ui/ProductGrid";
import CategoryChips from "@/components/category/CategoryChips";
import api from "@/lib/api";
import { ALL_CATS } from "@/lib/categories";

import HeroSlider from "@/components/home/HeroSlider";
import { HOME_SLIDES } from "@/lib/home";

export const revalidate = 0;

type Item = {
  _id: string;
  title: string;
  slug: string;
  brand?: string;
  price: number;
  salePrice?: number;
  image?: string;
  images?: string[];
  category?: string;
};

type CountMap = Record<string, number>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const cat = sp.cat ?? "";

  /* ---------------- CATEGORY COUNTS ---------------- */
  const countEntries = await Promise.all(
    ALL_CATS.map(async (c) => {
      const r = await api<{ items: Item[]; total: number }>(
        `/products?cat=${c.key}&limit=1`
      );
      return [c.key, Number(r?.total ?? r?.items?.length ?? 0)] as const;
    })
  );
  const counts: CountMap = Object.fromEntries(countEntries);

  /* ---------------- BEST SELLERS ---------------- */
  const bestSellerRes = await api<{ items: Item[] }>(
    `/products?sort=createdAt-desc&limit=4`
  );
  const bestSellers = bestSellerRes.items ?? [];

  /* ---------------- 🔥 DEALS / SALE PRODUCTS ---------------- */
  const saleRes = await api<{ items: Item[] }>(
    `/products?limit=8`
  );

  const saleItems =
    saleRes.items?.filter(
      (p) => p.salePrice && Number(p.salePrice) > 0
    ) ?? [];

  /* ---------------- CATEGORY PRODUCTS ---------------- */
  let items: Item[] = [];

  if (cat) {
    const data = await api<{ items: Item[] }>(
      `/products?cat=${cat}`
    );
    items = data.items ?? [];
  }

  return (
    <>
      {/* HERO */}
      <div className="container mx-auto px-4 mt-4 mb-6">
        <HeroSlider slides={HOME_SLIDES}>
  {/* Desktop only category chips */}
  <div className="hidden md:block">
    <CategoryChips variant="hero" active={cat} counts={counts} />
  </div>
</HeroSlider>
      </div>

      {/* 🔥 DEALS OF THE DAY */}
      {saleItems.length > 0 && (
        <section className="container mx-auto px-4 mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            Deals of the Day
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {saleItems.map((p) => (
              <div
                key={p._id}
                className="border rounded-md p-3 bg-white hover:shadow transition"
              >
                <div className="relative">
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    SALE
                  </span>

                  <img
                    src={p.image || p.images?.[0] || "/placeholder.png"}
                    alt={p.title}
                    className="w-full h-40 object-cover rounded"
                  />
                </div>

                <div className="mt-2">
                  <p className="text-sm font-medium truncate">
                    {p.title}
                  </p>

                  <div className="text-sm mt-1">
                    <span className="text-red-600 font-semibold mr-2">
                      ${p.salePrice}
                    </span>
                    <span className="line-through text-gray-400">
                      ${p.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MAIN LAYOUT */}
      <div className="container mx-auto px-4 pb-10 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block col-span-12 md:col-span-3">
          <CategoriesMenu />
        </aside>

        {/* Content */}
        <section className="col-span-12 md:col-span-9 space-y-12">

          {/* BEST SELLERS */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Best Sellers
            </h2>
            <ProductGrid items={bestSellers} />
          </div>

          {/* CATEGORY PRODUCTS */}
          {!cat ? (
            <div className="border rounded-lg p-10 text-center text-gray-500">
              <h3 className="text-xl font-semibold mb-2">
                Browse Categories
              </h3>
              <p>Select a category to view products.</p>
            </div>
          ) : items.length === 0 ? (
            <div className="border rounded-lg p-10 text-center text-gray-500">
              No products found for this category.
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4 capitalize">
                {cat} Products
              </h2>
              <ProductGrid items={items} />
            </div>
          )}

        </section>
      </div>
    </>
  );
}