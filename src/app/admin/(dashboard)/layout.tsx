import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";

const NAV_ITEMS = [
  { href: "/admin", label: "Genel Bakış" },
  { href: "/admin/hizmetler", label: "Hizmetler" },
  { href: "/admin/projeler", label: "Projeler" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/mesajlar", label: "Mesajlar" },
  { href: "/admin/ayarlar", label: "Ayarlar" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-surface">
        <div className="border-b border-line px-6 py-6">
          <p className="font-display text-lg font-semibold text-ink">Hepa</p>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">
            Yönetim Paneli
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:bg-accent-wash hover:text-accent-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-line p-4">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
