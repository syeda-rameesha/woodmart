"use client";

import { useState } from "react";

export default function ProductGallery({ main, gallery }: { main: string; gallery: string[] }) {
  const [active, setActive] = useState(main);
  const images = [main, ...gallery];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="border rounded-lg overflow-hidden bg-gray-50">
        <img src={active} alt="Product" className="w-full h-full object-cover duration-300" />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((img) => (
          <button
            key={img}
            onClick={() => setActive(img)}
            className={`border rounded-lg overflow-hidden ${active === img ? "ring-2 ring-black" : ""}`}
          >
            <img src={img} alt="thumb" className="h-20 w-full object-cover hover:opacity-80" />
          </button>
        ))}
      </div>
    </div>
  );
}