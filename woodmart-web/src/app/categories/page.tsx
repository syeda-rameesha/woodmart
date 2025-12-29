// src/app/categories/page.tsx
import Link from "next/link";
import api from "@/lib/api";

type Category = {
  _id?: string;
  slug?: string;
  name?: string;
};

export const revalidate = 0;

export default async function CategoriesPage() {
  let categories: Category[] = [];

  try {
    const data = await api<{ items: Category[] }>("/categories");
    categories = data.items ?? [];
  } catch (e) {
    console.error("Failed to load categories", e);
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id ?? cat.slug}
              href={`/category/${cat.slug}`}
              className="border rounded-md p-4 hover:shadow transition bg-white"
            >
              <h2 className="font-medium text-center">
                {cat.name ?? "Unnamed"}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}