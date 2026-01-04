"use client";

import { X } from "lucide-react";
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AuthDrawer({ open, onClose }: Props) {
  const [tab, setTab] = useState<"login" | "register">("login");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* drawer */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {tab === "login" ? "Sign in" : "Create account"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-3 text-sm font-medium ${
              tab === "login"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500"
            }`}
          >
            LOGIN
          </button>

          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-3 text-sm font-medium ${
              tab === "register"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500"
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* content */}
        <div className="p-5 overflow-y-auto flex-1">
          {tab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </aside>
    </div>
  );
}