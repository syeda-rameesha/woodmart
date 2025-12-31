"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import CartDrawer from "@/components/ui/CartDrawer";
import Search from "@/components/ui/Search";

export default function Header() {
  const cart = useCart((s) => s.cart);
  const cartCount = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  const wishlist = useWishlist((s) => s.items);
  const wishCount = wishlist.length;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow">
        {/* Top strip */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm">
          <div className="container mx-auto px-4 py-2 flex justify-between">
            <p>Free shipping on orders over $150</p>
            <div className="hidden sm:flex gap-4">
              <Link href="/contact">Contact</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/categories">Categories</Link>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="border-b">
          <div className="container mx-auto h-[64px] px-4 flex items-center gap-6">

            {/* Mobile menu */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
  <img
    src="/logo.png"
    alt="WoodMart"
    className="h-12 w-auto object-contain"
  />
  <span className="text-2xl font-extrabold tracking-tight">
    WoodMart
  </span>
</Link>

            {/* Search */}
            <div className="w-[560px] shrink-0">
              <Search />
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7 font-medium text-gray-800">
              <Link className="hover:text-green-700" href="/">Home</Link>
              <Link className="hover:text-green-700" href="/shop">Shop</Link>
              <Link className="hover:text-green-700" href="/categories">Categories</Link>
              <Link className="hover:text-green-700" href="/contact">Contact</Link>
            </nav>

            {/* Icons */}
            <div className="ml-auto flex items-center gap-3">
              <Link href="/wishlist" className="relative">
                <Heart size={20} />
                {wishCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[11px] rounded-full w-[18px] h-[18px] grid place-items-center">
                    {wishCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="relative"
                aria-label="Open cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-amber-400 text-gray-900 text-[11px] rounded-full w-[18px] h-[18px] grid place-items-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <nav className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-2 font-medium">
              <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link href="/shop" onClick={() => setMobileOpen(false)}>Shop</Link>
              <Link href="/categories" onClick={() => setMobileOpen(false)}>Categories</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
            </nav>
          )}
        </div>
      </header>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}