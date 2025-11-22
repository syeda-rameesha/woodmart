'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  HeartIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q = String(form.get('q') || '').trim();
    if (q) router.push(`/?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-50 shadow-soft">
      {/* Top gradient bar */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <p className="opacity-90">Free shipping on orders over $150</p>
          <div className="hidden sm:flex gap-4 opacity-90">
            <Link href="/contact" className="hover:opacity-100">Contact</Link>
            <Link href="/shop" className="hover:opacity-100">Shop</Link>
            <Link href="/categories" className="hover:opacity-100">Categories</Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          {/* Mobile menu */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          {/* Brand */}
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-gray-900">
            WoodMart
          </Link>

          {/* Search */}
          <form
            onSubmit={onSearch}
            className="hidden md:flex flex-1 items-center"
          >
            <div className="relative w-full">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                name="q"
                placeholder="Search products…"
                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </form>

          {/* Icons */}
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg hover:bg-gray-100"
              aria-label="Wishlist"
            >
              <HeartIcon className="h-6 w-6 text-gray-700" />
              {/* badge (optional static 0) */}
              <span className="absolute -top-0.5 -right-0.5 text-[10px] bg-secondary text-white rounded-full px-1.5 py-0.5 leading-none">
                0
              </span>
            </Link>
            <Link
              href="/checkout"
              className="relative p-2 rounded-lg hover:bg-gray-100"
              aria-label="Cart"
            >
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-0.5 -right-0.5 text-[10px] bg-accent text-gray-900 rounded-full px-1.5 py-0.5 leading-none">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Secondary nav */}
        <nav className="border-t border-gray-100">
          <div className="container mx-auto px-4">
            <ul className="hidden md:flex items-center gap-6 text-sm py-3">
              <li><Link className="hover:text-primary" href="/">Home</Link></li>
              <li><Link className="hover:text-primary" href="/shop">Shop</Link></li>
              <li><Link className="hover:text-primary" href="/category/furniture">Furniture</Link></li>
              <li><Link className="hover:text-primary" href="/category/cooking">Cooking</Link></li>
              <li><Link className="hover:text-primary" href="/category/fashion">Fashion</Link></li>
              <li><Link className="hover:text-primary" href="/contact">Contact</Link></li>
            </ul>

            {/* Mobile drawer */}
            {mobileOpen && (
              <ul className="md:hidden py-2 pb-4 space-y-1">
                <li><Link className="block px-3 py-2 rounded hover:bg-gray-100" href="/">Home</Link></li>
                <li><Link className="block px-3 py-2 rounded hover:bg-gray-100" href="/shop">Shop</Link></li>
                <li><Link className="block px-3 py-2 rounded hover:bg-gray-100" href="/category/furniture">Furniture</Link></li>
                <li><Link className="block px-3 py-2 rounded hover:bg-gray-100" href="/category/cooking">Cooking</Link></li>
                <li><Link className="block px-3 py-2 rounded hover:bg-gray-100" href="/category/fashion">Fashion</Link></li>
                <li><Link className="block px-3 py-2 rounded hover:bg-gray-100" href="/contact">Contact</Link></li>
                <li className="px-3 pt-2">
                  <form onSubmit={onSearch}>
                    <input
                      name="q"
                      placeholder="Search products…"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </form>
                </li>
              </ul>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}