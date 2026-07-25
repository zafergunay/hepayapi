import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [serviceCount, projectCount, blogCount, unreadCount] = await Promise.all([
    prisma.service.count(),
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  const cards = [
    { label: "Hizmetler", value: serviceCount, href: "/admin/hizmetler" },
    { label: "Projeler", value: projectCount, href: "/admin/projeler" },
    { label: "Blog Yazıları", value: blogCount, href: "/admin/blog" },
    { label: "Okunmamış Mesaj", value: unreadCount, href: "/admin/mesajlar" },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Genel Bakış</h1>
        <p className="mt-1 text-sm text-muted">
          Site içeriğinin ve gelen mesajların özeti.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-lg border border-line bg-surface p-5 shadow-[var(--shadow-1)] transition hover:border-line-strong"
          >
            <p className="font-mono text-xs uppercase tracking-wide text-muted">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {card.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
