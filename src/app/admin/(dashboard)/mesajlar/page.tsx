import { prisma } from "@/lib/prisma";
import { deleteMessage, markMessageAsRead } from "./actions";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Mesajlar</h1>
        <p className="mt-1 text-sm text-muted">İletişim formundan gelen talepler.</p>
      </header>

      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-lg border p-5 shadow-[var(--shadow-1)] ${
              message.read
                ? "border-line bg-surface"
                : "border-accent bg-accent-wash"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-ink">
                  {message.name}
                  {!message.read && (
                    <span className="ml-2 rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-white">
                      Yeni
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  {message.email}
                  {message.phone ? ` · ${message.phone}` : ""}
                </p>
              </div>
              <p className="font-mono text-xs text-muted">{formatDate(message.createdAt)}</p>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm text-ink">{message.message}</p>

            <div className="mt-4 flex items-center gap-4">
              {!message.read && (
                <form action={markMessageAsRead.bind(null, message.id)}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-accent-ink hover:underline"
                  >
                    Okundu işaretle
                  </button>
                </form>
              )}
              <form action={deleteMessage.bind(null, message.id)}>
                <button
                  type="submit"
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Sil
                </button>
              </form>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="rounded-lg border border-line bg-surface p-8 text-center text-sm text-muted shadow-[var(--shadow-1)]">
            Henüz mesaj yok.
          </div>
        )}
      </div>
    </div>
  );
}
