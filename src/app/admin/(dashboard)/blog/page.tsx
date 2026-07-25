import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBlogPost } from "./actions";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Blog</h1>
          <p className="mt-1 text-sm text-muted">Yazıları yönetin ve yayına alın.</p>
        </div>
        <Link
          href="/admin/blog/yeni"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-press"
        >
          + Yeni Yazı
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
                Durum
              </th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-muted">
                Slug
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{post.title}</td>
                <td className="px-4 py-3">
                  {post.published ? (
                    <span className="rounded-full bg-accent-wash px-2.5 py-1 font-mono text-xs text-accent-ink">
                      Yayında
                    </span>
                  ) : (
                    <span className="rounded-full bg-canvas px-2.5 py-1 font-mono text-xs text-muted">
                      Taslak
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{post.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="text-sm font-medium text-accent-ink hover:underline"
                    >
                      Düzenle
                    </Link>
                    <form action={deleteBlogPost.bind(null, post.id)}>
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
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted">
                  Henüz yazı eklenmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
