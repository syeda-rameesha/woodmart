// src/components/ui/ProductGrid.tsx
import ProductCard from "./ProductCard";

type Item = {
  _id?: string;
  slug?: string;
  title?: string;
  price?: number;
  salePrice?: number;
  brand?: string;
  image?: string;
  images?: string[];
};

export default function ProductGrid({
  items = [],
}: {
  items?: unknown[];
}) {
  // ✅ Filter valid objects only
  const safe: Item[] = Array.isArray(items)
    ? items.filter(
        (x): x is Item =>
          !!x &&
          typeof x === "object" &&
          ("_id" in x || "title" in x || "slug" in x)
      )
    : [];

  if (!safe.length) {
    return <p className="text-gray-500">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {safe.map((p, i) => (
        <ProductCard
          key={(p._id ?? p.slug ?? p.title ?? i).toString()}
          // spread product props so ProductCard receives title, price, image, etc.
          {...(p as Item)}
        />
      ))}
    </div>
  );
}