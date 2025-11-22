"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  image?: string;
  qty: number;
};

type CartStore = {
  // canonical state
  cart: CartItem[];

  // canonical actions
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (slug: string) => void;
  inc: (slug: string) => void;
  dec: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;

  // selectors
  count: () => number;
  subtotal: () => number;

  // aliases (so old names also work)
  addToCart: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;

  // legacy getter for older code expecting items
  get items(): CartItem[];
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      add: (item, qty = 1) =>
        set((s) => {
          const has = s.cart.find((i) => i.slug === item.slug);
          if (has) {
            return {
              cart: s.cart.map((i) =>
                i.slug === item.slug ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return { cart: [...s.cart, { ...item, qty }] };
        }),

      remove: (slug) =>
        set((s) => ({ cart: s.cart.filter((i) => i.slug !== slug) })),

      inc: (slug) =>
        set((s) => ({
          cart: s.cart.map((i) =>
            i.slug === slug ? { ...i, qty: i.qty + 1 } : i
          ),
        })),

      dec: (slug) =>
        set((s) => ({
          cart: s.cart.map((i) =>
            i.slug === slug ? { ...i, qty: Math.max(1, i.qty - 1) } : i
          ),
        })),

      setQty: (slug, qty) =>
        set((s) => ({
          cart: s.cart.map((i) =>
            i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i
          ),
        })),

      clear: () => set({ cart: [] }),

      count: () => get().cart.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().cart.reduce((n, i) => n + i.qty * i.price, 0),

      // aliases
      addToCart: (item, qty) => get().add(item, qty),
      removeFromCart: (slug) => get().remove(slug),
      clearCart: () => get().clear(),

      // legacy getter for items
      get items() {
        return get().cart;
      },
    }),
    { name: "woodmart-cart" }
  )
);