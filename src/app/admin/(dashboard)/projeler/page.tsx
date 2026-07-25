import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProject } from "./actions";

const REGION_LABELS: Record<string, string> = {
  MARAS: "Kahramanmaraş",
  HATAY: "Hatay",
  ADIYAMAN: "Adıyaman",
};

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Projeler</h1>
          <p className="mt-1 text-sm text-muted">
            Tamamlanan ve devam eden güçlendirme projelerini yönetin.
          </p>
        </div>
        <Link
          href="/admin/projeler/yeni"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-press"
        >
          + Yeni Proje
        </Link>
      </header>

      <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-[var(--shadow-1)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-canvas">
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-muted">
                Başlık
              </th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-muted">
                Bölge
              </th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-muted">
                Slug
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{project.title}</td>
                <td className="px-4 py-3 text-muted">
                  {REGION_LABELS[project.region] ?? project.region}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{project.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/projeler/${project.id}`}
                      className="text-sm font-medium text-accent-ink hover:underline"
                    >
                      Düzenle
                    </Link>
                    <form action={deleteProject.bind(null, project.id)}>
                      <button
                        type="submit"
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Sil
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted">
                  Henüz proje eklenmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
