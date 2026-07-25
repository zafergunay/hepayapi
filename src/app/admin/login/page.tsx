"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/site/brand-logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Giriş başarısız.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Bir şeyler ters gitti. Lütfen tekrar deneyin.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel — the same graphite/blueprint language as the public site. */}
      <div className="relative hidden overflow-hidden bg-graphite lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div className="blueprint-mesh pointer-events-none absolute inset-0 opacity-50" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 15% 0%, rgba(29,95,214,.28), transparent 60%)",
          }}
        />

        <div className="relative">
          <BrandLogo variant="full" onDark sizes="300px" className="h-20" priority />
        </div>

        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-bright">
            İçerik Yönetimi
          </p>
          <p className="mt-4 max-w-sm font-display text-2xl font-semibold leading-snug text-white">
            Hizmetleri, projeleri ve gelen talepleri tek yerden yönetin.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
            Buradan yaptığınız her değişiklik yayındaki siteye anında yansır.
          </p>
        </div>

        <p className="relative font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
          Kahramanmaraş · Hatay · Adıyaman
        </p>
      </div>

      <div className="flex items-center justify-center bg-canvas px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-9 lg:hidden">
            <BrandLogo variant="full" sizes="220px" className="mx-auto h-14" priority />
          </div>

          <h1 className="font-display text-2xl font-semibold text-ink">Giriş yapın</h1>
          <p className="mt-1.5 text-sm text-muted">
            Devam etmek için yönetici bilgilerinizi girin.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
              >
                Kullanıcı Adı
              </label>
              <input
                id="email"
                type="text"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
              >
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors duration-200 focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-sm border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-sm bg-accent px-3 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-accent-bright disabled:opacity-60"
            >
              {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
