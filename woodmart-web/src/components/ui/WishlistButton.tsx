"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useWishlist, WishItem } from "@/store/useWishlist";

type Props = {
  item: WishItem;
  className?: string;
};

export default function WishlistButton({ item, className }: Props) {
  const add = useWishlist((s) => s.add);
  const remove = useWishlist((s) => s.remove);

  // ✅ Subscribe to a boolean derived from items so re-render happens on change
  const active = useWishlist((s) => s.items.some((i) => i._id === item._id));

  // Guard against SSR hydration timing
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!ready) return;
    active ? remove(item._id) : add(item);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
      className={className ?? "rounded-full p-2 bg-white/80 hover:bg-white"}
    >
      <Heart
        size={18}
        className={active ? "fill-red-500 text-red-500" : "text-gray-700"}
      />
    </button>
  );
}