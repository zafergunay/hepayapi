import Link from "next/link";
import { prisma } from "@/lib/prisma";

const formatDate = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminDashboardPage() {
  const [serviceCount, projectCount, blogCount, draftCount, unreadCount, recentMessages] =
    await Promise.all([
      prisma.service.count(),
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: false } }),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  const cards = [
    { label: "Hizmetler", value: serviceCount, href: "/admin/hizmetler", note: "yayında" },
    { label: "Projeler", value: projectCount, href: "/admin/projeler", note: "kayıtlı" },
    {
      label: "Blog Yazıları",
      value: blogCount,
      href: "/admin/blog",
      note: draftCount > 0 ? `${draftCount} taslak` : "tümü yayında",
    },
    {
      label: "Okunmamış Mesaj",
      value: unreadCount,
      href: "/admin/mesajlar",
      note: unreadCount > 0 ? "yanıt bekliyor" : "hepsi okundu",
      alert: unreadCount > 0,
    },
  ];

  const actions = [
    { label: "Yeni hizmet ekle", href: "/admin/hizmetler/yeni" },
    { label: "Yeni proje ekle", href: "/admin/projeler/yeni" },
    { label: "Yeni blog yazısı", href: "/admin/blog/yeni" },
    { label: "Site ayarları", href: "/admin/ayarlar" },
  ];

  return (
    <div>
      <header className="mb-9 border-b border-line pb-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          Yönetim Paneli
        </p>
        <h1 className="mt-2.5 font-display text-3xl font-semibold text-ink">Genel Bakış</h1>
        <p className="mt-2 text-sm text-muted">Site içeriğinin ve gelen taleplerin özeti.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-md border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-[var(--shadow-2)]"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {card.label}
            </p>
            <p
              className={`mt-3 font-display text-4xl font-semibold tabular-nums ${
                card.alert ? "text-accent" : "text-ink"
              }`}
            >
              {card.value}
            </p>
            <p className="mt-1.5 font-mono text-[11px] tracking-[0.08em] text-muted">
              {card.note}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-md border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-base font-semibold text-ink">Son Mesajlar</h2>
            <Link
              href="/admin/mesajlar"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors hover:text-accent-ink"
            >
              Tümü
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted">
              Henüz mesaj yok. İletişim formundan gelen talepler burada görünecek.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {recentMessages.map((message) => (
                <li key={message.id}>
                  <Link
                    href="/admin/mesajlar"
                    className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-canvas"
                  >
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        message.read ? "bg-line-strong" : "bg-accent"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span
                          className={`truncate text-sm ${
                            message.read ? "text-muted" : "font-medium text-ink"
                          }`}
                        >
                          {message.name}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                          {formatDate.format(message.createdAt)}
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-[13px] text-muted">
                        {message.message}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-md border border-line bg-surface">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-display text-base font-semibold text-ink">Hızlı İşlemler</h2>
          </div>
          <ul className="divide-y divide-line">
            {actions.map((action) => (
              <li key={action.href}>
                <Link
                  href={action.href}
                  className="group flex items-center justify-between px-5 py-3.5 text-sm text-ink/85 transition-colors hover:bg-canvas hover:text-accent"
                >
                  {action.label}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
