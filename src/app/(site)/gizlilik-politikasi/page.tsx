import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { SectionLabel } from "@/components/site/section-label";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Hepa kişisel verilerin korunması ve gizlilik politikası.",
};

const SECTIONS = [
  {
    title: "1. Veri Sorumlusu",
    body: "İşbu Gizlilik Politikası, Hepa İnşaat Mühendisliği ('Hepa', 'biz') tarafından hepa.com internet sitesi ('Site') üzerinden toplanan kişisel verilerin işlenmesine ilişkin usul ve esasları açıklamak amacıyla hazırlanmıştır.",
  },
  {
    title: "2. Toplanan Veriler",
    body: "İletişim formunu doldurduğunuzda ad-soyad, e-posta adresi, telefon numarası (isteğe bağlı) ve mesaj içeriğiniz tarafımızca işlenir. Siteyi ziyaretiniz sırasında, hizmet kalitesini iyileştirmek amacıyla standart teknik günlük kayıtları (log) tutulabilir.",
  },
  {
    title: "3. Verilerin İşlenme Amacı",
    body: "Toplanan kişisel veriler; talebinizi değerlendirmek, tarafınıza dönüş yapmak, ön keşif ve teklif süreçlerini yürütmek ve yasal yükümlülüklerimizi yerine getirmek amacıyla işlenir. Verileriniz, açık rızanız olmaksızın pazarlama amacıyla üçüncü taraflarla paylaşılmaz.",
  },
  {
    title: "4. Verilerin Saklanma Süresi",
    body: "Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen zamanaşımı süreleri saklı kalmak kaydıyla saklanır; bu sürenin sonunda silinir, yok edilir veya anonim hale getirilir.",
  },
  {
    title: "5. Veri Sahibinin Hakları",
    body: "6698 sayılı Kişisel Verilerin Korunması Kanunu ('KVKK') kapsamında; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, düzeltilmesini veya silinmesini isteme haklarına sahipsiniz. Taleplerinizi iletişim sayfamızda yer alan e-posta adresi üzerinden bize iletebilirsiniz.",
  },
  {
    title: "6. Veri Güvenliği",
    body: "Kişisel verilerinizin güvenliğini sağlamak amacıyla makul teknik ve idari tedbirler alınmaktadır. Buna rağmen internet üzerinden veri iletiminin veya elektronik ortamda saklamanın %100 güvenli olmadığını hatırlatmak isteriz.",
  },
  {
    title: "7. Değişiklikler",
    body: "Bu Gizlilik Politikası zaman zaman güncellenebilir. Güncel metin her zaman bu sayfada yayınlanacaktır.",
  },
];

export default function PrivacyPage() {
  return (
    <section className="py-16 md:py-24 lg:py-28">
      <Container>
        <Reveal>
          <SectionLabel index="§KVKK">Gizlilik Politikası</SectionLabel>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-6 max-w-xl font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Gizlilik ve Kişisel Verilerin Korunması Politikası
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Bu metin bilgilendirme amaçlı bir taslaktır; hukuki danışmanlık yerine geçmez.
          </p>
        </Reveal>

        <div className="mt-12 max-w-2xl space-y-10 border-t border-line pt-10">
          {SECTIONS.map((section, i) => (
            <Reveal key={section.title} delay={i * 0.04}>
              <h2 className="font-display text-lg font-semibold text-ink">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{section.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
