// woodmart-web/src/app/admin/products/[id]/edit/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import { useAdmin } from "@/store/useAdmin";
import { adminApi } from "@/lib/adminApi";

type Product = {
  _id: string;
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

type PageProps = {
  params: { id: string };
};

export default function EditProductPage({ params }: PageProps) {
  const { id } = params;
  const router = useRouter();
  const token = useAdmin((s) => s.token);

  const [form, setForm] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    if (!form) return;
    setForm({ ...form, [key]: value });
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await adminApi<Product>(`/products/${id}`, token, {
          method: "GET",
        });
        setForm(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError("");

    try {
      await adminApi(`/admin/products/${id}`, token, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          price: Number(form.price) || 0,
          salePrice:
            form.salePrice === undefined || form.salePrice === null
              ? undefined
              : Number(form.salePrice),
        }),
      });

      router.push("/admin/products");
    } catch (err: any) {
      setError(err?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="container mx-auto px-4 py-10">
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      </AdminGuard>
    );
  }

  if (!form) {
    return (
      <AdminGuard>
        <div className="container mx-auto px-4 py-10">
          <p className="text-sm text-red-600">{error || "Product not found"}</p>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

        {error && (
          <div className="mb-4 rounded bg-red-50 text-red-600 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* same fields as AddProductPage */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Slug</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Brand</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.brand || ""}
              onChange={(e) => update("brand", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
                value={form.price ?? 0}
                onChange={(e) => update("price", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Sale Price</label>
              <input
                type="number"
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
                value={form.salePrice ?? ""}
                onChange={(e) =>
                  update(
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
              value={form.category || ""}
              onChange={(e) => update("category", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Main Image URL</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={form.image || ""}
              onChange={(e) => update("image", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Extra Images (comma separated URLs)
            </label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              value={(form.images || []).join(", ")}
              onChange={(e) =>
                update(
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
              value={form.description || ""}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 w-full bg-black text-white rounded py-2 text-sm font-medium disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </AdminGuard>
  );
}