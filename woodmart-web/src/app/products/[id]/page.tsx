import api from "@/lib/api";
import AddToCartSection from "@/components/products/AddToCartSection";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: PageProps) {
  // ✅ REQUIRED IN NEXT 15
  const { id } = await params;

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
      <div>
        <img
          src={product.image || product.images?.[0] || "/placeholder.png"}
          alt={product.title}
          className="w-full rounded-lg object-cover"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

        <div className="mb-4">
          {product.salePrice ? (
            <>
              <span className="text-red-600 text-xl font-semibold mr-2">
                ${product.salePrice}
              </span>
              <span className="line-through text-gray-400">
                ${product.price}
              </span>
            </>
          ) : (
            <span className="text-xl font-semibold">${product.price}</span>
          )}
        </div>

        {product.description && (
          <p className="text-gray-600 mb-6">{product.description}</p>
        )}

        <AddToCartSection product={product} />
      </div>
    </div>
  );
}