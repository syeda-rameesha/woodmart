"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/store/useUser";

export default function RegisterPage() {
  const router = useRouter();
  const login = useUser((s) => s.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const user = {
      _id: "1",
      name,
      email,
    };

    login(user, "fake-user-token");
    router.push("/account");
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6">Register</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          placeholder="Name"
          className="w-full border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          className="w-full border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white py-2">
          Register
        </button>
      </form>
    </div>
  );
}