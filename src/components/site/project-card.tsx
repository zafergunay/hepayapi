import Image from "next/image";
import Link from "next/link";
import type { Region } from "@/generated/prisma/enums";
import { REGION_LABELS } from "./regions";
import { IconArrow } from "./icons";

export function ProjectCard({
  slug,
  title,
  summary,
  region,
  coverImage,
}: {
  slug: string;
  title: string;
  summary: string;
  region: Region;
  coverImage: string;
}) {
  return (
    <Link
      href={`/projeler/${slug}`}
      className="group flex flex-col overflow-hidden rounded-md border border-line bg-surface shadow-[var(--shadow-1)] transition-shadow duration-300 hover:shadow-[var(--shadow-2)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-line bg-graphite">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-sm border border-white/20 bg-graphite/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur">
          {REGION_LABELS[region]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-2">{summary}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
          Projeyi Gör
          <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
