// woodmart-web/src/app/admin/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import { useAdmin } from "@/store/useAdmin";
import { adminApi } from "@/lib/adminApi";

type Product = {
  _id: string;
  title: string;
  slug: string;
  brand?: string;
  price?: number;
  category?: string;
};

type ListResponse = {
  items: Product[];
  total: number;
};

export default function AdminProductsPage() {
  const token = useAdmin((s) => s.token);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  async function load() {
    try {
      setLoading(true);
      setError("");
      const data = await adminApi<ListResponse>("/products?page=1&limit=100", token, {
        method: "GET",
      });
      setItems(data.items || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 function handleDelete(id: string) {
  setDeleteId(id); // open modal
}

async function confirmDelete() {
  if (!deleteId) return;

  setDeleting(true);
  try {
    await adminApi(`/admin/products/${deleteId}`, token, { method: "DELETE" });
    setItems((prev) => prev.filter((p) => p._id !== deleteId));
    setDeleteId(null);
  } catch (err: any) {
    alert(err?.message || "Delete failed");
  } finally {
    setDeleting(false);
  }
}

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <Link
            href="/admin/add-product"
            className="text-sm bg-black text-white px-4 py-2 rounded"
          >
            + Add product
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 text-red-600 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">No products.</p>
        ) : (
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-left">Brand</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="px-3 py-2">{p.title}</td>
                    <td className="px-3 py-2">{p.category}</td>
                    <td className="px-3 py-2">${p.price}</td>
                    <td className="px-3 py-2">{p.brand}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <Link
                        href={`/admin/products/${p._id}/edit`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {deleteId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-lg w-full max-w-sm p-5 shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Delete product</h3>
      <p className="text-sm text-gray-600 mb-5">
        Are you sure you want to delete this product?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setDeleteId(null)}
          disabled={deleting}
          className="px-4 py-2 text-sm border rounded"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          disabled={deleting}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </AdminGuard>
  );
}