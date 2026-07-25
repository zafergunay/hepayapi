import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BrandLogo } from "@/components/site/brand-logo";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Drives the sidebar badge. Failing soft keeps the panel usable if the
  // database is unreachable — the nav still renders, just without a count.
  const unreadCount = await prisma.contactMessage
    .count({ where: { read: false } })
    .catch(() => 0);

  return (
    <div className="min-h-screen bg-canvas text-ink lg:flex">
      {/* Below lg the sidebar would eat most of a phone screen, so the same nav
          becomes a scrollable strip under a compact bar. */}
      <div className="sticky top-0 z-40 border-b border-line bg-surface lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" aria-label="Yönetim paneli ana sayfası">
            <BrandLogo sizes="120px" className="h-7" />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent"
            >
              Site
            </Link>
            <LogoutButton className="w-auto px-3 py-1.5 text-center text-xs" />
          </div>
        </div>
        <AdminNav unreadCount={unreadCount} orientation="horizontal" />
      </div>

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <div className="border-b border-line px-5 py-5">
          <Link href="/admin" aria-label="Yönetim paneli ana sayfası" className="inline-block">
            <BrandLogo sizes="150px" className="h-8" />
          </Link>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Yönetim Paneli
          </p>
        </div>

        <AdminNav unreadCount={unreadCount} />

        <div className="space-y-2 border-t border-line p-3">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:bg-canvas hover:text-accent"
          >
            Siteyi görüntüle
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
