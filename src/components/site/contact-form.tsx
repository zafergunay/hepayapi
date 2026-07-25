"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim() || undefined,
      message: String(data.get("message") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setErrorMessage(body?.error ?? "Bir şeyler ters gitti, lütfen tekrar deneyin.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("Bağlantı hatası. Lütfen tekrar deneyin.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-md border border-line bg-accent-wash p-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-ink">
          Talebiniz Alındı
        </span>
        <p className="mt-3 font-display text-xl font-semibold text-ink">Teşekkürler.</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Mesajınız ekibimize ulaştı. En kısa sürede, genellikle 48 saat içinde, sizinle
          iletişime geçeceğiz.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-accent underline underline-offset-4"
        >
          Yeni mesaj gönder
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ad Soyad" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={120}
            className="input"
            placeholder="Adınız Soyadınız"
          />
        </Field>
        <Field label="Telefon (opsiyonel)" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={30}
            className="input"
            placeholder="0 (5xx) xxx xx xx"
          />
        </Field>
      </div>

      <Field label="E-posta" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input"
          placeholder="ornek@eposta.com"
        />
      </Field>

      <Field label="Mesajınız" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className="input resize-none"
          placeholder="Bina türü, konum ve talebinizi kısaca anlatın."
        />
      </Field>

      {status === "error" ? (
        <p className="rounded-sm border border-line-strong bg-canvas px-4 py-3 text-sm text-ink">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-sm bg-accent px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white transition-all duration-[250ms] hover:-translate-y-px hover:scale-[1.015] hover:bg-accent-bright disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Gönderiliyor…" : "Mesajı Gönder"}
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid var(--color-line);
          background: var(--color-surface);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          font-size: 0.9375rem;
          color: var(--color-ink);
          transition: border-color 0.2s ease;
        }
        .input::placeholder {
          color: var(--color-muted);
        }
        .input:focus {
          outline: none;
          border-color: var(--color-accent);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
