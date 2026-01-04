"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";

type Product = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  salePrice?: number;
  image?: string;
};

export default function AddToCartSection({ product }: { product: Product }) {
  const addToCart = useCart((s) => s.add);

  const wishlist = useWishlist((s) => s.items);
  const addWishlist = useWishlist((s) => s.add);
  const removeWishlist = useWishlist((s) => s.remove);

  const isInWishlist = wishlist.some((i) => i._id === product._id);

  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* ADD TO CART */}
      <button
        onClick={() =>
          addToCart({
            _id: product._id,
            title: product.title,
            slug: product.slug,
            price: product.salePrice ?? product.price,
            image: product.image,
          })
        }
        className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
      >
        <ShoppingCart size={18} />
        Add to Cart
      </button>

      {/* WISHLIST */}
      <button
        onClick={() =>
          isInWishlist
            ? removeWishlist(product._id)
            : addWishlist({
                _id: product._id,
                title: product.title,
                slug: product.slug,
                price: product.salePrice ?? product.price,
                image: product.image || "",
              })
        }
        className={`flex items-center justify-center gap-2 py-3 rounded-md border transition
          ${
            isInWishlist
              ? "border-red-500 text-red-600"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
      >
        <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
        {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
}