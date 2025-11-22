"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import CartDrawer from "@/components/ui/CartDrawer";
import Search from "@/components/ui/Search";

export default function Header() {
  // cart
  const cart = useCart((s) => s.cart);
  const cartCount = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  // wishlist
  const wishlist = useWishlist((s) => s.items);
  const wishCount = wishlist.length;

  // ui state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 shadow">
        {/* --- Colorful top strip --- */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <p className="opacity-90">Free shipping on orders over $150</p>
            <div className="hidden sm:flex gap-4 opacity-90">
              <Link href="/contact" className="hover:opacity-100">Contact</Link>
              <Link href="/shop" className="hover:opacity-100">Shop</Link>
              <Link href="/categories" className="hover:opacity-100">Categories</Link>
            </div>
          </div>
        </div>

        {/* --- Main bar --- */}
        <div className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 border-b">
          <div className="container mx-auto flex items-center justify-between gap-4 py-4 px-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="text-2xl font-extrabold tracking-tight">
              WoodMart
            </Link>

            {/* Desktop search */}
            <div className="hidden md:block flex-1 max-w-lg">
              <Search />
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-6 font-medium">
              <Link className="hover:text-green-700" href="/">Home</Link>
              <Link className="hover:text-green-700" href="/shop">Shop</Link>
              <Link className="hover:text-green-700" href="/categories">Categories</Link>
              <Link className="hover:text-green-700" href="/contact">Contact</Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-5">
              {/* Wishlist */}
              <Link href="/wishlist" className="relative" aria-label="Wishlist">
                <Heart size={20} />
                {wishCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[11px] rounded-full w-[18px] h-[18px] grid place-items-center">
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
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

          {/* Mobile search */}
          <div className="md:hidden px-4 pb-3">
            <Search />
          </div>

          {/* Mobile nav drawer */}
          {mobileOpen && (
            <nav className="md:hidden flex flex-col gap-2 px-4 pb-4 font-medium bg-white border-t">
              <Link href="/" onClick={() => setMobileOpen(false)} className="rounded px-2 py-2 hover:bg-gray-50">Home</Link>
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="rounded px-2 py-2 hover:bg-gray-50">Shop</Link>
              <Link href="/categories" onClick={() => setMobileOpen(false)} className="rounded px-2 py-2 hover:bg-gray-50">Categories</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="rounded px-2 py-2 hover:bg-gray-50">Contact</Link>
            </nav>
          )}
        </div>
      </header>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}