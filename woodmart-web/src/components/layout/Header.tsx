"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import CartDrawer from "@/components/ui/CartDrawer";
import Search from "@/components/ui/Search";
import MobileBottomBar from "@/components/layout/MobileBottomBar";

export default function Header() {
  const cart = useCart((s) => s.cart);
  const cartCount = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  const wishlist = useWishlist((s) => s.items);
  const wishCount = wishlist.length;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"menu" | "categories">("menu");
  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow">
        {/* ===== TOP STRIP ===== */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between">
            <p>Free shipping on orders over $150</p>
            <div className="hidden sm:flex gap-4">
              <Link href="/contact">Contact</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/categories">Categories</Link>
            </div>
          </div>
        </div>

        {/* ===== MAIN HEADER ===== */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">

            {/* Mobile menu button */}
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold md:static md:translate-x-0"
              >
              <img src="/logo.png" alt="WoodMart" className="h-8 inline-block" 
               />
            <span>woodmart.</span>
            </Link>

            {/* Mobile Cart */}
              <button
              onClick={() => setCartOpen(true)}
              className="absolute right-4 md:hidden"
             aria-label="Open cart"
             >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-yellow-400 text-black text-[11px] rounded-full w-[18px] h-[18px] grid place-items-center">
            {cartCount}
            </span>
             )}
             </button>

            {/* Desktop Search ONLY */}
            <div className="hidden lg:block flex-1 max-w-xl">
              <Search />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-6 font-medium">
              <Link href="/">Home</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/categories">Categories</Link>
              <Link href="/contact">Contact</Link>
            </nav>

            {/* Icons */}
            <div className="hidden md:flex items-center gap-5 ml-auto">
               <Link href="/wishlist" className="relative">
                <Heart size={20} />
                {wishCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 grid place-items-center">
                    {wishCount}
                  </span>
                )}
              </Link>

              <button 
              onClick={() => setCartOpen(true)} 
              className="relative"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-yellow-400 text-black text-xs rounded-full w-4 h-4 grid place-items-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ===== MOBILE / TABLET DRAWER ===== */}
{mobileOpen && (
  <div className="fixed inset-0 z-50 bg-black/40">
    <div className="absolute left-0 top-0 h-full w-[85%] bg-white shadow-lg overflow-y-auto">

      {/* Search */}
      <div className="p-4 border-b">
        <Search />
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setMobileTab("menu")}
          className={`flex-1 py-3 text-sm font-medium ${
            mobileTab === "menu"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500"
          }`}
        >
          MENU
        </button>

        <button
          onClick={() => setMobileTab("categories")}
          className={`flex-1 py-3 text-sm font-medium ${
            mobileTab === "categories"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500"
          }`}
        >
          CATEGORIES
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">

        {mobileTab === "menu" && (
          <>
            <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2">Home</Link>
            <Link href="/shop" onClick={() => setMobileOpen(false)} className="block py-2">Shop</Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="block py-2">Blog</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block py-2">Contact</Link>
            <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="block py-2">Wishlist</Link>
          </>
        )}

        {mobileTab === "categories" && (
          <>
            <Link href="/category/furniture" className="block py-2">Furniture</Link>
            <Link href="/category/cooking" className="block py-2">Cooking</Link>
            <Link href="/category/accessories" className="block py-2">Accessories</Link>
            <Link href="/category/fashion" className="block py-2">Fashion</Link>
            <Link href="/category/clocks" className="block py-2">Clocks</Link>
          </>
        )}
      </div>

      {/* Close */}
      <button
        onClick={() => setMobileOpen(false)}
        className="absolute top-3 right-3"
      >
        <X />
      </button>
    </div>
  </div>
)}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        <MobileBottomBar />
    </>
  );
}