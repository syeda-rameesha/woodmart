// woodmart-web/src/app/admin/add-product/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import { useAdmin } from "@/store/useAdmin";
import { adminApi } from "@/lib/adminApi";

type ProductInput = {
  title: string;
  slug: string;
  brand?: string;
  price?: number;
  salePrice?: number;
  category?: string;
  image?: string;
  images?: string[];
  description?: string;
};

export default function AddProductPage() {
  const router = useRouter();
  const token = useAdmin((s) => s.token);

  const [form, setForm] = useState<ProductInput>({
    title: "",
    slug: "",
    brand: "",
    price: 0,
    salePrice: undefined,
    category: "",
    image: "",
    images: [],
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const body: ProductInput = {
        ...form,
        price: Number(form.price) || 0,
        salePrice:
          form.salePrice === undefined || form.salePrice === null
            ? undefined
            : Number(form.salePrice),
      };

      await adminApi("/admin/products", token, {
        method: "POST",
        body: JSON.stringify(body),
      });

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Add Product</h1>

        {error && (
          <div className="mb-4 rounded bg-red-50 text-red-600 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Slug</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="my-awesome-product"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Brand</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.brand}
              onChange={(e) => updateField("brand", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
                value={form.price}
                onChange={(e) => updateField("price", Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Sale Price (optional)</label>
              <input
                type="number"
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
                value={form.salePrice ?? ""}
                onChange={(e) =>
                  updateField(
                    "salePrice",
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              placeholder="furniture / cooking / fashion / lighting / toys / accessories / clocks"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Main Image URL</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Extra Images (comma separated URLs)
            </label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.images?.join(", ") || ""}
              onChange={(e) =>
                updateField(
                  "images",
                  e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 w-full bg-black text-white rounded py-2 text-sm font-medium disabled:opacity-60"
          >
            {saving ? "Saving…" : "Create product"}
          </button>
        </form>
      </div>
    </AdminGuard>
  );
}