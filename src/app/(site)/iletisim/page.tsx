import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { ContactForm } from "@/components/site/contact-form";
import { IconPin } from "@/components/site/icons";
import { REGION_LABELS, REGION_ORDER } from "@/components/site/regions";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Ücretsiz risk değerlendirmesi talebi ve iletişim bilgileri.",
};

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });

  const phone = settings?.phone || "0 (533) 000 00 00";
  const email = settings?.email || "iletisim@hepa.com";
  const address = settings?.address || "Merkez Mah. Mühendislik Cad. No:1, Kahramanmaraş";

  return (
    <section className="py-16 md:py-24 lg:py-28">
      <Container>
        <Reveal>
          <SectionLabel index="§01">İletişim</SectionLabel>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 max-w-xl font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Ücretsiz risk değerlendirmesi için bize ulaşın.
          </h1>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            Bina bilgilerinizi ve talebinizi kısaca paylaşın; mühendislerimiz genellikle 48
            saat içinde sizinle iletişime geçer.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-10">
            <Reveal>
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Telefon</h3>
                <p className="mt-2 font-display text-lg font-semibold text-ink">{phone}</p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">E-posta</h3>
                <p className="mt-2 font-display text-lg font-semibold text-ink">{email}</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Ofis</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink/80">{address}</p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  Hizmet Bölgesi
                </h3>
                <ul className="mt-3 space-y-2">
                  {REGION_ORDER.map((region) => (
                    <li key={region} className="flex items-center gap-2 text-sm text-ink/80">
                      <IconPin className="h-3.5 w-3.5 text-accent" />
                      {REGION_LABELS[region]}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="rounded-md border border-line bg-surface p-6 shadow-[var(--shadow-1)] sm:p-8">
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
