// src/components/admin/AdminGuard.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/store/useAdmin";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const isAuthed = useAdmin((s) => s.isAuthed());
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed) router.replace("/admin/login");
  }, [isAuthed, router]);

  if (!isAuthed) return null; // or a small spinner

  return <>{children}</>;
}