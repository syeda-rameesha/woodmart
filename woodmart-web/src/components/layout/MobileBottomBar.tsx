"use client";

import Link from "next/link";
import { Home, Grid, Heart, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";

export default function MobileBottomBar() {
  const cartCount = useCart((s) =>
    s.cart.reduce((sum, i) => sum + (i.qty || 0), 0)
  );
  const wishCount = useWishlist((s) => s.items.length);

  return (
  <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
    <div className="grid grid-cols-4 h-14">

      {/* Shop */}
      <Link
        href="/shop"
        className="flex flex-col items-center justify-center text-xs gap-1"
      >
        <Home size={18} />
        Shop
      </Link>

      {/* Categories */}
      <Link
        href="/categories"
        className="flex flex-col items-center justify-center text-xs gap-1"
      >
        <Grid size={18} />
        Categories
      </Link>

      {/* Wishlist */}
      <Link
        href="/wishlist"
        className="relative flex flex-col items-center justify-center text-xs gap-1"
      >
        <Heart size={18} />
        Wishlist
        {wishCount > 0 && (
          <span className="absolute top-1 right-6 text-[10px] bg-green-600 text-white rounded-full px-1">
            {wishCount}
          </span>
        )}
      </Link>

      {/* My Account */}
      <Link
        href="/account"
        className="flex flex-col items-center justify-center text-xs gap-1"
      >
        <User size={18} />
        Account
      </Link>

    </div>
  </div>
);
}