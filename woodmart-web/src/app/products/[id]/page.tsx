// src/app/products/[id]/page.tsx
import api from "@/lib/api";
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

export const revalidate = 0;

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const key = params.id;

  let product: Product | null = null;

  try {
    product = await api<Product>(`/products/${key}`);
  } catch (err) {
    console.error("PRODUCT FETCH FAILED:", err);
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-3">Product not found</h1>
        <p className="text-gray-500">
          This product does not exist or was removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      {/* IMAGE */}
      <div>
        <img
          src={product.image || product.images?.[0] || "/placeholder.png"}
          alt={product.title}
          className="w-full rounded-lg object-cover"
        />
      </div>

      {/* INFO */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

        <div className="mb-4 text-xl">
          {product.salePrice ? (
            <>
              <span className="text-red-600 font-semibold mr-3">
                ${product.salePrice}
              </span>
              <span className="line-through text-gray-400">
                ${product.price}
              </span>
            </>
          ) : (
            <span className="font-semibold">${product.price}</span>
          )}
        </div>

        {product.description && (
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>
        )}

        {/* 👉 CART + WISHLIST */}
        <AddToCartSection product={product} />
      </div>
    </div>
  );
}