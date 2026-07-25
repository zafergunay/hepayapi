"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";
import { ColumnSectionDiagram, GridBackdrop } from "./diagrams";
import { IconArrow, IconPin } from "./icons";
import { REGION_LABELS, REGION_ORDER } from "./regions";

const ColumnRig = dynamic(() => import("./hero-rig"), { ssr: false });

function RegionRow() {
  return (
    <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
      {REGION_ORDER.map((region) => (
        <span
          key={region}
          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
        >
          <IconPin className="h-3.5 w-3.5 text-accent" />
          {REGION_LABELS[region]}
        </span>
      ))}
    </div>
  );
}

function RegionRowDark() {
  return (
    <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6">
      {REGION_ORDER.map((region) => (
        <span
          key={region}
          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/50"
        >
          <IconPin className="h-3.5 w-3.5 text-accent-bright" />
          {REGION_LABELS[region]}
        </span>
      ))}
    </div>
  );
}

function StaticHero({ heroTitle, heroSubtitle }: { heroTitle: string; heroSubtitle: string }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="relative mx-auto grid w-full max-w-[1200px] gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-14 lg:py-28">
        <div>
          <Reveal>
            <SectionLabel index="§01">Deprem Güçlendirme &amp; İnşaat Mühendisliği</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl lg:text-[3.25rem]">
              {heroTitle}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">{heroSubtitle}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/iletisim"
                className="group inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white transition-all duration-[250ms] hover:-translate-y-px hover:scale-[1.015] hover:bg-accent-bright"
              >
                Ücretsiz Risk Değerlendirmesi
                <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/hizmetler"
                className="inline-flex items-center gap-2 rounded-sm border border-line-strong px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                Hizmetlerimiz
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <RegionRow />
          </Reveal>
        </div>

        <Reveal delay={0.2} className="relative mx-auto hidden aspect-[9/11] w-full max-w-sm lg:block">
          <div className="absolute inset-0 rounded-lg border border-line bg-surface" />
          <ColumnSectionDiagram className="relative h-full w-full p-6 text-ink/70" />
        </Reveal>
      </div>
      <GridBackdrop className="pointer-events-none absolute -right-1/4 top-0 hidden h-full w-1/2 lg:block" />
    </section>
  );
}

const STAGE_HEIGHT = "100vh";

function HeroCanvasExperience({ heroTitle, heroSubtitle }: { heroTitle: string; heroSubtitle: string }) {
  return (
    <div className="relative h-screen border-b border-line bg-graphite">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.35, 6.4], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => gl.setClearColor("#0A1424")}
      >
        <ScrollControls pages={3} damping={0.2}>
          <ColumnRig />

          <Scroll html style={{ width: "100%" }}>
            <div
              className="flex w-screen items-center"
              style={{ height: STAGE_HEIGHT, top: 0, position: "absolute" }}
            >
              <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-14">
                <div>
                  <SectionLabel index="§01" tone="dark">
                    Deprem Güçlendirme &amp; İnşaat Mühendisliği
                  </SectionLabel>
                  <h1 className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-[3.25rem]">
                    {heroTitle}
                  </h1>
                  <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60">{heroSubtitle}</p>
                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    <Link
                      href="/iletisim"
                      className="group pointer-events-auto inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white transition-all duration-[250ms] hover:-translate-y-px hover:scale-[1.015] hover:bg-accent-bright"
                    >
                      Ücretsiz Risk Değerlendirmesi
                      <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/hizmetler"
                      className="pointer-events-auto inline-flex items-center gap-2 rounded-sm border border-white/20 px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:border-accent-bright hover:text-accent-bright"
                    >
                      Hizmetlerimiz
                    </Link>
                  </div>
                  <RegionRowDark />
                </div>
              </div>
            </div>

            <div
              className="flex w-screen items-center"
              style={{ height: STAGE_HEIGHT, top: STAGE_HEIGHT, position: "absolute" }}
            >
              <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-14">
                <div className="max-w-lg lg:ml-auto lg:text-right">
                  <SectionLabel index="§02" tone="dark">
                    Süreç · Keşif &amp; Analiz
                  </SectionLabel>
                  <h2 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
                    Keşiften hesaba: sahada başlar, mühendislikte devam eder.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/55">
                    Yerinde ölçüm, malzeme testleri ve deprem risk analiziyle mevcut taşıyıcı sistemin
                    davranışını çıkarır, statik hesap raporunu buna göre kurarız.
                  </p>
                  <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-bright">
                    KESİT A—A · MEVCUT DURUM · RİSK ANALİZİ
                  </p>
                </div>
              </div>
            </div>

            <div
              className="flex w-screen items-center"
              style={{ height: STAGE_HEIGHT, top: `calc(${STAGE_HEIGHT} * 2)`, position: "absolute" }}
            >
              <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-14">
                <div className="max-w-lg">
                  <SectionLabel index="§03" tone="dark">
                    Uygulama · Güçlendirme
                  </SectionLabel>
                  <h2 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
                    CFRP sargı ve mantolama ile taşıyıcı sistem güçlenir.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/55">
                    Hesap raporuna uygun katman sayısı ve donatıyla uygulanan güçlendirme, denetimli
                    olarak raporlanır ve teslim edilir.
                  </p>
                  <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-bright">
                    CFRP SARGI · ÇOK KATLI UYGULAMA · DENETİMLİ TESLİM
                  </p>
                  <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-white/35">
                    Aşağı kaydırarak hizmetlerimizi inceleyin ↓
                  </p>
                </div>
              </div>
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}

function subscribeScenePreference(callback: () => void) {
  const mqDesktop = window.matchMedia("(min-width: 1024px)");
  const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  mqDesktop.addEventListener("change", callback);
  mqMotion.addEventListener("change", callback);
  return () => {
    mqDesktop.removeEventListener("change", callback);
    mqMotion.removeEventListener("change", callback);
  };
}

function getScenePreferenceSnapshot() {
  return (
    window.matchMedia("(min-width: 1024px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getScenePreferenceServerSnapshot() {
  return false;
}

function use3DSceneEnabled() {
  return useSyncExternalStore(
    subscribeScenePreference,
    getScenePreferenceSnapshot,
    getScenePreferenceServerSnapshot,
  );
}

export function HeroScene({ heroTitle, heroSubtitle }: { heroTitle: string; heroSubtitle: string }) {
  const ready = use3DSceneEnabled();

  if (!ready) {
    return <StaticHero heroTitle={heroTitle} heroSubtitle={heroSubtitle} />;
  }

  return <HeroCanvasExperience heroTitle={heroTitle} heroSubtitle={heroSubtitle} />;
}
