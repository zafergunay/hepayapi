import Link from "next/link";
import { ImageUpload } from "@/components/admin/image-upload";
import { createBlogPost } from "../actions";

export default function NewBlogPostPage() {
  return (
    <div>
      <header className="mb-8">
        <Link href="/admin/blog" className="text-sm font-medium text-accent-ink hover:underline">
          ← Blog
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Yeni Yazı</h1>
      </header>

      <form action={createBlogPost} className="max-w-2xl space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="title" className="block text-sm font-medium text-ink">
            Başlık
          </label>
          <input
            id="title"
            name="title"
            required
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
            placeholder="deprem-guclendirme-mevzuati"
            className="w-full rounded-md border border-line bg-surface px-3 py-2 font-mono text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="excerpt" className="block text-sm font-medium text-ink">
            Özet
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            required
            rows={2}
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
            rows={10}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <ImageUpload name="coverImage" label="Kapak Görseli" />

        <div className="flex items-center gap-2">
          <input
            id="published"
            name="published"
            type="checkbox"
            className="h-4 w-4 rounded border-line text-accent focus:ring-accent"
          />
          <label htmlFor="published" className="text-sm font-medium text-ink">
            Yayınla
          </label>
        </div>

        <fieldset className="space-y-4 rounded-md border border-line p-4">
          <legend className="px-1 font-mono text-xs uppercase tracking-wide text-muted">
            SEO (opsiyonel)
          </legend>
          <div className="space-y-1.5">
            <label htmlFor="seoTitle" className="block text-sm font-medium text-ink">
              SEO Başlığı
            </label>
            <input
              id="seoTitle"
              name="seoTitle"
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="seoDescription" className="block text-sm font-medium text-ink">
              SEO Açıklaması
            </label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows={2}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
        </fieldset>

        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-press"
        >
          Yazıyı Kaydet
        </button>
      </form>
    </div>
  );
}
