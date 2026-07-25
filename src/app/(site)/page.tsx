import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { ServiceCard } from "@/components/site/service-card";
import { ProjectCard } from "@/components/site/project-card";
import { CtaBand } from "@/components/site/cta-band";
import { DimensionRule } from "@/components/site/diagrams";
import { IconArrow } from "@/components/site/icons";
import { HeroFilm } from "@/components/site/hero-film";
import { Anatomy3D } from "@/components/site/anatomy-3d";
import { PhotoBand } from "@/components/site/photo-band";
import { REGION_LABELS, REGION_ORDER } from "@/components/site/regions";

const WHY_POINTS = [
  {
    index: "01",
    title: "Mühendislik Hassasiyeti",
    text: "Her proje; saha ölçümü, hesap raporu ve uygulama detayıyla belgelenir. Tahmine değil, hesaba dayanırız.",
  },
  {
    index: "02",
    title: "Şeffaf Süreç",
    text: "Keşiften teslime kadar her aşamayı raporlar ve çizimlerle paylaşırız; sürpriz maliyet ve belirsizlik bırakmayız.",
  },
  {
    index: "03",
    title: "Mevzuat Uyumu",
    text: "Deprem yönetmeliği ve ilgili teknik şartnamelere tam uyumlu statik proje ve uygulama süreci yürütürüz.",
  },
  {
    index: "04",
    title: "Bölgesel Deneyim",
    text: "Kahramanmaraş, Hatay ve Adıyaman'ın zemin ve yapı stoku özelliklerini yakından tanıyan bir saha ekibiyiz.",
  },
];

const REGION_NOTES: Record<string, { coord: string; note: string }> = {
  MARAS: { coord: "37.57° K 36.92° D", note: "Merkez ofis · saha ekibi ve keşif randevuları" },
  HATAY: { coord: "36.20° K 36.16° D", note: "Bölge saha ofisi · uygulama ve denetim" },
  ADIYAMAN: { coord: "37.76° K 38.28° D", note: "Periyodik saha ziyaretleri · proje bazlı ekip" },
};

export default async function HomePage() {
  const [settings, services, projects] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.service.findMany({ orderBy: { order: "asc" }, take: 6 }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const heroTitle =
    settings?.heroTitle ?? "Binanızın taşıyıcı sistemini hesapla, belgeyle güçlendiriyoruz.";
  const heroSubtitle =
    settings?.heroSubtitle ??
    "Kahramanmaraş, Hatay ve Adıyaman'da deprem risk analizi, statik proje ve uygulamalı bina güçlendirme hizmeti veriyoruz.";

  return (
    <>
      {/* HERO */}
      <HeroFilm heroTitle={heroTitle} heroSubtitle={heroSubtitle} />

      {/* SERVICES */}
      <section className="py-16 md:py-24 lg:py-28">
        <Container>
          <Reveal>
            <SectionLabel index="§02">Hizmetlerimiz</SectionLabel>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-xl font-display text-2xl font-semibold text-ink sm:text-3xl">
              Analizden uygulamaya, tek elden yapısal güçlendirme.
            </h2>
          </Reveal>

          {services.length === 0 ? (
            <p className="mt-12 rounded-md border border-dashed border-line-strong px-6 py-14 text-center text-sm text-muted">
              Hizmet içerikleri yakında burada listelenecek.
            </p>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <Reveal key={service.id} delay={i * 0.05}>
                  <ServiceCard
                    slug={service.slug}
                    title={service.title}
                    summary={service.summary}
                    icon={service.icon}
                    index={i + 1}
                  />
                </Reveal>
              ))}
            </div>
          )}

          <Reveal delay={0.1}>
            <div className="mt-10">
              <Link
                href="/hizmetler"
                className="group inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.14em] text-accent"
              >
                Tüm hizmetleri gör
                <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* GÜÇLENDİRME ANATOMİSİ — interactive 3D */}
      <Anatomy3D />

      {/* WHY US */}
      <section className="border-b border-line bg-surface py-16 md:py-24 lg:py-28">
        <Container>
          <Reveal>
            <SectionLabel index="§04">Neden Hepa</SectionLabel>
          </Reveal>
          <div className="mt-10 grid gap-x-10 gap-y-10 lg:grid-cols-2">
            {WHY_POINTS.map((point, i) => (
              <Reveal key={point.index} delay={i * 0.06}>
                <div className="flex gap-5 border-t border-line pt-6">
                  <span className="font-mono text-sm text-accent">{point.index}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{point.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{point.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* REGIONS */}
      <section className="py-16 md:py-24 lg:py-28">
        <Container>
          <Reveal>
            <SectionLabel index="§05">Hizmet Bölgesi</SectionLabel>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-xl font-display text-2xl font-semibold text-ink sm:text-3xl">
              Deprem bölgesinde, sahaya yakın çalışıyoruz.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
            {REGION_ORDER.map((region, i) => (
              <Reveal key={region} delay={i * 0.08} className="bg-surface p-8">
                <span className="font-mono text-[11px] tracking-[0.1em] text-muted">
                  {REGION_NOTES[region].coord}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                  {REGION_LABELS[region]}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {REGION_NOTES[region].note}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <PhotoBand />

      {/* FEATURED PROJECTS */}
      <section className="bg-surface py-16 md:py-24 lg:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal>
                <SectionLabel index="§06">Öne Çıkan Projeler</SectionLabel>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="mt-4 max-w-xl font-display text-2xl font-semibold text-ink sm:text-3xl">
                  Tamamlanan güçlendirme ve inşaat çalışmalarından örnekler.
                </h2>
              </Reveal>
            </div>
          </div>

          {projects.length === 0 ? (
            <p className="mt-12 rounded-md border border-dashed border-line-strong px-6 py-14 text-center text-sm text-muted">
              Proje kayıtları yakında burada yer alacak.
            </p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.06}>
                  <ProjectCard
                    slug={project.slug}
                    title={project.title}
                    summary={project.summary}
                    region={project.region}
                    coverImage={project.coverImage}
                  />
                </Reveal>
              ))}
            </div>
          )}

          <Reveal delay={0.1}>
            <div className="mt-10">
              <Link
                href="/projeler"
                className="group inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.14em] text-accent"
              >
                Tüm projeleri gör
                <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <DimensionRule className="mx-5 sm:mx-8 lg:mx-14" />

      <CtaBand />
    </>
  );
}
