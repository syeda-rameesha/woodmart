"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, Menu, X, User } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import CartDrawer from "@/components/ui/CartDrawer";
import Search from "@/components/ui/Search";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import { useUser } from "@/store/useUser";
import AuthDrawer from "@/components/auth/AuthDrawer";
import { usePathname } from "next/navigation";

export default function Header() {
  const cart = useCart((s) => s.cart);
  const cartCount = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  const wishlist = useWishlist((s) => s.items);
  const wishCount = wishlist.length;

  const user = useUser((s) => s.user);

  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return null;
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
          <div className="container mx-auto px-6 py-5">
            <div className="relative flex items-center">

              {/* ===== LEFT ===== */}
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu />
                </button>

                {/* Logo (left on desktop, centered on mobile) */}
                <Link
                  href="/"
                  className="hidden lg:flex items-center gap-2"
                >
                  <img src="/logo.png" alt="WoodMart" className="h-12" />
                  <span className="text-4xl font-bold tracking-tight">
                    woodmart.
                  </span>
                </Link>
              </div>

              {/* ===== CENTER (mobile logo) ===== */}
              <div className="absolute left-1/2 -translate-x-1/2 lg:hidden">
                <Link href="/" className="flex items-center gap-2">
                  <img src="/logo.png" alt="WoodMart" className="h-12" />
                  <span className="text-4xl font-bold tracking-tight">
                    woodmart.
                  </span>
                </Link>
              </div>

              {/* ===== CENTER (desktop search + nav) ===== */}
              <div className="hidden lg:flex flex-1 items-center gap-8 ml-12">
                <div className="flex-[2] min-w-[420px] max-w-[640px]">
                  <Search />
                </div>

                <nav className="flex gap-6 font-medium whitespace-nowrap">
                  <Link href="/">Home</Link>
                  <Link href="/shop">Shop</Link>
                  <Link href="/categories">Categories</Link>
                  <Link href="/contact">Contact</Link>
                </nav>
              </div>

              {/* ===== RIGHT ===== */}
<div className="ml-auto flex items-center">

  {/* Icons group (Heart + Cart together) */}
  <div className="flex items-center gap-6">
    {/* Wishlist */}
    <Link href="/wishlist" className="relative hidden md:block">
      <Heart size={20} />
      {wishCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 grid place-items-center">
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
        <span className="absolute -top-1 -right-2 bg-yellow-400 text-black text-[11px] rounded-full w-[18px] h-[18px] grid place-items-center">
          {cartCount}
        </span>
      )}
    </button>
  </div>

  {/* Login / Register (always far right) */}
  <div className="hidden md:block ml-6">
    {!user ? (
      <button
        onClick={() => setAuthOpen(true)}
        className="flex items-center gap-1 text-sm font-medium"
      >
        <User size={20} />
        Login / Register
      </button>
    ) : (
      <Link
        href="/account"
        className="flex items-center gap-1 text-sm font-medium"
      >
        <User size={20} />
        My Account
      </Link>
    )}
  </div>

                
              </div>
            </div>
          </div>
        </div>

        {/* ===== MOBILE DRAWER ===== */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/40">
            <div className="absolute left-0 top-0 h-full w-[85%] bg-white shadow-lg overflow-y-auto">
              <div className="p-4 border-b">
                <Search />
              </div>

              <div className="p-4 space-y-2">
                {!user ? (
                  <button
                    onClick={() => {
                      setAuthOpen(true);
                      setMobileOpen(false);
                    }}
                    className="block py-2 font-medium"
                  >
                    Login / Register
                  </button>
                ) : (
                  <Link href="/account" className="block py-2 font-medium">
                    My Account
                  </Link>
                )}

                <Link href="/" className="block py-2">Home</Link>
                <Link href="/shop" className="block py-2">Shop</Link>
                <Link href="/contact" className="block py-2">Contact</Link>
                <Link href="/wishlist" className="block py-2">Wishlist</Link>
              </div>

              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-5 right-5"
                aria-label="Close menu"
              >
                <X />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* DRAWERS */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthDrawer open={authOpen} onClose={() => setAuthOpen(false)} />
      <MobileBottomBar />
    </>
  );
}