// src/store/useAdmin.ts
"use client";

import { create } from "zustand";

type AdminState = {
  token: string | null;
  isAuthed: () => boolean;
  setToken: (t: string | null) => void;
  logout: () => void;
};

export const useAdmin = create<AdminState>((set, get) => ({
  token:
    typeof window !== "undefined"
      ? window.localStorage.getItem("admin_token")
      : null,

  isAuthed: () => Boolean(get().token),

  setToken: (t) => {
    if (typeof window !== "undefined") {
      if (t) localStorage.setItem("admin_token", t);
      else localStorage.removeItem("admin_token");
    }
    set({ token: t });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }
    set({ token: null });
  },
}));