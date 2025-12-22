// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Products", href: "/admin/products" },
    { label: "Messages", href: "/admin/messages" },
    { label: "Settings", href: "/admin/settings" },
  ];

  function isActive(href: string) {
    return pathname === href || pathname?.startsWith(href + "/");
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    toast.success("Logged out");
    router.push("/admin/login");
  }

  return (
    <aside className="h-screen overflow-y-auto bg-white border-r">
      {/* Mobile toggle */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b">
        <div className="font-semibold">Admin</div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="px-2 py-1 border rounded text-sm"
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div className={`${open ? "block" : "hidden"} md:block`}>
        <div className="px-4 py-6">
          <div className="mb-6">
            <div className="text-lg font-bold">WoodMart Admin</div>
            <div className="text-sm text-gray-500">Manage store</div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded px-3 py-2 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 pt-4 border-t">
            <button
              onClick={() => router.push("/")}
              className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
            >
              View Store
            </button>

            <button
              onClick={handleLogout}
              className="mt-2 w-full text-left px-3 py-2 rounded text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
