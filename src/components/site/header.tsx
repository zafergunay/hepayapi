"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./container";
import { DesktopNav, MobileNav } from "./mobile-nav";
import { use3DSceneEnabled } from "./use-3d-scene-enabled";

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

export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const dark3DHeroActive = use3DSceneEnabled();
  const onHero = pathname === "/" && !scrolled && dark3DHeroActive;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        onHero ? "border-transparent bg-transparent" : "border-line bg-canvas/90 backdrop-blur"
      }`}
    >
      <Container className="flex h-[65px] items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span
            className={`font-display text-lg font-bold tracking-tight transition-colors duration-300 ${
              onHero ? "text-white" : "text-ink"
            }`}
          >
            HE<span className={onHero ? "text-accent-bright" : "text-accent"}>PA</span>
          </span>
          <span
            className={`hidden font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 sm:inline ${
              onHero ? "text-white/50" : "text-muted"
            }`}
          >
            İnşaat &amp; Güçlendirme
          </span>
        </Link>

        <DesktopNav dark={onHero} />

        <div className="flex items-center gap-3">
          <Link
            href="/iletisim"
            className={`hidden rounded-sm border px-4 py-2 font-mono text-[12px] uppercase tracking-[0.14em] transition-all duration-200 md:inline-block ${
              onHero
                ? "border-white/25 text-white hover:border-accent-bright hover:text-accent-bright"
                : "border-line-strong text-ink hover:border-accent hover:text-accent"
            }`}
          >
            Değerlendirme Talep Et
          </Link>
          <MobileNav dark={onHero} />
        </div>
      </Container>
    </header>
  );
}
