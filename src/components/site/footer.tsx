import Link from "next/link";
import { Container } from "./container";
import { IconPin } from "./icons";

const REGIONS = ["Kahramanmaraş", "Hatay", "Adıyaman"];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="grid gap-12 py-16 md:py-20 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            HE<span className="text-accent">PA</span>
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Kahramanmaraş, Hatay ve Adıyaman bölgesinde deprem risk analizi, statik proje ve
            bina güçlendirme çalışmalarını mühendislik hassasiyetiyle yürütüyoruz.
          </p>
        </div>

        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Kurumsal</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/hakkimizda" className="text-ink/80 transition-colors hover:text-accent">Hakkımızda</Link></li>
            <li><Link href="/hizmetler" className="text-ink/80 transition-colors hover:text-accent">Hizmetler</Link></li>
            <li><Link href="/projeler" className="text-ink/80 transition-colors hover:text-accent">Projeler</Link></li>
            <li><Link href="/blog" className="text-ink/80 transition-colors hover:text-accent">Blog</Link></li>
            <li><Link href="/iletisim" className="text-ink/80 transition-colors hover:text-accent">İletişim</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Hizmet Bölgesi</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {REGIONS.map((region) => (
              <li key={region} className="flex items-center gap-2 text-ink/80">
                <IconPin className="h-3.5 w-3.5 shrink-0 text-accent" />
                {region}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">İletişim</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink/80">
            <li>0 (533) 000 00 00</li>
            <li>iletisim@hepa.com</li>
            <li className="max-w-[220px] leading-relaxed">
              Merkez Mah. Mühendislik Cad. No:1, Kahramanmaraş
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col items-start justify-between gap-3 py-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center">
          <span>© {year} Hepa İnşaat Mühendisliği. Tüm hakları saklıdır.</span>
          <Link href="/gizlilik-politikasi" className="transition-colors hover:text-accent">
            Gizlilik Politikası
          </Link>
        </Container>
      </div>
    </footer>
  );
}
