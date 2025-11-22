"use client";

import { useCart } from "@/store/useCart";
import { toast } from "react-hot-toast";

// Keep the shape we pass into the cart
type CartItem = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  image?: string;
  qty?: number;
};

export default function AddToCart({ item }: { item: CartItem }) {
  // Try the common method names: addItem, add, addToCart
  const add = useCart((s: any) => s.addItem ?? s.add ?? s.addToCart ?? null);

  const disabled = !add;

  const handleClick = () => {
    if (!add) {
      console.warn("Cart store is missing an add method (addItem/add/addToCart).");
      toast.error("Cart action not available.");
      return;
    }
    add({ ...item, qty: item.qty ?? 1 });
    toast.success(`${item.title} added to cart!`);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`rounded-md px-6 py-3 text-sm transition ${
        disabled
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-black text-white hover:bg-gray-800"
      }`}
    >
      Add to cart
    </button>
  );
}