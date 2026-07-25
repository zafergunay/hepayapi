import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { CtaBand } from "@/components/site/cta-band";
import { ColumnSectionDiagram, DimensionRule, ProcessArrowDown } from "@/components/site/diagrams";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Hepa; Kahramanmaraş, Hatay ve Adıyaman'da deprem risk analizi, statik proje ve bina güçlendirme hizmeti veren mühendislik ekibidir.",
};

const PROCESS_STEPS = [
  {
    index: "01",
    title: "Keşif",
    text: "Binanın yerinde incelenmesi; taşıyıcı sistem, malzeme durumu ve mevcut hasarların tespiti.",
  },
  {
    index: "02",
    title: "Analiz",
    text: "Statik ve deprem performans hesapları; güçlendirme ihtiyacının teknik olarak netleştirilmesi.",
  },
  {
    index: "03",
    title: "Uygulama",
    text: "Onaylı projeye göre kolon, temel ve karbon fiber güçlendirme çalışmalarının sahada yürütülmesi.",
  },
  {
    index: "04",
    title: "Teslim",
    text: "Uygulama raporu, güncel çizimler ve garanti belgeleriyle projenin eksiksiz teslimi.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line py-16 md:py-24 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Reveal>
              <SectionLabel index="§01">Hakkımızda</SectionLabel>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 max-w-xl font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                Hesabı belli, uygulaması kayıtlı mühendislik.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-6 max-w-xl space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                <p>
                  Hepa, 6 Şubat depremlerinin ardından Kahramanmaraş, Hatay ve Adıyaman
                  bölgesinde artan yapısal güçlendirme ihtiyacına mühendislik disipliniyle
                  cevap vermek için kuruldu. İnşaat mühendisleri, statik proje ekibi ve saha
                  uygulama kadromuzla; risk tespitinden uygulamanın teslimine kadar süreci tek
                  elden yürütüyoruz.
                </p>
                <p>
                  Yaklaşımımızın merkezinde ölçülebilirlik var: her karar bir hesap raporuna,
                  her uygulama bir çizime dayanır. Bina sahipleriyle teknik dili
                  sadeleştirerek konuşur, süreci adım adım belgeleriz.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="relative mx-auto hidden aspect-[9/11] w-full max-w-sm lg:block">
            <div className="absolute inset-0 rounded-lg border border-line bg-surface" />
            <ColumnSectionDiagram className="relative h-full w-full p-6 text-ink/70" />
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24 lg:py-28">
        <Container>
          <Reveal>
            <SectionLabel index="§02">Yaklaşımımız</SectionLabel>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Mühendislik Önce",
                text: "Her öneri; saha ölçümü ve hesap raporu ile desteklenir. Görsel değerlendirme değil, mühendislik değerlendirmesi yaparız.",
              },
              {
                title: "Açık İletişim",
                text: "Süreç boyunca teknik rapor ve fotoğraflarla ilerleme paylaşılır; bina sahibi her aşamada bilgilendirilir.",
              },
              {
                title: "Uzun Vadeli Sorumluluk",
                text: "Teslim sonrası da uygulamanın arkasında dururuz; garanti kapsamı ve bakım önerileri yazılı olarak sunulur.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06} className="border-t border-line pt-6">
                <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-16 md:py-24 lg:py-28">
        <Container>
          <Reveal>
            <SectionLabel index="§03">Sürecimiz</SectionLabel>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-4 max-w-xl font-display text-2xl font-semibold text-ink sm:text-3xl">
              Dört adımda keşiften teslime.
            </h2>
          </Reveal>

          <div className="mt-12 flex flex-col md:flex-row md:items-stretch">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.index} className="flex flex-1 flex-col md:flex-row md:items-center">
                <Reveal delay={i * 0.08} className="flex-1 rounded-md border border-line bg-canvas p-6">
                  <span className="font-mono text-[11px] text-accent">{step.index}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                </Reveal>
                {i < PROCESS_STEPS.length - 1 ? (
                  <div className="flex items-center justify-center py-2 md:rotate-[-90deg] md:px-2 md:py-0">
                    <ProcessArrowDown className="h-8 w-6 text-line-strong" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <DimensionRule className="mx-5 sm:mx-8 lg:mx-14" />

      <CtaBand
        eyebrow="Ekibimizle Tanışın"
        title="Projenizi konuşmak için bir görüşme planlayalım."
        description="İster mevcut bir binanın değerlendirmesi, ister yeni bir yapı için statik proje — ihtiyacınızı birlikte netleştirelim."
      />
    </>
  );
}
