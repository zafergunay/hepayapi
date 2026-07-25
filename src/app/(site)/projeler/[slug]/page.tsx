import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { ProseBody } from "@/components/site/prose-body";
import { IconArrow } from "@/components/site/icons";
import { CtaBand } from "@/components/site/cta-band";
import { REGION_LABELS } from "@/components/site/regions";

type Props = { params: Promise<{ slug: string }> };

function parseGallery(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === "string");
    return [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project) notFound();

  const gallery = parseGallery(project.gallery);

  return (
    <>
      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <Reveal>
            <Link
              href="/projeler"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
            >
              <IconArrow className="h-3.5 w-3.5 rotate-180" />
              Tüm Projeler
            </Link>
          </Reveal>
          <Reveal delay={0.06}>
            <SectionLabel index={REGION_LABELS[project.region]}>Tamamlanan Proje</SectionLabel>
          </Reveal>
          <Reveal delay={0.12}>
            <h1 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{project.summary}</p>
          </Reveal>
        </Container>
      </section>

      {project.coverImage ? (
        <Reveal>
          <div className="relative aspect-[16/9] w-full border-b border-line bg-graphite sm:aspect-[21/9]">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>
        </Reveal>
      ) : null}

      <section className="py-16 md:py-24 lg:py-28">
        <Container>
          <Reveal>
            <ProseBody text={project.body} />
          </Reveal>

          {gallery.length > 0 ? (
            <div className="mt-16">
              <SectionLabel index="§">Uygulama Görselleri</SectionLabel>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((src, i) => (
                  <Reveal key={src + i} delay={i * 0.05} className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-graphite">
                    <Image
                      src={src}
                      alt={`${project.title} — görsel ${i + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      <CtaBand
        title="Benzer bir çalışmayı sizin binanız için de planlayalım."
        description="Proje detaylarını, bölgenizi ve bina özelliklerinizi paylaşın; uygunluğu birlikte değerlendirelim."
      />
    </>
  );
}
