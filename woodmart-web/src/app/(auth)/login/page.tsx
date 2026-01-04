"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/store/useUser";

export default function LoginPage() {
  const router = useRouter();
  const login = useUser((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // 🔁 Replace with real API later
    const fakeUser = {
      _id: "1",
      name: "WoodMart User",
      email,
    };

    login(fakeUser, "fake-user-token");
    router.push("/account");
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white py-2">
          Login
        </button>
      </form>
    </div>
  );
}