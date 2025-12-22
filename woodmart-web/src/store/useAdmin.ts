// woodmart-web/src/store/useAdmin.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AdminStore = {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
  isLogged: () => boolean;
  // some parts of the app call isAuthed — provide it for compatibility
  isAuthed: () => boolean;
};

const useAdmin = create<AdminStore>()(
  persist(
    (set, get) => ({
      token:
        typeof window !== "undefined"
          ? localStorage.getItem("admin_token") || localStorage.getItem("token") || null
          : null,

      setToken: (t: string | null) => {
        if (typeof window !== "undefined") {
          if (t) {
            localStorage.setItem("admin_token", t);
            localStorage.setItem("token", t);
          } else {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("token");
          }
        }
        set({ token: t });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("token");
        }
        set({ token: null });
      },

      isLogged: () => Boolean(get().token),

      // backward-compatible alias used in some components
      isAuthed: () => Boolean(get().token),
    }),
    {
      name: "woodmart-admin",
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export { useAdmin };
export default useAdmin;