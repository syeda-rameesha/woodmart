"use client";

import Link from "next/link";
import WishlistButton from "@/components/ui/WishlistButton";

type Item = {
  _id?: string;
  title?: string;
  slug?: string;
  brand?: string;
  price?: number;
  salePrice?: number;
  rating?: number;
  image?: string;
  images?: string[];
};

export default function ProductCard({ item }: { item: Partial<Item> }) {
  // ✅ Safely pick the best image and price
  const img =
    item?.images?.[0] ||
    item?.image ||
    "/placeholder.png";

  const displayPrice = item?.salePrice ?? item?.price ?? 0;

  return (
    <div className="rounded-lg border p-3 bg-white hover:shadow-sm transition">
      {/* Product Image */}
      <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100 group">
        <Link href={`/shop/${item?.slug ?? "#"}`}>
          <img
            src={img}
            alt={item?.title ?? "Product"}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* ❤️ Wishlist Button */}
        <div className="absolute top-2 right-2">
          <WishlistButton
            item={{
              _id: item?._id ?? "",
              title: item?.title ?? "Untitled",
              slug: item?.slug ?? "",
              price: displayPrice,
              image: img,
            }}
          />
        </div>
      </div>

      {/* 🛒 Add to Cart button (appears on hover) */}
<button
  className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition duration-300"
  onClick={(e) => {
    e.preventDefault(); // stop link click
    alert(`Added ${item?.title ?? "product"} to cart!`);
  }}
>
  Add to Cart
</button>

      {/* Product Text/Details */}
      <Link href={`/shop/${item?.slug ?? "#"}`}>
        {item?.brand && (
          <div className="mt-3 text-xs text-gray-500">{item.brand}</div>
        )}
        <div className="font-medium leading-tight line-clamp-2">
          {item?.title ?? "Untitled Product"}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold">${displayPrice}</span>
          {item?.salePrice && (
            <span className="text-xs line-through text-gray-400">
              ${item?.price}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}