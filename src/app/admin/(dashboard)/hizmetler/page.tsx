import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteService } from "./actions";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Hizmetler</h1>
          <p className="mt-1 text-sm text-muted">
            Güçlendirme ve mühendislik hizmetlerini yönetin.
          </p>
        </div>
        <Link
          href="/admin/hizmetler/yeni"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-press"
        >
          + Yeni Hizmet
        </Link>
      </header>

      <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-[var(--shadow-1)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-canvas">
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-muted">
                Sıra
              </th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-muted">
                Başlık
              </th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-muted">
                Slug
              </th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-muted">
                İkon
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-muted">{service.order}</td>
                <td className="px-4 py-3 font-medium text-ink">{service.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{service.slug}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{service.icon}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/hizmetler/${service.id}`}
                      className="text-sm font-medium text-accent-ink hover:underline"
                    >
                      Düzenle
                    </Link>
                    <form action={deleteService.bind(null, service.id)}>
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
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted">
                  Henüz hizmet eklenmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
