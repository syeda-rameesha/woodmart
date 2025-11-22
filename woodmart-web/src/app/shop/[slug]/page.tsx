import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ui/ProductGallery";
import AddToCart from "@/components/ui/AddToCart";
import WishlistButton from "@/components/ui/WishlistButton";

export const revalidate = 0;

type Product = {
  _id: string;
  title: string;
  slug: string;
  brand?: string;
  price: number;
  salePrice?: number;
  rating?: number;
  image?: string;
  images?: string[];
  description?: string;
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const p = await api<Product>(`/products/${slug}`).catch(() => null);
  if (!p) notFound();

  // images for gallery
  const imgs = p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [];
  const main = imgs[0] || "/placeholder.png";
  const gallery = imgs.slice(1);

  const finalPrice = p.salePrice ?? p.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* left: gallery */}
      <ProductGallery main={main} gallery={gallery} />

      {/* right: details */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{p.title}</h1>
        {p.brand && <div className="mt-1 text-gray-500">{p.brand}</div>}

        <div className="mt-3">
          <span className="text-2xl font-extrabold">${finalPrice}</span>
          {p.salePrice && (
            <span className="ml-2 text-gray-400 line-through">${p.price}</span>
          )}
        </div>

        <p className="mt-4 text-gray-700">
          {p.description || "Premium quality product with clean, minimalist design."}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <AddToCart
            item={{
              _id: p._id,
              title: p.title,
              slug: p.slug,
              price: finalPrice,
              image: main,
              qty: 1,
            }}
          />

          <WishlistButton
            item={{
              _id: p._id,
              title: p.title,
              slug: p.slug,
              price: finalPrice,
              image: main,
            }}
          />
        </div>
      </div>
    </div>
  );
}