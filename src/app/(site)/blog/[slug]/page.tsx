import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { ProseBody } from "@/components/site/prose-body";
import { IconArrow } from "@/components/site/icons";
import { CtaBand } from "@/components/site/cta-band";

type Props = { params: Promise<{ slug: string }> };

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.published) notFound();

  return (
    <>
      <section className="border-b border-line py-16 md:py-20">
        <Container>
        <div className="max-w-2xl">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
            >
              <IconArrow className="h-3.5 w-3.5 rotate-180" />
              Tüm Yazılar
            </Link>
          </Reveal>
          <Reveal delay={0.06}>
            <span className="mt-6 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {formatDate(post.publishedAt)}
            </span>
          </Reveal>
          <Reveal delay={0.12}>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {post.title}
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-5 text-base leading-relaxed text-muted">{post.excerpt}</p>
          </Reveal>
        </div>
        </Container>
      </section>

      {post.coverImage ? (
        <Reveal>
          <div className="relative aspect-[16/9] w-full border-b border-line bg-graphite sm:aspect-[21/9]">
            <Image src={post.coverImage} alt={post.title} fill unoptimized className="object-cover" priority />
          </div>
        </Reveal>
      ) : null}

      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <ProseBody text={post.body} />
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
