import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { ProseBody } from "@/components/site/prose-body";
import { ServiceIcon, IconArrow } from "@/components/site/icons";
import { CtaBand } from "@/components/site/cta-band";
import { DimensionRule } from "@/components/site/diagrams";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });

  if (!service) notFound();

  const otherServices = await prisma.service.findMany({
    where: { slug: { not: slug } },
    orderBy: { order: "asc" },
    take: 3,
  });

  return (
    <>
      <section className="border-b border-line py-16 md:py-24 lg:py-28">
        <Container>
          <Reveal>
            <Link
              href="/hizmetler"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
            >
              <IconArrow className="h-3.5 w-3.5 rotate-180" />
              Tüm Hizmetler
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
            <Reveal delay={0.06}>
              <div className="flex h-16 w-16 items-center justify-center rounded-md border border-line bg-surface">
                <ServiceIcon icon={service.icon} className="h-8 w-8 text-accent" />
              </div>
            </Reveal>
            <div>
              <Reveal delay={0.08}>
                <SectionLabel index="§Hizmet">Bina Güçlendirme</SectionLabel>
              </Reveal>
              <Reveal delay={0.14}>
                <h1 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                  {service.title}
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{service.summary}</p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 lg:py-28">
        <Container>
          <Reveal>
            <ProseBody text={service.body} />
          </Reveal>
        </Container>
      </section>

      {otherServices.length > 0 ? (
        <section className="border-t border-line bg-surface py-16 md:py-24">
          <Container>
            <SectionLabel index="§">Diğer Hizmetler</SectionLabel>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {otherServices.map((s) => (
                <Link
                  key={s.id}
                  href={`/hizmetler/${s.slug}`}
                  className="group flex items-center justify-between rounded-md border border-line bg-canvas p-5 transition-colors hover:border-accent"
                >
                  <span className="font-display text-sm font-semibold text-ink">{s.title}</span>
                  <IconArrow className="h-4 w-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <DimensionRule className="mx-5 sm:mx-8 lg:mx-14" />

      <CtaBand
        title={`${service.title} için ön değerlendirme talep edin.`}
        description="Bina bilgilerinizi paylaşın, mühendislerimiz uygunluğu ve sonraki adımları sizinle netleştirsin."
      />
    </>
  );
}
