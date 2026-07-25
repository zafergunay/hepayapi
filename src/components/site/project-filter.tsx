"use client";

import { useMemo, useState } from "react";
import type { Region } from "@/generated/prisma/enums";
import { REGION_LABELS, REGION_ORDER } from "./regions";
import { ProjectCard } from "./project-card";

type ProjectItem = {
  slug: string;
  title: string;
  summary: string;
  region: Region;
  coverImage: string;
};

const FILTERS: { key: Region | "ALL"; label: string }[] = [
  { key: "ALL", label: "Tümü" },
  ...REGION_ORDER.map((region) => ({ key: region, label: REGION_LABELS[region] })),
];

export function ProjectFilter({ projects }: { projects: ProjectItem[] }) {
  const [active, setActive] = useState<Region | "ALL">("ALL");

  const filtered = useMemo(
    () => (active === "ALL" ? projects : projects.filter((p) => p.region === active)),
    [projects, active],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-line pb-8">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActive(filter.key)}
            className={`rounded-sm border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
              active === filter.key
                ? "border-accent bg-accent text-white"
                : "border-line-strong text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">
          Bu bölgede henüz yayınlanmış proje bulunmuyor.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
      )}
    </div>
  );
}
