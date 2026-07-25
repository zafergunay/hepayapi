import Link from "next/link";
import { ServiceIcon } from "./icons";
import { IconArrow } from "./icons";

export function ServiceCard({
  slug,
  title,
  summary,
  icon,
  index,
}: {
  slug: string;
  title: string;
  summary: string;
  icon: string;
  index: number;
}) {
  return (
    <Link
      href={`/hizmetler/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-md border border-line bg-surface p-6 shadow-[var(--shadow-1)] transition-shadow duration-300 hover:shadow-[var(--shadow-2)] sm:p-7"
    >
      <span className="absolute inset-x-0 top-0 h-px w-0 bg-accent transition-[width] duration-500 ease-out group-hover:w-full" />

      <div className="flex items-start justify-between">
        <ServiceIcon icon={icon} className="h-9 w-9 text-accent" />
        <span className="font-mono text-[11px] text-muted">{String(index).padStart(2, "0")}</span>
      </div>

      <h3 className="mt-6 font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">{summary}</p>

      <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
        İncele
        <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
