// src/components/ui/CategoriesMenu.tsx
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { key: "", label: "All" },
  { key: "furniture", label: "Furniture" },
  { key: "cooking", label: "Cooking" },
  { key: "accessories", label: "Accessories" },
  { key: "fashion", label: "Fashion" },
  { key: "clocks", label: "Clocks" },
  { key: "lighting", label: "Lighting" },
  { key: "toys", label: "Toys" },
];

export default function CategoriesMenu() {
  const pathname = usePathname();
  const catOnHome = useSearchParams().get("cat") ?? "";

  return (
    <div className="rounded-md border bg-white">
      <div className="flex items-center justify-between px-4 py-3 bg-green-600 text-white rounded-t-md">
        <span className="font-semibold">BROWSE CATEGORIES</span>
        <span>▾</span>
      </div>

      <ul className="divide-y">
        {CATEGORIES.map((c) => {
          const isActive =
            pathname.startsWith("/category/") &&
            pathname.endsWith(`/${c.key}`) &&
            c.key;
          const isActiveHome = pathname === "/" && catOnHome === c.key;

          const active = Boolean(isActive || isActiveHome || (!c.key && pathname === "/"));

          const href = c.key ? `/category/${c.key}` : "/";
          return (
            <li key={c.key}>
              <Link
                href={href}
                className={`block w-full text-left px-4 py-3 hover:bg-gray-50 transition ${
                  active ? "bg-gray-100 font-medium" : ""
                }`}
              >
                {c.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}