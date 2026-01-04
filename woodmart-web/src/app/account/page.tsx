"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/store/useUser";

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useUser();

  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="max-w-xl mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="mt-6 border px-4 py-2"
      >
        Logout
      </button>
    </div>
  );
}