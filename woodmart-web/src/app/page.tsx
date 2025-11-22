// src/app/page.tsx
import CategoriesMenu from "@/components/ui/CategoriesMenu";
import ProductGrid from "@/components/ui/ProductGrid";
import CategoryChips from "@/components/category/CategoryChips";
import { api } from "@/lib/api";
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

  const q = sp.q ?? "";
  const sort = sp.sort ?? "";
  const page = sp.page ?? "1";
  const cat = sp.cat ?? "";

  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (sort) query.set("sort", sort);
  if (page) query.set("page", page);
  if (cat) query.set("cat", cat);

  const data = await api<{ items: Item[]; total: number }>(
    `/products?${query.toString()}`
  );
  const items = data?.items ?? [];

  const countEntries = await Promise.all(
    ALL_CATS.map(async (c) => {
      const r = await api<{ items: Item[]; total: number }>(
        `/products?cat=${c.key}&limit=1`
      );
      return [c.key, Number(r?.total ?? r?.items?.length ?? 0)] as const;
    })
  );
  const counts: CountMap = Object.fromEntries(countEntries) as CountMap;

  return (
    <>
      {/* Slider with chips overlay */}
      <div className="container mx-auto px-4 mt-4 mb-6">
        <HeroSlider slides={HOME_SLIDES}>
          <CategoryChips variant="hero" active={cat || ""} counts={counts} />
        </HeroSlider>
      </div>

      {/* Existing layout */}
      <div className="container mx-auto px-4 pb-8 grid grid-cols-12 gap-6">
        <aside className="hidden md:block col-span-12 md:col-span-3">
          <CategoriesMenu />
        </aside>

        <section className="col-span-12 md:col-span-9">
          <h1 className="text-2xl font-bold mb-6">Featured Products</h1>
          <ProductGrid items={items} />
        </section>
      </div>
    </>
  );
}