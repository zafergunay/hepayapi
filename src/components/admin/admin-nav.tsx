"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type IconProps = { className?: string };

function Glyph({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      strokeWidth={1.6}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const IconOverview = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.2" />
  </Glyph>
);

const IconServices = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M12 3l8.5 4.5L12 12 3.5 7.5 12 3z" />
    <path d="M3.5 12L12 16.5 20.5 12" />
    <path d="M3.5 16.5L12 21l8.5-4.5" />
  </Glyph>
);

const IconProjects = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M4 21V7l7-4v18" />
    <path d="M11 11h9v10h-9" />
    <path d="M14 15h3M14 18h3M7 11h1M7 15h1" />
  </Glyph>
);

const IconBlog = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="4" y="3" width="16" height="18" rx="1.6" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </Glyph>
);

const IconMessages = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="3" y="5" width="18" height="14" rx="1.6" />
    <path d="M3.5 6.5l8.5 6 8.5-6" />
  </Glyph>
);

const IconSettings = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h7M15 17h5" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="12" r="2" />
    <circle cx="13" cy="17" r="2" />
  </Glyph>
);

const NAV_ITEMS = [
  { href: "/admin", label: "Genel Bakış", Icon: IconOverview },
  { href: "/admin/hizmetler", label: "Hizmetler", Icon: IconServices },
  { href: "/admin/projeler", label: "Projeler", Icon: IconProjects },
  { href: "/admin/blog", label: "Blog", Icon: IconBlog },
  { href: "/admin/mesajlar", label: "Mesajlar", Icon: IconMessages },
  { href: "/admin/ayarlar", label: "Ayarlar", Icon: IconSettings },
];

export function AdminNav({
  unreadCount = 0,
  orientation = "vertical",
}: {
  unreadCount?: number;
  orientation?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();
  const horizontal = orientation === "horizontal";

  return (
    <nav
      className={
        horizontal
          ? "flex gap-1 overflow-x-auto px-3 pb-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "flex flex-1 flex-col gap-0.5 p-3"
      }
    >
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        // "/admin" would otherwise match every child route.
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        const badge = href === "/admin/mesajlar" ? unreadCount : 0;

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center gap-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${
              horizontal ? "shrink-0 px-3 py-2" : "gap-3 px-3 py-2.5"
            } ${
              active
                ? "bg-accent-wash text-accent-ink"
                : "text-muted hover:bg-canvas hover:text-ink"
            }`}
          >
            {horizontal ? null : (
              <span
                className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent transition-opacity duration-200 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
            <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-accent" : ""}`} />
            {label}
            {badge > 0 ? (
              <span
                className={`rounded-full bg-accent px-1.5 py-0.5 font-mono text-[10px] leading-none text-white ${
                  horizontal ? "" : "ml-auto"
                }`}
              >
                {badge > 99 ? "99+" : badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
