"use client";
import { useState } from "react";
import { adminFetch } from "@/lib/admin";
import { useAdmin } from "@/store/useAdmin";

export default function ProductForm() {
  const token = useAdmin((s)=>s.token)!;
  const [form, setForm] = useState({
    title: "", slug: "", price: 0, brand: "",
    image: "", images: "", category: "", description: ""
  });
  const [msg, setMsg] = useState("");

  function update<K extends keyof typeof form>(k: K, v: any) {
    setForm(s => ({ ...s, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      images: form.images.split(",").map(s=>s.trim()).filter(Boolean)
    };
    const res = await adminFetch("/admin/products", token, {
      method: "POST", body: JSON.stringify(payload)
    });
    setMsg(res.success ? "Product created!" : res.message || "Failed");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 border rounded p-4">
      <h3 className="font-semibold">Create Product</h3>
      <input className="w-full border rounded px-3 py-2" placeholder="Title"
             value={form.title} onChange={(e)=>update("title", e.target.value)} />
      <input className="w-full border rounded px-3 py-2" placeholder="Slug"
             value={form.slug} onChange={(e)=>update("slug", e.target.value)} />
      <input className="w-full border rounded px-3 py-2" placeholder="Brand"
             value={form.brand} onChange={(e)=>update("brand", e.target.value)} />
      <input className="w-full border rounded px-3 py-2" placeholder="Price"
             value={form.price} onChange={(e)=>update("price", e.target.value)} />
      <input className="w-full border rounded px-3 py-2" placeholder="Main Image URL"
             value={form.image} onChange={(e)=>update("image", e.target.value)} />
      <input className="w-full border rounded px-3 py-2" placeholder="Gallery (comma-separated URLs)"
             value={form.images} onChange={(e)=>update("images", e.target.value)} />
      <input className="w-full border rounded px-3 py-2" placeholder="Category"
             value={form.category} onChange={(e)=>update("category", e.target.value)} />
      <textarea className="w-full border rounded px-3 py-2" placeholder="Description"
                value={form.description} onChange={(e)=>update("description", e.target.value)} />
      <button className="w-full bg-black text-white rounded py-2">Create</button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}