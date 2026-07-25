import Link from "next/link";
import { Container } from "./container";
import { DesktopNav, MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur">
      <Container className="flex h-[65px] items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            HE<span className="text-accent">PA</span>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:inline">
            İnşaat &amp; Güçlendirme
          </span>
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-3">
          <Link
            href="/iletisim"
            className="hidden rounded-sm border border-line-strong px-4 py-2 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition-all duration-200 hover:border-accent hover:text-accent md:inline-block"
          >
            Değerlendirme Talep Et
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
