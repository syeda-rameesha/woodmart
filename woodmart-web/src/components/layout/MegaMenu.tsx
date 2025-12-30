"use client";

import Link from "next/link";
import { MEGA_CATEGORIES } from "@/lib/megaCategories";

type FeaturedProduct = {
  title: string;
  image: string;
  price: string;
};

type MegaCategory = {
  sections: Record<string, string[]>;
  featured?: FeaturedProduct[];
};

export default function MegaMenu({ active }: { active: string }) {
  const cat = MEGA_CATEGORIES[active] as MegaCategory | undefined;

  if (!cat) return null;

  return (
    <div className="absolute left-0 top-full w-full bg-white shadow-xl border-t z-50">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8 p-8">
        {/* LEFT: SECTIONS */}
        {Object.entries(cat.sections).map(([section, items]) => (
          <div key={section}>
            <h4 className="font-semibold mb-3">{section}</h4>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item}>
                  <Link
                    href={`/category/${active}`}
                    className="text-gray-600 hover:text-black"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* RIGHT: FEATURED PRODUCTS */}
        {Array.isArray(cat.featured) && (
          <div className="border-l pl-6">
            {cat.featured.map((p) => (
              <div key={p.title} className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-32 mb-2 rounded"
                />
                <div className="font-medium">{p.title}</div>
                <div className="text-green-600">{p.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}