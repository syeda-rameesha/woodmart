// src/app/categories/page.tsx
import Link from "next/link";

const CATEGORIES = [
  "clocks",
  "lighting",
  "furniture",
  "accessories",
  "cooking",
  "toys",
  "fashion",
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/category/${cat}`}
            className="border rounded-md p-4 text-center hover:bg-gray-100 capitalize"
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  );
}