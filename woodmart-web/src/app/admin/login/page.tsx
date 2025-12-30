// src/app/admin/login/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "woodmart-production.up.railway.app";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

     const data = await res.json();

if (!res.ok) {
  toast.error(data?.message || "Login failed");
  setLoading(false);
  return;
}

// ✅ SAVE TOKEN
localStorage.setItem("admin_token", data.token);

// ✅ OPTIONAL: save user role if backend sends it
// localStorage.setItem("admin_role", data.role);

// ✅ REDIRECT
router.push("/admin/dashboard");

      // Save token
      if (data?.token) {
        localStorage.setItem("admin_token", data.token);
      }

      // Success toast
      toast.success("Login successful!");

      // small delay so user sees the toast, then redirect to dashboard
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 800);
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Admin email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Admin password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
