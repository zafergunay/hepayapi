"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./container";
import { BrandLogo } from "./brand-logo";
import { DesktopNav, MobileNav } from "./mobile-nav";
import {
  getHeroCovering,
  getHeroCoveringServerSnapshot,
  subscribeHeroCovering,
} from "./hero-scrim";

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

// The home page opens on a dark film hero at every breakpoint — including in
// the server HTML, where the poster frame is already painted — so the header
// can go transparent/white on sight without waiting for hydration to confirm
// what is underneath it. It previously gated this on `lg: + motion-safe:` while
// the server still rendered a *light* hero, which left the nav white-on-white
// until React took over.
//
// On the home page the header is also taken out of flow, so the film starts at
// y=0 instead of below a 65px strip of bare page background — the other half of
// that same disappearing-menu bug. Elsewhere it stays sticky and reserves its
// own space. The hero is at least one viewport tall, so "not scrolled"
// reliably means "over the film".
export function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const onFilm = useSyncExternalStore(
    subscribeHeroCovering,
    getHeroCovering,
    getHeroCoveringServerSnapshot,
  );
  const isHome = pathname === "/";
  // `!scrolled` carries the very first paint, before the hero has published
  // anything; after that the film's own measurement takes over — it stays
  // transparent for the whole multi-viewport scrub, not just the first 32px.
  const overFilm = isHome && (!scrolled || onFilm);

  return (
    <header
      className={`z-50 border-b transition-colors duration-300 ${
        isHome ? "fixed inset-x-0 top-0" : "sticky top-0"
      } ${
        overFilm
          ? "border-transparent bg-transparent"
          : "border-line bg-canvas/90 backdrop-blur"
      }`}
    >
      <Container className="flex h-[65px] items-center justify-between">
        <Link href="/" aria-label="Hepa Yapı — Anasayfa" className="flex items-center">
          <BrandLogo
            onDark={overFilm}
            crossfade
            priority
            sizes="140px"
            className="h-9 sm:h-10"
          />
        </Link>

        <DesktopNav dark={overFilm} />

        <div className="flex items-center gap-3">
          <Link
            href="/iletisim"
            className={`hidden rounded-sm border px-4 py-2 font-mono text-[12px] uppercase tracking-[0.14em] transition-all duration-200 md:inline-block ${
              overFilm
                ? "border-white/25 text-white hover:border-accent-bright hover:text-accent-bright"
                : "border-line-strong text-ink hover:border-accent hover:text-accent"
            }`}
          >
            Değerlendirme Talep Et
          </Link>
          <MobileNav dark={overFilm} />
        </div>
      </Container>
    </header>
  );
}
