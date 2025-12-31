import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  _id: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
};

type CartStore = {
  cart: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (_id: string) => void;
  inc: (_id: string) => void;
  dec: (_id: string) => void;
  clear: () => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      add: (item, qty = 1) => {
        const cart = get().cart;
        const found = cart.find((i) => i._id === item._id);

        if (found) {
          set({
            cart: cart.map((i) =>
              i._id === item._id
                ? { ...i, qty: i.qty + qty }
                : i
            ),
          });
        } else {
          set({
            cart: [...cart, { ...item, qty }],
          });
        }
      },

      remove: (_id) =>
        set({
          cart: get().cart.filter((i) => i._id !== _id),
        }),

      inc: (_id) =>
        set({
          cart: get().cart.map((i) =>
            i._id === _id
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        }),

      dec: (_id) =>
        set({
          cart: get().cart
            .map((i) =>
              i._id === _id
                ? { ...i, qty: i.qty - 1 }
                : i
            )
            .filter((i) => i.qty > 0),
        }),

      clear: () => set({ cart: [] }),
    }),
    {
      name: "woodmart-cart",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);