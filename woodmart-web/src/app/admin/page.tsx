// src/app/admin/page.tsx
import Link from "next/link";

export default function AdminIndex() {
  return (
    <div className="max-w-2xl mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <p className="mb-4">Go to:</p>
      <div className="space-x-3">
        <Link href="/admin/login" className="text-blue-600 underline">Admin Login</Link>
        <Link href="/admin/dashboard" className="text-blue-600 underline">Dashboard</Link>
      </div>
    </div>
  );
}
