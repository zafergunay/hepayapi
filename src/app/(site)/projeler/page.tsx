import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { ProjectFilter } from "@/components/site/project-filter";
import { CtaBand } from "@/components/site/cta-band";

export const metadata: Metadata = {
  title: "Projeler",
  description:
    "Kahramanmaraş, Hatay ve Adıyaman'da tamamladığımız bina güçlendirme ve inşaat projeleri.",
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <section className="border-b border-line py-16 md:py-24 lg:py-28">
        <Container>
          <Reveal>
            <SectionLabel index="§01">Projeler</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-2xl font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Bölgede tamamladığımız güçlendirme ve inşaat çalışmaları.
            </h1>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24 lg:py-28">
        <Container>
          {projects.length === 0 ? (
            <p className="rounded-md border border-dashed border-line-strong px-6 py-16 text-center text-sm text-muted">
              Proje kayıtları yakında burada listelenecek.
            </p>
          ) : (
            <ProjectFilter
              projects={projects.map((p) => ({
                slug: p.slug,
                title: p.title,
                summary: p.summary,
                region: p.region,
                coverImage: p.coverImage,
              }))}
            />
          )}
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
