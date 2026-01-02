"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import adminUpload from "@/lib/adminUpload";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

// keep categories consistent with shop
const CATEGORIES = [
  "furniture",
  "cooking",
  "accessories",
  "fashion",
  "clocks",
  "lighting",
  "toys",
];

export default function AddProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  function onChooseFile() {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    inp.onchange = () => {
      if (!inp.files?.[0]) return;
      setImageFile(inp.files[0]);
      setImagePreview(URL.createObjectURL(inp.files[0]));
    };
    inp.click();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("Admin not logged in");

      // 1️⃣ upload image
      let imageUrl = "";
      if (imageFile) {
        const t = toast.loading("Uploading image…");
        const res = await adminUpload(imageFile, token);
        toast.dismiss(t);

        imageUrl =
          res?.url ||
          res?.body?.url ||
          `${API_BASE.replace("/api", "")}/uploads/${res?.filename}`;

        toast.success("Image uploaded");
      }

      // 2️⃣ create product
      const res = await fetch(`${API_BASE}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          price: Number(price),
          brand: brand.trim() || undefined,
          category,
          description: description.trim() || undefined,
          image: imageUrl || undefined,
          images: imageUrl ? [imageUrl] : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Create product failed");
      }

      toast.success("Product created");
      router.push("/admin/products");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>

      <form onSubmit={handleCreate} className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8 space-y-4">
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Slug (optional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />

          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          <select
            className="w-full border px-3 py-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <textarea
            className="w-full border px-3 py-2 rounded h-32"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Creating…" : "Create product"}
          </button>
        </div>

        <div className="col-span-12 md:col-span-4">
          <div className="border-2 border-dashed rounded p-4 text-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                className="mx-auto max-h-48 object-contain"
                alt="preview"
              />
            ) : (
              <p className="text-gray-400">No image selected</p>
            )}

            <button
              type="button"
              onClick={onChooseFile}
              className="mt-4 border px-3 py-2 rounded"
            >
              Choose image
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}