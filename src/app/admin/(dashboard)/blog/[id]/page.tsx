import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ImageUpload } from "@/components/admin/image-upload";
import { deleteBlogPost, updateBlogPost } from "../actions";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  const updateBlogPostWithId = updateBlogPost.bind(null, post.id);
  const deleteBlogPostWithId = deleteBlogPost.bind(null, post.id);

  return (
    <div>
      <header className="mb-8">
        <Link href="/admin/blog" className="text-sm font-medium text-accent-ink hover:underline">
          ← Blog
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Yazıyı Düzenle</h1>
      </header>

      <form action={updateBlogPostWithId} className="max-w-2xl space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="title" className="block text-sm font-medium text-ink">
            Başlık
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={post.title}
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
            defaultValue={post.slug}
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
            defaultValue={post.excerpt}
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
            defaultValue={post.body}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <ImageUpload name="coverImage" label="Kapak Görseli" defaultValue={post.coverImage} />

        <div className="flex items-center gap-2">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={post.published}
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
              defaultValue={post.seoTitle ?? ""}
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
              defaultValue={post.seoDescription ?? ""}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
        </fieldset>

        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-press"
        >
          Değişiklikleri Kaydet
        </button>
      </form>

      <form action={deleteBlogPostWithId} className="mt-6 max-w-2xl border-t border-line pt-6">
        <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
          Bu yazıyı sil
        </button>
      </form>
    </div>
  );
}
