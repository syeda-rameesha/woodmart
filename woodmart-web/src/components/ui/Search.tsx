"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Search() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <input
        suppressHydrationWarning
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products…"
        className="
          block
          w-full
          px-4
          py-2
          text-sm
          text-black
          placeholder-gray-400
          border
          rounded-md
          bg-white
          focus:outline-none
          focus:ring-2 
          focus:ring-green-600
        "
      />
    </form>
  );
}