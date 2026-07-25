"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className={`w-full rounded-md border border-line px-3 py-2 text-left text-sm font-medium text-muted transition-colors duration-200 hover:border-accent hover:text-accent disabled:opacity-60 ${className}`}
    >
      {pending ? "Çıkış yapılıyor…" : "Çıkış Yap"}
    </button>
  );
}
