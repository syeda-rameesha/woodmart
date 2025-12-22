// woodmart-web/src/app/admin/add-product/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import adminUpload from "@/lib/adminUpload"; // default export
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

type Category = {
  _id?: string;
  name: string;
  slug?: string;
};

export default function AddProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE.replace(/\/api$/, "")}/api/categories`);
        if (!res.ok) return;
        const data = await res.json();
        const list: Category[] = data?.items || data?.categories || data || [];
        if (mounted && Array.isArray(list)) {
          setCategories(list);
          if (list.length && !category) {
            setCategory(list[0].name ?? list[0]._id ?? "");
          }
        }
      } catch (err) {
        // swallow - not critical
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onChooseFile() {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    inp.onchange = () => {
      if (!inp.files || !inp.files[0]) return;
      const f = inp.files[0];
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
    };
    inp.click();
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    if (!e.dataTransfer) return;
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f) {
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
    }
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  async function handleCreate(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("Not logged in as admin. Please login first.");
      }

      // 1) upload image (if present)
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        const toastId = toast.loading("Uploading image...");
        try {
          const res = await adminUpload(imageFile, token);
          toast.dismiss(toastId);

          // normalize/resilient extraction of url
          imageUrl =
            (res && (res.url || res.body?.url || res.body?.secure_url || res.body?.data?.url)) ||
            (res && res.body && typeof res.body === "string" ? undefined : res.body?.filename && `${API_BASE.replace(/\/api$/, "")}/uploads/${res.body.filename}`) ||
            undefined;

          // If helper returns filename only
          if (!imageUrl && res?.filename) {
            imageUrl = `${API_BASE.replace(/\/api$/, "")}/uploads/${res.filename}`;
          }

          if (!imageUrl) {
            // graceful fallback - do not crash: use placeholder if backend didn't return URL
            imageUrl = process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_IMAGE || "/uploads/placeholder.png";
          }

          toast.success("Image uploaded");
        } catch (err: any) {
          toast.dismiss();
          console.error("adminUpload error:", err);
          throw new Error(err?.message || "Image upload failed");
        }
      }

      // 2) prepare body for product create
      const body: any = {
        title: title.trim(),
        slug: slug?.trim() || undefined,
        price: Number(price) || 0,
        brand: brand?.trim() || undefined,
        category: category?.trim() || undefined,
        description: description?.trim() || undefined,
      };

      if (imageUrl) {
        body.image = imageUrl;
        body.images = [imageUrl];
      }

      // 3) call admin create product endpoint
      const token2 = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE.replace(/\/api$/, "")}/api/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token2 ? `Bearer ${token2}` : "",
        },
        body: JSON.stringify(body),
      });

      // parse response safely
      let parsed: any = null;
      try {
        parsed = await res.json();
      } catch {
        parsed = null;
      }

      if (!res.ok) {
        console.error("CREATE STATUS:", res.status, "RESPONSE:", parsed);
        // prefer server validation message if present
        const msg =
          (parsed && (parsed.message || parsed.error || parsed?.details?.message)) ||
          `Failed to create product (${res.status})`;
        throw new Error(msg);
      }

      toast.success("Product created");
      // clear and navigate to admin products
      router.push("/admin/products");
    } catch (err: any) {
      console.error("Create product error:", err);
      toast.error(err?.message || "Create product failed");
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setTitle("");
    setSlug("");
    setPrice("");
    setBrand("");
    setCategory(categories?.[0]?.name ?? "");
    setDescription("");
    setImagePreview(null);
    setImageFile(null);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8">
          <h1 className="text-2xl font-semibold mb-4">Add Product</h1>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Product title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Slug (optional)</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="product-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Brand</label>
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  {categories && categories.length > 0 ? (
                    categories.map((c, i) => (
                      <option key={c._id ?? `${c.name}-${i}`} value={c.name ?? c._id}>
                        {c.name ?? c.slug ?? c._id}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Uncategorized">Uncategorized</option>
                      <option value="Default">Default</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-3 py-2 h-32"
                placeholder="Product description"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded"
              >
                {loading ? "Creating…" : "Create product"}
              </button>

              <button
                type="button"
                onClick={clearForm}
                className="border px-3 py-2 rounded"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="col-span-12 md:col-span-4">
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="border-dashed border-2 border-gray-200 rounded p-4 text-center"
            style={{ minHeight: 200 }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                className="mx-auto max-h-48 object-contain"
              />
            ) : (
              <div className="text-gray-400">Drop image or click below</div>
            )}

            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={onChooseFile}
                type="button"
                className="border px-3 py-2 rounded"
              >
                Choose file
              </button>

              <button
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                }}
                type="button"
                className="border px-3 py-2 rounded"
              >
                Clear image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}