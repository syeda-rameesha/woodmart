"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useCart } from "@/store/useCart";

type Props = {
  _id?: string;
  title?: string;
  slug?: string;
  brand?: string;
  price?: number | string;
  salePrice?: number | string | null;
  image?: string | null;
  images?: string[] | null;
};

export default function ProductCard(props: Props) {
  const {
    _id: rawId,
    title,
    slug: rawSlug,
    brand,
    price,
    salePrice = null,
    image,
    images,
  } = props;

  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const img =
    (image && typeof image === "string" && image.length > 5 && image) ||
    (Array.isArray(images) && images.length && images[0]) ||
    "/placeholder.png";

  const displayTitle = title && title.trim().length ? title : "Untitled Product";
  const finalPrice = salePrice != null && salePrice !== "" ? salePrice : price ?? 0;
  const priceStr =
    typeof finalPrice === "number"
      ? `$${finalPrice}`
      : finalPrice
      ? `$${finalPrice}`
      : "$0";

  const href = rawSlug ? `/shop/${rawSlug}` : rawId ? `/shop/${rawId}` : "/shop";

  const id = rawId ? String(rawId) : rawSlug ? String(rawSlug) : `tmp-${Math.random().toString(36).slice(2, 9)}`;
  const slug = rawSlug ? String(rawSlug) : id;
  const numericPrice = Number(finalPrice) || 0;

  const productForCart = {
    _id: id,
    title: displayTitle,
    slug,
    price: numericPrice,
    image: img,
  };

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    try {
      add(productForCart, 1);
      setJustAdded(true);
      // revert after 1.5s
      setTimeout(() => setJustAdded(false), 1500);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  }

  return (
    <div className="block border rounded-md overflow-hidden hover:shadow transition bg-white">
      <Link href={href} className="block">
        <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={displayTitle} className="w-full h-full object-cover" />
        </div>

        <div className="p-3">
          <div className="text-xs text-gray-500">{brand ?? ""}</div>
          <div className="font-medium truncate mt-1">{displayTitle}</div>
          <div className="text-sm mt-1">
            <span className="font-semibold">{priceStr}</span>
          </div>
        </div>
      </Link>

      <button
        onClick={handleAddToCart}
        disabled={justAdded}
        className={`w-full py-2 text-sm font-medium transition ${
          justAdded ? "bg-green-600 text-white" : "bg-black text-white hover:bg-black/80"
        }`}
        aria-label={`Add ${displayTitle} to cart`}
      >
        {justAdded ? "Added ✓" : "Add To Cart"}
      </button>
    </div>
  );
}