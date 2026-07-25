import { prisma } from "@/lib/prisma";
import { updateSiteSettings } from "./actions";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Site Ayarları</h1>
        <p className="mt-1 text-sm text-muted">
          Ana sayfa metinleri, iletişim bilgileri ve SEO ayarları.
        </p>
      </header>

      <form action={updateSiteSettings} className="max-w-2xl space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="heroTitle" className="block text-sm font-medium text-ink">
            Ana Başlık (Hero)
          </label>
          <input
            id="heroTitle"
            name="heroTitle"
            required
            defaultValue={settings?.heroTitle ?? ""}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="heroSubtitle" className="block text-sm font-medium text-ink">
            Alt Başlık (Hero)
          </label>
          <textarea
            id="heroSubtitle"
            name="heroSubtitle"
            required
            rows={2}
            defaultValue={settings?.heroSubtitle ?? ""}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-sm font-medium text-ink">
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              required
              defaultValue={settings?.phone ?? ""}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={settings?.email ?? ""}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="address" className="block text-sm font-medium text-ink">
            Adres
          </label>
          <input
            id="address"
            name="address"
            required
            defaultValue={settings?.address ?? ""}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <fieldset className="space-y-4 rounded-md border border-line p-4">
          <legend className="px-1 font-mono text-xs uppercase tracking-wide text-muted">
            SEO
          </legend>
          <div className="space-y-1.5">
            <label htmlFor="seoTitle" className="block text-sm font-medium text-ink">
              SEO Başlığı
            </label>
            <input
              id="seoTitle"
              name="seoTitle"
              required
              defaultValue={settings?.seoTitle ?? ""}
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
              required
              rows={2}
              defaultValue={settings?.seoDescription ?? ""}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
        </fieldset>

        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-press"
        >
          Ayarları Kaydet
        </button>
      </form>
    </div>
  );
}
