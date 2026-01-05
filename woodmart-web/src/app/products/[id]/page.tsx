import api from "@/lib/api";
import { notFound } from "next/navigation";
import AddToCartSection from "@/components/products/AddToCartSection";

type Product = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  salePrice?: number;
  image?: string;
  images?: string[];
  description?: string;
};

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  let product: Product | null = null;

  try {
    product = await api<Product>(`/products/${id}`);
  } catch (err) {
    console.error("Failed to load product", err);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <img
        src={product.image || product.images?.[0] || "/placeholder.png"}
        alt={product.title}
        className="w-full rounded-lg"
      />

      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>

        <div className="mt-3">
          {product.salePrice ? (
            <>
              <span className="text-red-600 text-2xl font-semibold mr-3">
                ${product.salePrice}
              </span>
              <span className="line-through text-gray-400">
                ${product.price}
              </span>
            </>
          ) : (
            <span className="text-2xl font-semibold">
              ${product.price}
            </span>
          )}
        </div>

        <p className="mt-4 text-gray-600">{product.description}</p>

        <AddToCartSection product={product} />
      </div>
    </div>
  );
}