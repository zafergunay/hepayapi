import Link from "next/link";
import { createService } from "../actions";

export default function NewServicePage() {
  return (
    <div>
      <header className="mb-8">
        <Link href="/admin/hizmetler" className="text-sm font-medium text-accent-ink hover:underline">
          ← Hizmetler
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Yeni Hizmet</h1>
      </header>

      <form action={createService} className="max-w-2xl space-y-5">
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
            placeholder="kolon-guclendirme"
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
              placeholder="column"
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
              defaultValue={0}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-press"
        >
          Hizmeti Kaydet
        </button>
      </form>
    </div>
  );
}
