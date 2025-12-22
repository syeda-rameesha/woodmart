// components/Header.tsx (example)
"use client";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {/* hamburger icon */}
          </button>
          <div className="text-xl font-bold">WoodMart</div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm">Home</a>
          <a href="/shop" className="text-sm">Shop</a>
          <a href="/categories" className="text-sm">Categories</a>
        </nav>

        <div className="md:hidden">
          {/* small icons for mobile */}
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden bg-white shadow-inner px-4 py-2">
          <a className="block py-2" href="/">Home</a>
          <a className="block py-2" href="/shop">Shop</a>
          <a className="block py-2" href="/categories">Categories</a>
        </div>
      )}
    </header>
  );
}