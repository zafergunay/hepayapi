import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { IconArrow } from "@/components/site/icons";

export const metadata: Metadata = {
  title: "Blog",
  description: "Bina güçlendirme, deprem risk analizi ve yapısal mühendislik üzerine yazılar.",
};

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <section className="border-b border-line py-16 md:py-24 lg:py-28">
        <Container>
          <Reveal>
            <SectionLabel index="§01">Blog</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-2xl font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Yapısal güçlendirme ve mühendislik üzerine notlar.
            </h1>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24 lg:py-28">
        <Container>
          {posts.length === 0 ? (
            <p className="rounded-md border border-dashed border-line-strong px-6 py-16 text-center text-sm text-muted">
              Yazılarımız yakında burada yayınlanacak.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.05}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-surface shadow-[var(--shadow-1)] transition-shadow duration-300 hover:shadow-[var(--shadow-2)]"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-graphite">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                        {formatDate(post.publishedAt)}
                      </span>
                      <h3 className="mt-3 font-display text-lg font-semibold text-ink">{post.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
                        {post.excerpt}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                        Devamını Oku
                        <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
