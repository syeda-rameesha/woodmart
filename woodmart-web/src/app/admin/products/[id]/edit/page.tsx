// woodmart-web/src/app/admin/products/[id]/edit/page.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import { useAdmin } from "@/store/useAdmin";
// NOTE: we will call the admin API directly using full URL (bypass wrapper)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

type Product = {
  _id: string;
  title: string;
  slug: string;
  brand?: string;
  price?: number;
  salePrice?: number | undefined;
  category?: string;
  image?: string;
  images?: string[];
  description?: string;
};

export default function EditProductPage() {
  const { id } = useParams() as { id?: string } || {};
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
        setError("");

        if (!id) {
          throw new Error("Missing product id in URL");
        }

        // Direct call to admin product endpoint (GET)
        const res = await fetch(`${API_BASE}/admin/products/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // include token if available (optional for your api)
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        });

        const txt = await res.text();
        let data: any;
        try {
          data = txt ? JSON.parse(txt) : null;
        } catch {
          data = txt;
        }

        if (!res.ok) {
          const message =
            data?.message || data?.error || `Failed to load product (${res.status})`;
          throw new Error(message);
        }

        // admin route may return { product } or the product directly
        const productPayload = data?.product ?? data;
        if (!productPayload) {
          throw new Error("Product not found");
        }

        setForm(productPayload as Product);
      } catch (err: any) {
        console.error("Failed to load product:", err);
        setError(err?.message || "Failed to load product");
        setForm(null);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError("");

    try {
      if (!id) throw new Error("Missing product id");

      if (!token) {
        throw new Error("No admin token - please login");
      }

      // prepare numeric fields
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        salePrice:
          form.salePrice === undefined || form.salePrice === null
            ? undefined
            : Number(form.salePrice),
      };

      // call admin update endpoint directly
      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const txt = await res.text();
      let data: any;
      try {
        data = txt ? JSON.parse(txt) : null;
      } catch {
        data = txt;
      }

      if (!res.ok) {
        // show server-provided message if any
        const message = data?.message || data?.error || `Failed to update product (${res.status})`;
        throw new Error(message);
      }

      // success -> go back to products list
      router.push("/admin/products");
    } catch (err: any) {
      console.error("Update product error:", err);
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