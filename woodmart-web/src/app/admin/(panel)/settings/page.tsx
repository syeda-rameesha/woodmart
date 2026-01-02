// src/app/admin/settings/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) router.push("/admin/login");
  }, [router]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Settings saved (client placeholder)");
    // NOTE: to persist settings you should implement backend endpoint /api/admin/settings
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>

      <form onSubmit={handleSave} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Admin display name</label>
          <input className="w-full border p-2 rounded" placeholder="Admin" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Notification email</label>
          <input className="w-full border p-2 rounded" placeholder="notify@yourdomain.com" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Notes</label>
          <textarea className="w-full border p-2 rounded" rows={4} placeholder="Optional notes" />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-black text-white rounded">Save settings</button>
        </div>
      </form>

      <div className="mt-6 text-sm text-gray-500">
        Note: To change the admin email/password used for login you must update environment variables on the backend (ADMIN_EMAIL / ADMIN_PASSWORD) or add a server endpoint to persist credential changes. I can add that endpoint if you want.
      </div>
    </div>
  );
}
