"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./container";
import { DesktopNav, MobileNav } from "./mobile-nav";

function subscribeScrolled(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getScrolledSnapshot() {
  return window.scrollY > 32;
}

function getScrolledServerSnapshot() {
  return false;
}

function useScrolled() {
  return useSyncExternalStore(subscribeScrolled, getScrolledSnapshot, getScrolledServerSnapshot);
}

// "dark" here means "attempt the transparent/white hero variant". Whether it
// actually renders that way is decided by pure CSS (lg: + motion-safe:), so it
// matches the server-rendered HTML on first paint with no post-hydration flash
// — the 3D hero only ever mounts under that same lg + motion-safe condition.
export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const dark = pathname === "/" && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur transition-colors duration-300 ${
        dark ? "lg:motion-safe:border-transparent lg:motion-safe:bg-transparent lg:motion-safe:backdrop-blur-none" : ""
      }`}
    >
      <Container className="flex h-[65px] items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span
            className={`font-display text-lg font-bold tracking-tight text-ink transition-colors duration-300 ${
              dark ? "lg:motion-safe:text-white" : ""
            }`}
          >
            HE
            <span className={`text-accent ${dark ? "lg:motion-safe:text-accent-bright" : ""}`}>PA</span>
          </span>
          <span
            className={`hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted transition-colors duration-300 sm:inline ${
              dark ? "lg:motion-safe:text-white/50" : ""
            }`}
          >
            İnşaat &amp; Güçlendirme
          </span>
        </Link>

        <DesktopNav dark={dark} />

        <div className="flex items-center gap-3">
          <Link
            href="/iletisim"
            className={`hidden rounded-sm border border-line-strong px-4 py-2 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition-all duration-200 hover:border-accent hover:text-accent md:inline-block ${
              dark
                ? "lg:motion-safe:border-white/25 lg:motion-safe:text-white lg:motion-safe:hover:border-accent-bright lg:motion-safe:hover:text-accent-bright"
                : ""
            }`}
          >
            Değerlendirme Talep Et
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
