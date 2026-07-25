import Link from "next/link";
import { ContourLines } from "./diagrams";
import { Container } from "./container";
import { Reveal } from "./reveal";
import { IconArrow } from "./icons";

export function CtaBand({
  eyebrow = "Ücretsiz Risk Değerlendirmesi",
  title = "Binanızın mevcut durumunu birlikte netleştirelim.",
  description = "Yerinde inceleme ve ön değerlendirme talebiniz için bize ulaşın; mühendislerimiz 48 saat içinde dönüş yapar.",
  href = "/iletisim",
  buttonLabel = "İletişime Geç",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  buttonLabel?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-graphite py-16 md:py-24">
      <ContourLines className="absolute inset-0 h-full w-full text-white" />
      <Container className="relative">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-bright">
            {eyebrow}
          </span>
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
          <p className="text-balance text-sm leading-relaxed text-white/60 sm:text-base">
            {description}
          </p>
          <Link
            href={href}
            className="group mt-3 inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-white transition-all duration-[250ms] hover:-translate-y-px hover:scale-[1.015] hover:bg-accent-bright"
          >
            {buttonLabel}
            <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
