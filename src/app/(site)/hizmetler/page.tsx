import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { ServiceCard } from "@/components/site/service-card";
import { CtaBand } from "@/components/site/cta-band";

export const metadata: Metadata = {
  title: "Hizmetler",
  description:
    "Deprem risk analizi, statik proje, kolon güçlendirme, karbon fiber güçlendirme ve temel güçlendirme hizmetlerimiz.",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <section className="border-b border-line py-16 md:py-24 lg:py-28">
        <Container>
          <Reveal>
            <SectionLabel index="§01">Hizmetlerimiz</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-2xl font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Risk analizinden uygulamaya, yapısal güçlendirmenin tüm aşamaları.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              Her hizmet; saha incelemesi, mühendislik hesabı ve uygulama takibiyle birlikte
              yürütülür. Aşağıdan detayına göz atabilirsiniz.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24 lg:py-28">
        <Container>
          {services.length === 0 ? (
            <p className="rounded-md border border-dashed border-line-strong px-6 py-16 text-center text-sm text-muted">
              Hizmet içerikleri yakında burada listelenecek.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
