"use client";

import { useWishlist } from "@/store/useWishlist";
import Link from "next/link";

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty 💔</h1>
        <Link href="/shop" className="text-blue-600 underline">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Wishlist ❤️</h1>
        <button
          onClick={clear}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg p-3 bg-white hover:shadow-sm transition"
          >
            <Link href={`/shop/${item.slug}`}>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded"
              />
            </Link>
            <div className="mt-3 text-sm">
              <p className="font-medium line-clamp-2">{item.title}</p>
              <p className="text-gray-600">${item.price}</p>
            </div>
            <button
              onClick={() => remove(item._id)}
              className="mt-2 text-xs bg-gray-100 hover:bg-red-100 text-red-600 px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}