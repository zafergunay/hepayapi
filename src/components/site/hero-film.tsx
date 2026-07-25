"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { SectionLabel } from "./section-label";
import { IconArrow, IconPin } from "./icons";
import { REGION_LABELS, REGION_ORDER } from "./regions";
import { useScrollScrub, span, window01 } from "./use-scroll-scrub";
import { setHeroCovering } from "./hero-scrim";

// Two encodes of the same 10s film: a dense-keyframe one that seeks cleanly
// under a scrub, and a small looping one for phones that never scrub.
const SCRUB_SRC = "/videos/hero-scrub.mp4";
const LOOP_SRC = "/videos/hero-loop.mp4";
const POSTER = "/videos/hero-poster.jpg";

const STAGES = [
  { index: "§01", label: "Analiz" },
  { index: "§02", label: "Dijital İkiz" },
  { index: "§03", label: "Güçlendirme" },
];

function RegionRow() {
  return (
    <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/12 pt-6">
      {REGION_ORDER.map((region) => (
        <span
          key={region}
          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/55"
        >
          <IconPin className="h-3.5 w-3.5 text-accent-bright" />
          {REGION_LABELS[region]}
        </span>
      ))}
    </div>
  );
}

export function HeroFilm({
  heroTitle,
  heroSubtitle,
}: {
  heroTitle: string;
  heroSubtitle: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrimRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railFillRef = useRef<HTMLSpanElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  // Smoothed playhead. Following the raw scroll position 1:1 makes the film
  // twitch on trackpads; easing toward the target gives it weight.
  const playhead = useRef(0);
  const collapsedApplied = useRef(false);

  // Source is chosen on the client so the two encodes never both download, and
  // so the server HTML carries no device assumption — the poster covers the gap.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrubs = window.matchMedia("(min-width: 1024px)").matches && !calm;

    video.src = scrubs ? SCRUB_SRC : LOOP_SRC;
    video.loop = !scrubs && !calm;

    if (calm) {
      // Reduced motion: the film holds on its opening frame. Nothing moves
      // unless the visitor moves it.
      return;
    }

    if (scrubs) {
      // Priming the decoder: several browsers won't render a seek target until
      // the element has played at least once.
      video.play().then(() => video.pause()).catch(() => {});
    } else {
      video.play().catch(() => {});
    }
  }, []);

  // Tell the header how long it is still sitting on the film. Driven by scroll
  // rather than the scrub loop because that loop stops once the section leaves
  // the viewport, which is exactly when this has to flip.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const update = () => setHeroCovering(section.getBoundingClientRect().bottom > 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      setHeroCovering(false);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const onTick = useCallback((progress: number, scrubbing: boolean) => {
    const video = videoRef.current;

    if (!scrubbing) {
      // Collapsed layout: the film just loops and stage 01 stays put. Written
      // once rather than every frame.
      if (collapsedApplied.current) return;
      collapsedApplied.current = true;
      const first = stageRefs.current[0];
      if (first) {
        first.style.opacity = "1";
        first.style.transform = "none";
      }
      return;
    }
    collapsedApplied.current = false;

    if (video) {
      const duration = video.duration;
      if (Number.isFinite(duration) && duration > 0) {
        const target = progress * (duration - 0.06);
        playhead.current += (target - playhead.current) * 0.14;
        // Only seek once the drift exceeds half a source frame; assigning
        // currentTime every frame stalls the decoder on Safari.
        if (Math.abs(playhead.current - video.currentTime) > 1 / 48) {
          video.currentTime = playhead.current;
        }
      }
    }

    const opacities = [
      // Stage 01 must be at full opacity the instant the page loads at scroll
      // top, so it only ever fades *out* — no lead-in window.
      1 - span(progress, 0.22, 0.32),
      window01(progress, 0.36, 0.66, 0.07),
      span(progress, 0.7, 0.78),
    ];

    for (let i = 0; i < opacities.length; i++) {
      const node = stageRefs.current[i];
      if (!node) continue;
      const o = opacities[i];
      node.style.opacity = String(o);
      node.style.transform = `translate3d(0, ${(1 - o) * 26}px, 0)`;
      node.style.visibility = o < 0.01 ? "hidden" : "visible";
    }

    // Stages 01 and 03 sit left, stage 02 sits right.
    if (scrimRefs.current[0]) {
      scrimRefs.current[0].style.opacity = String(Math.max(opacities[0], opacities[2]));
    }
    if (scrimRefs.current[1]) {
      scrimRefs.current[1].style.opacity = String(opacities[1]);
    }

    if (railFillRef.current) {
      railFillRef.current.style.transform = `scaleY(${progress})`;
    }
    if (readoutRef.current) {
      const active = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;
      const text = `${STAGES[active].index} ${STAGES[active].label} · ${Math.round(progress * 100)}%`;
      if (readoutRef.current.textContent !== text) {
        readoutRef.current.textContent = text;
      }
    }
  }, []);

  useScrollScrub(sectionRef, onTick);

  return (
    <section ref={sectionRef} className="scrub-stage scrub-hero relative bg-graphite">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <video
          ref={videoRef}
          poster={POSTER}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Legibility stack. The top scrim is what guarantees the header reads
            over the film no matter which frame is parked under it; the side
            scrims cross-fade so the dark half is always the half carrying the
            copy, leaving the other half of the film at full strength. */}
        <div className="absolute inset-0 bg-graphite/30" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-graphite via-graphite/70 to-transparent" />
        <div
          ref={(el) => {
            scrimRefs.current[0] = el;
          }}
          className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/65 to-transparent"
        />
        <div
          ref={(el) => {
            scrimRefs.current[1] = el;
          }}
          className="absolute inset-0 bg-gradient-to-l from-graphite via-graphite/65 to-transparent opacity-0"
        />
        <div className="blueprint-mesh pointer-events-none absolute inset-0 opacity-60" />

        {/* STAGE 01 — the pitch */}
        <div
          ref={(el) => {
            stageRefs.current[0] = el;
          }}
          className="absolute inset-0 flex items-center"
        >
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-14">
            <div className="max-w-2xl">
              <div className="hepa-rise" style={{ animationDelay: "80ms" }}>
                <SectionLabel index="§01" tone="dark">
                  Deprem Güçlendirme &amp; İnşaat Mühendisliği
                </SectionLabel>
              </div>
              <h1
                className="hepa-rise mt-6 font-display text-4xl font-semibold leading-[1.06] text-white sm:text-5xl lg:text-[3.5rem]"
                style={{ animationDelay: "180ms" }}
              >
                {heroTitle}
              </h1>
              <p
                className="hepa-rise mt-6 max-w-lg text-base leading-relaxed text-white/65"
                style={{ animationDelay: "300ms" }}
              >
                {heroSubtitle}
              </p>
              <div
                className="hepa-rise mt-9 flex flex-wrap items-center gap-4"
                style={{ animationDelay: "400ms" }}
              >
                <Link
                  href="/iletisim"
                  className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white transition-all duration-[250ms] hover:-translate-y-px hover:scale-[1.015] hover:bg-accent-bright"
                >
                  Ücretsiz Risk Değerlendirmesi
                  <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/hizmetler"
                  className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-colors duration-200 hover:border-accent-bright hover:text-accent-bright"
                >
                  Hizmetlerimiz
                </Link>
              </div>
              <div className="hepa-rise" style={{ animationDelay: "520ms" }}>
                <RegionRow />
              </div>
            </div>
          </div>
        </div>

        {/* STAGE 02 — mid-scrub, as the film cuts to the wireframe overlay */}
        <div
          ref={(el) => {
            stageRefs.current[1] = el;
          }}
          className="scrub-only-flex absolute inset-0 items-center opacity-0"
          style={{ visibility: "hidden" }}
        >
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-14">
            <div className="ml-auto max-w-lg text-right">
              <div className="flex justify-end">
                <SectionLabel index="§02" tone="dark">
                  Dijital İkiz &amp; Risk Analizi
                </SectionLabel>
              </div>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.12] text-white">
                Mevcut yapının dijital ikizini kurar, deprem altındaki davranışını hesaplarız.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-white/60">
                Yerinde ölçüm, beton karot ve donatı tespitiyle taşıyıcı sistemin gerçek
                kapasitesini çıkarır; statik hesabı tahmin üzerine değil, ölçülmüş veri üzerine
                kurarız.
              </p>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-bright">
                Saha ölçümü · Malzeme testi · Performans analizi
              </p>
            </div>
          </div>
        </div>

        {/* STAGE 03 — the film lands on the finished building */}
        <div
          ref={(el) => {
            stageRefs.current[2] = el;
          }}
          className="scrub-only-flex absolute inset-0 items-center opacity-0"
          style={{ visibility: "hidden" }}
        >
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-14">
            <div className="max-w-lg">
              <SectionLabel index="§03" tone="dark">
                Uygulama &amp; Teslim
              </SectionLabel>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.12] text-white">
                Çelik gömlekleme ve karbon fiber sargıyla taşıyıcı sistem yeniden ayağa kalkar.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-white/60">
                Hesap raporundaki katman sayısı ve donatıya birebir uygun uygulama, her aşamada
                denetlenir ve belgeleriyle birlikte teslim edilir.
              </p>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-bright">
                CFRP sargı · Çelik gömlekleme · Denetimli teslim
              </p>
            </div>
          </div>
        </div>

        {/* Progress rail — a drafting-style scale that tracks the scrub */}
        <div className="scrub-only pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 xl:right-12">
          <div className="relative h-40 w-px bg-white/15">
            <span
              ref={railFillRef}
              className="absolute inset-x-0 top-0 h-full origin-top bg-accent-bright"
              style={{ transform: "scaleY(0)" }}
            />
            {STAGES.map((stage, i) => (
              <span
                key={stage.index}
                className="absolute -left-1 h-px w-2.5 bg-white/35"
                style={{ top: `${(i / (STAGES.length - 1)) * 100}%` }}
              />
            ))}
          </div>
        </div>

        {/* Technical readout + scroll cue */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex w-full max-w-[1200px] items-end justify-between gap-6 px-5 pb-8 sm:px-8 lg:px-14">
            <span
              ref={readoutRef}
              className="scrub-only font-mono text-[11px] uppercase tracking-[0.16em] text-white/40"
            >
              §01 Analiz · 0%
            </span>
            <span className="ml-auto flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
              Keşfetmek için kaydırın
              <span className="relative block h-8 w-px overflow-hidden bg-white/20">
                <span className="absolute inset-x-0 top-0 h-2.5 animate-[hepa-scroll-cue_1.9s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-accent-bright" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
