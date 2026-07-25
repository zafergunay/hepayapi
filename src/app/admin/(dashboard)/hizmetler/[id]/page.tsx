import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteService, updateService } from "../actions";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) {
    notFound();
  }

  const updateServiceWithId = updateService.bind(null, service.id);
  const deleteServiceWithId = deleteService.bind(null, service.id);

  return (
    <div>
      <header className="mb-8">
        <Link href="/admin/hizmetler" className="text-sm font-medium text-accent-ink hover:underline">
          ← Hizmetler
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Hizmeti Düzenle</h1>
      </header>

      <form action={updateServiceWithId} className="max-w-2xl space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="title" className="block text-sm font-medium text-ink">
            Başlık
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={service.title}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="slug" className="block text-sm font-medium text-ink">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            required
            defaultValue={service.slug}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 font-mono text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="summary" className="block text-sm font-medium text-ink">
            Özet
          </label>
          <textarea
            id="summary"
            name="summary"
            required
            rows={2}
            defaultValue={service.summary}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="body" className="block text-sm font-medium text-ink">
            İçerik
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={8}
            defaultValue={service.body}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="icon" className="block text-sm font-medium text-ink">
              İkon
            </label>
            <input
              id="icon"
              name="icon"
              required
              defaultValue={service.icon}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 font-mono text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="order" className="block text-sm font-medium text-ink">
              Sıra
            </label>
            <input
              id="order"
              name="order"
              type="number"
              defaultValue={service.order}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-press"
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>

      <form action={deleteServiceWithId} className="mt-6 max-w-2xl border-t border-line pt-6">
        <button
          type="submit"
          className="text-sm font-medium text-red-600 hover:underline"
        >
          Bu hizmeti sil
        </button>
      </form>
    </div>
  );
}
