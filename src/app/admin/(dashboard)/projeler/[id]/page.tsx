import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ImageUpload, GalleryUpload } from "@/components/admin/image-upload";
import { deleteProject, updateProject } from "../actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    notFound();
  }

  let gallery: string[] = [];
  try {
    const parsed = JSON.parse(project.gallery);
    if (Array.isArray(parsed)) gallery = parsed;
  } catch {
    gallery = [];
  }

  const updateProjectWithId = updateProject.bind(null, project.id);
  const deleteProjectWithId = deleteProject.bind(null, project.id);

  return (
    <div>
      <header className="mb-8">
        <Link href="/admin/projeler" className="text-sm font-medium text-accent-ink hover:underline">
          ← Projeler
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Projeyi Düzenle</h1>
      </header>

      <form action={updateProjectWithId} className="max-w-2xl space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="title" className="block text-sm font-medium text-ink">
            Başlık
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={project.title}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="slug" className="block text-sm font-medium text-ink">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              required
              defaultValue={project.slug}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 font-mono text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="region" className="block text-sm font-medium text-ink">
              Bölge
            </label>
            <select
              id="region"
              name="region"
              defaultValue={project.region}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            >
              <option value="MARAS">Kahramanmaraş</option>
              <option value="HATAY">Hatay</option>
              <option value="ADIYAMAN">Adıyaman</option>
            </select>
          </div>
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
            defaultValue={project.summary}
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
            defaultValue={project.body}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <ImageUpload name="coverImage" label="Kapak Görseli" defaultValue={project.coverImage} />
        <GalleryUpload name="gallery" label="Galeri" defaultValue={gallery} />

        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-press"
        >
          Değişiklikleri Kaydet
        </button>
      </form>

      <form action={deleteProjectWithId} className="mt-6 max-w-2xl border-t border-line pt-6">
        <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
          Bu projeyi sil
        </button>
      </form>
    </div>
  );
}
