"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type WishItem = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
};

type WishState = {
  items: WishItem[];
  add: (item: WishItem) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

export const useWishlist = create<WishState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set({
          items: [
            ...get().items.filter((i) => i._id !== item._id),
            item,
          ],
        }),
      remove: (id) => set({ items: get().items.filter((i) => i._id !== id) }),
      has: (id) => get().items.some((i) => i._id === id),
      clear: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);