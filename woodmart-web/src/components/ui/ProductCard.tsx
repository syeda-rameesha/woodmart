"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useCart } from "@/store/useCart";

type Product = {
  _id?: string;
  title?: string;
  slug?: string;
  brand?: string;
  price?: number | string;
  salePrice?: number | string | null;
  image?: string | null;
  images?: string[] | null;
};

type Props = Product & {
  product?: Product; // 👈 IMPORTANT (compatibility)
};

export default function ProductCard(props: Props) {
  // ✅ Support both <ProductCard product={p} /> and <ProductCard {...p} />
  const source = props.product ?? props;

  const {
    _id: rawId,
    title,
    slug: rawSlug,
    brand,
    price,
    salePrice = null,
    image,
    images,
  } = source;

  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const img =
    (typeof image === "string" && image.length > 5 && image) ||
    (Array.isArray(images) && images.length && images[0]) ||
    "/placeholder.png";

  const displayTitle = title?.trim() || "Untitled Product";
  const finalPrice = salePrice ?? price ?? 0;

  const priceStr =
    typeof finalPrice === "number" ? `$${finalPrice}` : `$${finalPrice}`;

  const href = rawSlug
    ? `/shop/${rawSlug}`
    : rawId
    ? `/shop/${rawId}`
    : "/shop";

 const id = rawId
  ? String(rawId)
  : rawSlug
  ? String(rawSlug)
  : "tmp";
  
  const productForCart = {
    _id: String(id),
    title: displayTitle,
    slug: String(rawSlug ?? id),
    price: Number(finalPrice) || 0,
    image: img,
  };

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    add(productForCart, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="block border rounded-md overflow-hidden hover:shadow transition bg-white">
      <Link href={href} className="block">
        <div className="aspect-[4/3] bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-3">
          <div className="text-xs text-gray-500">{brand ?? ""}</div>
          <div className="font-medium truncate mt-1">{displayTitle}</div>
          <div className="text-sm mt-1 font-semibold">{priceStr}</div>
        </div>
      </Link>

      <button
        onClick={handleAddToCart}
        disabled={justAdded}
        className={`w-full py-2 text-sm font-medium ${
          justAdded
            ? "bg-green-600 text-white"
            : "bg-black text-white hover:bg-black/80"
        }`}
      >
        {justAdded ? "Added ✓" : "Add To Cart"}
      </button>
    </div>
  );
}