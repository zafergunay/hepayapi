"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { SectionLabel } from "./section-label";
import { ColumnSectionDiagram } from "./diagrams";
import type { RigState } from "./column-rig";
import { useScrollScrub } from "./use-scroll-scrub";

const AnatomyCanvas = dynamic(() => import("./anatomy-canvas"), { ssr: false });

const STAGES = [
  {
    index: "01",
    title: "Mevcut Durum",
    caption: "Röleve · Karot · Donatı tespiti",
    text: "Kolonun gerçek beton sınıfı, donatı düzeni ve mevcut hasarları sahada ölçülerek belgelenir. Model, projeden değil binadan çıkar.",
    at: 0.06,
  },
  {
    index: "02",
    title: "Analiz",
    caption: "Performans analizi · Deprem yönetmeliği",
    text: "Taşıyıcı sistem modellenir ve deprem etkisi altındaki davranışı hesaplanır. Hangi kolonun neden yetersiz kaldığı sayıyla ortaya konur.",
    at: 0.36,
  },
  {
    index: "03",
    title: "Çelik Gömlekleme",
    caption: "Köşe korniyer · Yatay şerit",
    text: "Kesiti yetersiz kalan kolonlar çelik plaka ve şeritlerle sarılır; kesit büyür, yük taşıma kapasitesi artar.",
    at: 0.6,
  },
  {
    index: "04",
    title: "CFRP Sargı",
    caption: "Karbon fiber · Çok katlı uygulama",
    text: "Karbon fiber sargı kolonun sünekliğini ve kesme dayanımını yükseltir. Kat sayısı, hesap raporundaki talebe göre belirlenir.",
    at: 0.9,
  },
];

export function Anatomy3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  // Written every frame by the scroll loop and by drag, read inside useFrame.
  // The ref object is handed to the canvas as-is; nothing reads `.current`
  // during render, so it never participates in the React render cycle.
  const rigState = useRef<RigState>({ progress: 0, yaw: 0, pitch: 0 });
  // Where the rig should ease to when there is no scroll travel to follow.
  const manualTarget = useRef(0);

  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);

  // three.js loads only once the section is close, and never for visitors who
  // asked for reduced motion — they get the drafted section instead.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setMounted(true);
        observer.disconnect();
      },
      { rootMargin: "40% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onTick = useCallback(
    (progress: number, scrubbing: boolean) => {
      if (scrubbing) {
        rigState.current.progress += (progress - rigState.current.progress) * 0.12;
      } else {
        rigState.current.progress += (manualTarget.current - rigState.current.progress) * 0.06;
      }

      const stage = STAGES.reduce(
        (acc, s, i) => (rigState.current.progress >= s.at - 0.14 ? i : acc),
        0,
      );
      // The only per-frame React update, and it no-ops except at the four
      // stage boundaries.
      setActive((prev) => (prev === stage ? prev : stage));

      if (readoutRef.current) {
        const text = `AŞAMA ${STAGES[stage].index} / 04 · ${Math.round(rigState.current.progress * 100)}%`;
        if (readoutRef.current.textContent !== text) readoutRef.current.textContent = text;
      }
    },
    [rigState],
  );

  useScrollScrub(sectionRef, onTick);

  // Drag to orbit. `touch-action: pan-y` on the surface keeps the page
  // scrollable under the same gesture on touch devices.
  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      rigState.current.yaw += (e.clientX - lastX) * 0.006;
      rigState.current.pitch = Math.max(-0.5, Math.min(0.5, rigState.current.pitch + (e.clientY - lastY) * 0.002));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const up = () => {
      dragging = false;
    };

    surface.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      surface.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [rigState]);

  // Same travel definition the scrub hook uses, so a chip lands exactly on the
  // scroll position that produces its stage.
  const goToStage = useCallback((i: number) => {
    const el = sectionRef.current;
    const panel = el?.firstElementChild as HTMLElement | null;
    if (!el || !panel) return;

    const travel = el.offsetHeight - panel.offsetHeight;
    if (travel < window.innerHeight * 0.25) {
      manualTarget.current = STAGES[i].at;
      return;
    }

    const stickyTop = parseFloat(getComputedStyle(panel).top) || 0;
    window.scrollTo({
      top:
        window.scrollY + el.getBoundingClientRect().top - stickyTop + STAGES[i].at * travel,
      behavior: "smooth",
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="anatomi-baslik"
      className="scrub-stage scrub-anatomy relative border-y border-white/10 bg-graphite"
    >
      <div className="scrub-panel-inset sticky overflow-hidden">
        <div className="blueprint-mesh pointer-events-none absolute inset-0 opacity-40" />
        {/* The model gets its own half of the panel on wide screens so the
            column is never behind the copy; below that it fills the panel and
            the copy sits on a scrim. */}
        <div
          ref={surfaceRef}
          className="absolute inset-0 touch-pan-y lg:left-[38%]"
          style={{ cursor: mounted ? "grab" : undefined }}
        >
          {mounted ? (
            <AnatomyCanvas stateRef={rigState} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ColumnSectionDiagram className="h-[70%] w-auto text-white/25" />
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-graphite via-graphite/80 to-transparent lg:hidden" />

        <div className="pointer-events-none relative mx-auto flex h-full w-full max-w-[1200px] items-center px-5 py-10 sm:px-8 lg:px-14 lg:py-14">
          <div className="w-full max-w-md">
            <SectionLabel index="§03" tone="dark">
              Güçlendirme Anatomisi
            </SectionLabel>
            <h2
              id="anatomi-baslik"
              className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl"
            >
              Bir kolon nasıl güçlenir?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Kesitin içini açıp dört aşamayı sırayla gösteriyoruz. Modeli sürükleyerek
              döndürebilirsiniz.
            </p>

            <div className="pointer-events-auto mt-8 flex flex-wrap gap-2">
              {STAGES.map((stage, i) => (
                <button
                  key={stage.index}
                  type="button"
                  onClick={() => goToStage(i)}
                  aria-current={active === i}
                  className={`rounded-sm border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 ${
                    active === i
                      ? "border-accent-bright bg-accent-bright/10 text-accent-bright"
                      : "border-white/15 text-white/45 hover:border-white/35 hover:text-white/80"
                  }`}
                >
                  {stage.index}
                  <span className="hidden sm:inline"> · {stage.title}</span>
                </button>
              ))}
            </div>

            {/* One card, swapped as the scrub crosses each stage. Keyed so the
                entrance animation replays on every change. */}
            <div className="mt-6 min-h-[190px] rounded-md border border-white/10 bg-graphite-2/85 p-6 backdrop-blur-sm">
              <div key={STAGES[active].index} className="hepa-rise">
                <span className="font-mono text-[11px] tracking-[0.14em] text-accent-bright">
                  {STAGES[active].caption}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-white">
                  {STAGES[active].index} — {STAGES[active].title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                  {STAGES[active].text}
                </p>
              </div>
            </div>

            <span
              ref={readoutRef}
              className="mt-4 block font-mono text-[11px] uppercase tracking-[0.16em] text-white/30"
            >
              AŞAMA 01 / 04 · 0%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
