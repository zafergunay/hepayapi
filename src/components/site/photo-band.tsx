import Image from "next/image";
import { Container } from "./container";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";

export function PhotoBand() {
  return (
    <section className="relative h-[70vh] min-h-[420px] overflow-hidden bg-graphite">
      <Image
        src="/uploads/kolon-guclendirme.png"
        alt="Şantiyede çelik gömlekleme ve karbon fiber sargı ile kolon güçlendirme uygulaması"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/55 to-graphite/10" />

      <Container className="relative flex h-full flex-col justify-end pb-12 md:pb-16">
        <Reveal>
          <SectionLabel tone="dark">Sahada Güçlendirme</SectionLabel>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-4 max-w-xl font-display text-2xl font-semibold text-white sm:text-3xl">
            Çelik gömlekleme ve karbon fiber sargı ile taşıyıcı sistem sahada güçlenir.
          </h2>
        </Reveal>
      </Container>
    </section>
  );
}
