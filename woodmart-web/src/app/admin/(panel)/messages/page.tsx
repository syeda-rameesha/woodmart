// src/app/admin/messages/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";
import Loader from "@/components/ui/Loader";

type Message = {
  _id: string;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
};

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // load when component mounts
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!token) {
      // not logged in -> go to login
      router.push("/admin/login");
      return;
    }
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMessages() {
    setLoading(true);
    try {
      // adminApi will auto-read token from localStorage if you pass null
      const res = await adminApi<{ messages: Message[] }>("/admin/messages", null, { method: "GET" });
      setMessages(res.messages || []);
    } catch (err: any) {
      console.error("Failed to load messages:", err);
      toast.error(err?.message || "Failed to load messages");
      if (err?.status === 401 || err?.status === 403) {
        // token invalid
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    try {
      await adminApi(`/admin/messages/${id}`, null, { method: "DELETE" });
      toast.success("Message deleted");
      setMessages((s) => s.filter((m) => m._id !== id));
    } catch (err: any) {
      console.error("Delete failed:", err);
      toast.error(err?.message || "Delete failed");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        <div>
          <button
            onClick={loadMessages}
            className="px-3 py-1 rounded bg-black text-white text-sm"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && (
       <div className="flex items-center justify-center h-[60vh]">
       <Loader size={32} />
       </div>
        )}

      {!loading && messages.length === 0 && (
        <div className="text-gray-600">No messages found.</div>
      )}

      <div className="space-y-4 mt-4">
        {messages.map((m) => (
          <div key={m._id} className="bg-white border rounded p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="font-semibold">{m.name || "Guest"}</div>
                  <div className="text-sm text-gray-500">{m.email || "-"}</div>
                  {m.subject && <div className="text-sm text-gray-400">· {m.subject}</div>}
                </div>

                <div className="mt-2 text-gray-800 whitespace-pre-wrap">{m.message}</div>
              </div>

              <div className="text-right ml-4">
                <div className="text-sm text-gray-500">
                  {m.createdAt ? new Date(m.createdAt).toLocaleString() : "-"}
                </div>

                <button
                  onClick={() => handleDelete(m._id)}
                  className="mt-3 text-red-600 underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
