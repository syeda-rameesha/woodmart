import ProductCard from "@/components/ui/ProductCard";

type Product = {
  _id?: string;
  title?: string;
  slug?: string;
  brand?: string;
  price?: number | string;
  salePrice?: number | string | null;
  image?: string | null;
  images?: string[] | null;
};

type Props = {
  products?: Product[];
  items?: Product[]; // 👈 allow items too
};

export default function ProductGrid({ products, items }: Props) {
  // ✅ support both props
  const safe = Array.isArray(products)
    ? products
    : Array.isArray(items)
    ? items
    : [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {safe.map((p, i) => (
        <ProductCard
          key={(p._id ?? p.slug ?? i).toString()}
          {...p}
        />
      ))}
    </div>
  );
}