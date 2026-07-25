import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Region } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

const prisma = new PrismaClient({ adapter });

// Admin giriş bilgileri (yalnızca geliştirme/ilk kurulum içindir — üretimde değiştirin):
//   Kullanıcı adı : admin
//   Şifre         : zaferg
const ADMIN_EMAIL = "admin";
const ADMIN_PASSWORD = "zaferg";

async function seedAdminUser() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash, name: "Yönetici" },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: "Yönetici",
    },
  });

  console.log(`✓ Admin kullanıcı hazır: ${ADMIN_EMAIL}`);
}

async function seedServices() {
  const services = [
    {
      slug: "kolon-guclendirme",
      title: "Kolon Güçlendirme",
      icon: "column",
      order: 1,
      summary:
        "Taşıyıcı kolonların betonarme mantolama ve çelik gömlekleme yöntemleriyle deprem yüklerine karşı dayanımının artırılması.",
      body: `Mevcut binalarda taşıyıcı sistemin en kritik elemanları kolonlardır; yetersiz enine donatı, düşük beton dayanımı veya yetersiz kesit, kolonların deprem sırasında gevrek göçme yapmasına yol açabilir. Kolon güçlendirmede en yaygın uyguladığımız yöntem betonarme mantolama olup, mevcut kolon çevresine ek donatı ve beton kesiti eklenerek hem eksenel yük taşıma kapasitesi hem de süneklik artırılır.

Zemin katlarda yükseklik veya mimari kısıt olan projelerde çelik gömlekleme veya karbon fiber sargı gibi alternatif yöntemleri tercih ediyoruz; bu sayede kesit kalınlığını neredeyse hiç artırmadan etkin bir güçlendirme sağlanabiliyor. Her proje öncesinde karot numuneleri ile mevcut beton dayanımı belirlenir, donatı tespiti sıyırma veya paskometre ile yapılır ve sonuçlar statik hesaba girdi olarak kullanılır.

Uygulama sürecinde bina sakinlerinin günlük yaşamını en az düzeyde etkileyecek şekilde kat kat, ilerleyen bir iş programı uyguluyor; her aşamada TBDY 2018 yönetmeliğine uygun kalite kontrol raporları düzenliyoruz.`,
    },
    {
      slug: "temel-guclendirme",
      title: "Temel Güçlendirme",
      icon: "foundation",
      order: 2,
      summary:
        "Yetersiz temel derinliği, zemin taşıma gücü sorunları veya ek yük durumlarında temel sisteminin mikrokazık ve enjeksiyon yöntemleriyle takviyesi.",
      body: `Bina güçlendirme çalışmalarının çoğu zaman göz ardı edilen ama en az kolon güçlendirme kadar kritik bir bileşeni temel sistemidir. Üst yapıda yapılan güçlendirme, artan yükleri karşılayamayan bir temel üzerine oturuyorsa beklenen performans artışı sağlanamaz. Zemin etüdü ve mevcut temel tipi (tekil, sürekli veya radye) belirlendikten sonra, ihtiyaca göre mikrokazık, enjeksiyon (jet-grout) veya temel genişletme çözümlerinden uygun olanı öneriyoruz.

Kahramanmaraş ve Adıyaman bölgesindeki zemin koşullarının çeşitliliği nedeniyle her proje için ayrı zemin etüdü raporu talep ediyor, sıvılaşma riski bulunan parsellerde ek jeoteknik önlemler tanımlıyoruz. Mikrokazık uygulamalarında mevcut temel altına açılan kazıklar enjeksiyon harcı ile zemine bağlanır ve yeni yük aktarım başlıkları ile üst yapıya entegre edilir.

Temel güçlendirme çalışmaları genellikle diğer güçlendirme kalemleriyle eş zamanlı planlanır; böylece hem maliyet hem de bina kullanım süresi açısından en verimli iş programı oluşturulur.`,
    },
    {
      slug: "karbon-fiber-guclendirme",
      title: "Karbon Fiber Güçlendirme",
      icon: "carbon-fiber",
      order: 3,
      summary:
        "Kesit kalınlığını artırmadan, yüksek çekme dayanımlı karbon fiber kumaş ve lamine sistemlerle hızlı ve düşük ağırlıklı taşıyıcı eleman takviyesi.",
      body: `Karbon fiber takviyeli polimer (CFRP) sistemler, özellikle mimari kısıtların yüksek olduğu veya bina kullanımının kesintiye uğratılmak istenmediği projelerde tercih ettiğimiz bir güçlendirme yöntemidir. Kolon, kiriş ve döşeme gibi elemanlara epoksi esaslı yapıştırıcı ile uygulanan karbon fiber kumaşlar, mevcut kesite neredeyse hiç ağırlık ve kalınlık eklemeden eğilme ve kesme kapasitesini önemli ölçüde artırır.

Yöntemin en büyük avantajı uygulama hızıdır; ıslak yöntemle uygulanan mantolamaya kıyasla kürlenme süresi beklenmeden birkaç gün içinde yapı kullanıma açılabilir. Ancak karbon fiber sargı süneklik artışı sağlasa da eksenel yük kapasitesini betonarme mantolama kadar artıramadığından, hangi elemanda hangi yöntemin uygulanacağına statik hesap sonuçlarına göre proje bazında karar veriyoruz.

Uygulama öncesinde yüzey hazırlığı (kum püskürtme, köşe yuvarlatma) titizlikle yapılır, malzeme yapışma testleri raporlanır ve her uygulama TS EN 1504 standartlarına uygun şekilde belgelenir.`,
    },
    {
      slug: "deprem-risk-analizi-statik-proje",
      title: "Deprem Risk Analizi ve Statik Proje",
      icon: "seismic-analysis",
      order: 4,
      summary:
        "Binanın mevcut durum tespiti, performans analizi ve TBDY 2018 yönetmeliğine uygun güçlendirme statik projesinin hazırlanması.",
      body: `Herhangi bir güçlendirme kararı almadan önce binanın gerçek durumunu bilmek gerekir. Deprem risk analizi sürecimiz; rölöve çalışması, karot numuneleri ile beton dayanımı tespiti, donatı taraması ve zemin etüdü verilerinin bir araya getirilmesiyle başlar. Bu veriler bilgisayar destekli statik analiz yazılımlarına aktarılarak binanın doğrusal veya doğrusal olmayan performans analizi yapılır.

Analiz sonucunda binanın mevcut deprem performans düzeyi (göçme öncesi, can güvenliği, kesintisiz kullanım) belirlenir ve TBDY 2018 kapsamında hedeflenen performans düzeyine ulaşmak için gereken güçlendirme kalemleri (kolon, kiriş, temel, perde ekleme vb.) netleştirilir. Rapor, bina sahiplerinin hem teknik hem de ekonomik açıdan doğru karar verebilmesi için farklı güçlendirme senaryolarının maliyet ve süre karşılaştırmasını da içerir.

Onaylanan senaryo doğrultusunda hazırlanan statik proje, ilgili belediye ve yapı denetim kuruluşlarına sunulacak şekilde mühendislik hesap raporları, çizimler ve metrajlarla birlikte teslim edilir.`,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  console.log(`✓ ${services.length} hizmet eklendi.`);
}

async function seedProjects() {
  const projects = [
    {
      slug: "maras-onikisubat-konut-blogu-guclendirme",
      title: "Onikişubat Konut Bloğu Güçlendirme",
      region: Region.MARAS,
      summary:
        "5 katlı betonarme konut bloğunda kolon mantolama ve temel takviyesi ile can güvenliği performans düzeyine yükseltme çalışması.",
      body: `Kahramanmaraş Onikişubat ilçesinde bulunan 1998 yapımı 5 katlı konut bloğunda yapılan deprem risk analizi sonucunda binanın mevcut performans düzeyinin yetersiz olduğu belirlenmiştir. Karot ve donatı tespiti sonrasında hazırlanan statik projeye göre toplam 22 kolonda betonarme mantolama, zemin katta ise iki aks boyunca perde duvar eklenmesi uygulanmıştır.

Temel sisteminin artan yükleri karşılayabilmesi için mevcut sürekli temeller mikrokazık ile takviye edilmiş, uygulama süresince bina sakinlerinin geçici olarak tahliyesi 6 haftalık bir program dahilinde tamamlanmıştır. Proje sonunda binanın hedeflenen can güvenliği performans düzeyine ulaştığı doğrulama analizleriyle teyit edilmiştir.`,
      coverImage: "/uploads/placeholder-1.svg",
      gallery: JSON.stringify(["/uploads/placeholder-1.svg", "/uploads/placeholder-2.svg"]),
    },
    {
      slug: "maras-dulkadiroglu-ticari-bina-guclendirme",
      title: "Dulkadiroğlu Ticari Bina Güçlendirme",
      region: Region.MARAS,
      summary:
        "Zemin katı çarşı olarak kullanılan 4 katlı ticari binada karbon fiber sargı ve çelik gömlekleme ile hızlı güçlendirme uygulaması.",
      body: `Zemin katında dükkanların bulunduğu ve kesintisiz işletme ihtiyacı olan bu ticari binada, geleneksel mantolama yönteminin uygulama süresi işletmeler için kabul edilemez bulunmuştur. Bunun üzerine statik projede belirlenen 14 kolonda karbon fiber sargı, yüksek eksenel yük taşıyan 4 köşe kolonunda ise çelik gömlekleme yöntemi tercih edilmiştir.

Uygulama, dükkanların mesai saatleri dışında gece çalışmasıyla yürütülmüş, toplam süreç 3 hafta içinde tamamlanmıştır. Karbon fiber uygulaması öncesinde yüzey hazırlığı ve yapışma testleri titizlikle belgelenmiş, proje TBDY 2018 kapsamında öngörülen can güvenliği performans hedefine ulaşmıştır.`,
      coverImage: "/uploads/placeholder-2.svg",
      gallery: JSON.stringify(["/uploads/placeholder-2.svg"]),
    },
    {
      slug: "hatay-antakya-apartman-guclendirme",
      title: "Antakya Apartmanı Güçlendirme",
      region: Region.HATAY,
      summary:
        "6 Şubat depremlerinde hafif hasar tespit edilen 6 katlı apartmanda kapsamlı kolon ve kiriş güçlendirmesi ile temel takviyesi.",
      body: `Hatay Antakya'da 6 Şubat 2023 depremlerinin ardından hasar tespit çalışması kapsamında hafif hasarlı olarak sınıflandırılan bu 6 katlı apartmanda, deprem sonrası yeniden değerlendirme talebi üzerine detaylı statik analiz gerçekleştirilmiştir. Analiz, binanın hasarlı elemanlarının onarımı yanında sistemin genel olarak da güçlendirilmesi gerektiğini ortaya koymuştur.

Toplam 30 kolonda betonarme mantolama, hasarlı kirişlerde epoksi enjeksiyonu ile onarım ve karbon fiber takviye, temel sisteminde ise jet-grout enjeksiyon yöntemiyle zemin iyileştirmesi uygulanmıştır. Proje, bölgedeki artçı deprem riski göz önünde bulundurularak öncelikli iş programına alınmış ve 10 haftada tamamlanmıştır.`,
      coverImage: "/uploads/placeholder-3.svg",
      gallery: JSON.stringify(["/uploads/placeholder-3.svg", "/uploads/placeholder-4.svg"]),
    },
    {
      slug: "hatay-defne-okul-binasi-guclendirme",
      title: "Defne Okul Binası Güçlendirme",
      region: Region.HATAY,
      summary:
        "İlkokul binasında öğrenci güvenliğini önceliklendiren, yaz tatili döneminde tamamlanan hızlandırılmış güçlendirme programı.",
      body: `Hatay Defne ilçesindeki 3 katlı ilkokul binasında yapılan deprem risk analizinde, bina kullanım amacının kesintisiz kullanım performans düzeyini gerektirdiği belirlenmiştir. Eğitim-öğretim aksatılmadan çalışmanın tamamlanabilmesi için tüm uygulama yaz tatili dönemine sıkıştırılmış, iş programı 3 vardiyalı olarak kurgulanmıştır.

Statik projede öngörülen 18 kolonda betonarme mantolama ve merdiven boşluğu çevresinde yeni perde duvar uygulaması gerçekleştirilmiş, ayrıca döşemelerde karbon fiber şerit takviyesi yapılmıştır. Proje, okulun eğitim-öğretim yılı başlamadan bir hafta önce teslim edilmiş ve gerekli tüm kalite kontrol raporları il milli eğitim müdürlüğüne sunulmuştur.`,
      coverImage: "/uploads/placeholder-4.svg",
      gallery: JSON.stringify(["/uploads/placeholder-4.svg"]),
    },
    {
      slug: "adiyaman-merkez-konut-guclendirme",
      title: "Adıyaman Merkez Konut Güçlendirme",
      region: Region.ADIYAMAN,
      summary:
        "8 katlı konut binasında zemin iyileştirmesi, temel takviyesi ve tüm kat kolonlarında kapsamlı mantolama uygulaması.",
      body: `Adıyaman merkezde yer alan 8 katlı konut binası, yapılan zemin etüdünde orta derecede sıvılaşma riski taşıyan bir parselde bulunduğu için hem üst yapı hem de zemin iyileştirmesini kapsayan bütünleşik bir güçlendirme programına alınmıştır. Zemin iyileştirmesi kapsamında bina çevresinde jet-grout kolonları oluşturulmuş, temel sistemine yük aktarım başlıkları eklenmiştir.

Üst yapıda tüm katlardaki 36 kolonda betonarme mantolama uygulanmış, iki aks boyunca zemin kattan çatıya kadar devam eden yeni perde duvarlar eklenerek binanın rijitliği artırılmıştır. Proje, kat maliklerinin ortak kararıyla başlatılmış ve 14 haftalık bir sürede tamamlanmıştır.`,
      coverImage: "/uploads/placeholder-5.svg",
      gallery: JSON.stringify(["/uploads/placeholder-5.svg", "/uploads/placeholder-6.svg"]),
    },
    {
      slug: "adiyaman-kahta-is-merkezi-guclendirme",
      title: "Kahta İş Merkezi Güçlendirme",
      region: Region.ADIYAMAN,
      summary:
        "Zemin ve 1. katı işyerlerinden oluşan 3 katlı iş merkezinde çelik çapraz elemanlarla rijitlik artırımı.",
      body: `Adıyaman Kahta'daki bu 3 katlı iş merkezinde, betonarme mantolamanın kat yüksekliğini ve mevcut vitrin açıklıklarını olumsuz etkileyecek olması nedeniyle statik projede çelik çapraz elemanlarla rijitlik artırımı yöntemi tercih edilmiştir. Mevcut çerçeve sistemine entegre edilen çelik çaprazlar, binanın yatay yük taşıma kapasitesini önemli ölçüde artırırken mimari kullanım alanını neredeyse hiç etkilememiştir.

Çelik elemanların betonarme sisteme bağlantısı, kimyasal ankraj ve özel bağlantı plakaları ile sağlanmış, tüm kaynak ve bağlantı noktaları ultrasonik test ile kontrol edilmiştir. Proje, işyeri sahiplerinin talebi doğrultusunda 5 haftalık kısa bir sürede, işletmelerin faaliyetini sürdürebilmesine imkan tanıyacak şekilde tamamlanmıştır.`,
      coverImage: "/uploads/placeholder-6.svg",
      gallery: JSON.stringify(["/uploads/placeholder-6.svg"]),
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  console.log(`✓ ${projects.length} proje eklendi.`);
}

async function seedBlogPosts() {
  const posts = [
    {
      slug: "deprem-guclendirme-mevzuati-neler-degisti",
      title: "Deprem Güçlendirme Mevzuatında Neler Değişti?",
      excerpt:
        "TBDY 2018 ile birlikte bina güçlendirme projelerinde hangi kurallar geçerli, mevcut bina sahiplerini neler bekliyor?",
      body: `Türkiye Bina Deprem Yönetmeliği (TBDY 2018), mevcut binaların değerlendirilmesi ve güçlendirilmesi konusunda önceki yönetmeliklere göre çok daha ayrıntılı ve performans esaslı bir yaklaşım getirdi. Artık bir binanın "güçlendirilmesi gerekiyor mu" sorusunun cevabı, sadece görsel hasar tespitiyle değil; karot, donatı taraması ve bilgisayar destekli analizlerle ortaya konan performans düzeyi ile veriliyor.

Yönetmelik, binaları kullanım amacına göre farklı performans hedeflerine tabi tutuyor: okul ve hastane gibi deprem sonrası kullanımı kritik yapılarda "kesintisiz kullanım", konut ve ofis binalarında ise genellikle "can güvenliği" performans düzeyi hedefleniyor. Bu hedefe ulaşmak için uygulanacak güçlendirme yöntemi (mantolama, karbon fiber, çelik çapraz vb.) her binanın kendine özgü statik analiz sonuçlarına göre belirleniyor; yani standart bir "herkese uyan" çözüm yok.

Bina sahipleri açısından pratik sonuç şu: güçlendirme kararı almadan önce mutlaka yetkili bir mühendislik firmasından deprem risk analizi almak, bu analiz sonucuna göre hazırlanan statik projeyi ilgili belediyeye onaylatmak gerekiyor. Ruhsatsız veya projesiz yapılan güçlendirme uygulamaları hem hukuki hem de teknik açıdan risk taşıyor.`,
      coverImage: "/uploads/placeholder-blog-1.svg",
      published: true,
      publishedAt: new Date("2026-03-10T09:00:00.000Z"),
      seoTitle: "Deprem Güçlendirme Mevzuatında Neler Değişti? | Hepa",
      seoDescription:
        "TBDY 2018 yönetmeliği kapsamında bina güçlendirme sürecinin nasıl işlediğini, performans hedeflerini ve bina sahiplerinin izlemesi gereken adımları anlatıyoruz.",
    },
    {
      slug: "karbon-fiber-teknolojisi-nasil-calisir",
      title: "Karbon Fiber Güçlendirme Teknolojisi Nasıl Çalışır?",
      excerpt:
        "Kesit kalınlığını artırmadan taşıyıcı elemanları güçlendiren karbon fiber sistemlerin uygulama mantığını inceliyoruz.",
      body: `Karbon fiber takviyeli polimer (CFRP) sistemler, son yıllarda bina güçlendirme projelerinde giderek daha sık tercih ediliyor. Temel mantık oldukça basit: yüksek çekme dayanımına sahip karbon fiber kumaşlar, epoksi esaslı özel bir yapıştırıcı ile mevcut betonarme elemanın yüzeyine sarılıyor ve beton ile kompozit bir davranış sergilemesi sağlanıyor. Bu sayede eleman ek ağırlık ve kalınlık almadan eğilme ve kesme kapasitesi kazanıyor.

Yöntemin en belirgin avantajı hız ve mimari müdahale azlığı. Islak yöntemle yapılan betonarme mantolamada kürlenme süresi beklenirken, karbon fiber uygulamasında bina birkaç gün içinde tekrar kullanıma açılabiliyor. Bu özellik, özellikle işyerleri, okullar ve hastaneler gibi kesintisiz kullanım gerektiren binalarda karbon fiberi öne çıkarıyor.

Ancak her güçlendirme ihtiyacında karbon fiber tek başına yeterli olmayabiliyor. Özellikle eksenel yük kapasitesinin artırılması gereken kolonlarda betonarme mantolama veya çelik gömlekleme daha etkili sonuç veriyor. Bu nedenle projelerimizde karbon fiberi, statik analiz sonuçlarına göre diğer yöntemlerle birlikte, doğru elemanda doğru çözüm mantığıyla kullanıyoruz.`,
      coverImage: "/uploads/placeholder-blog-2.svg",
      published: true,
      publishedAt: new Date("2026-04-22T09:00:00.000Z"),
      seoTitle: "Karbon Fiber Güçlendirme Teknolojisi Nasıl Çalışır? | Hepa",
      seoDescription:
        "Karbon fiber takviyeli polimer (CFRP) sistemlerin bina güçlendirmede nasıl kullanıldığını, avantajlarını ve sınırlarını anlatıyoruz.",
    },
    {
      slug: "bina-risk-analizi-sureci-adim-adim",
      title: "Bina Risk Analizi Süreci Adım Adım",
      excerpt:
        "Deprem risk analizi talep etmeyi düşünen bina sahipleri için sürecin nasıl işlediğine dair kısa bir rehber.",
      body: `Bir binanın deprem güvenliğini öğrenmenin ilk adımı, kapsamlı bir risk analizi yaptırmaktır. Süreç genellikle bina üzerinde yapılan rölöve çalışmasıyla başlar; mevcut kat planları, kesitler ve taşıyıcı sistem elemanlarının boyutları yerinde ölçülerek belgelenir. Ardından karot numuneleri alınarak beton dayanımı laboratuvar ortamında test edilir, donatı taraması ile kolon ve kirişlerdeki demir miktarı ve yerleşimi tespit edilir.

Toplanan bu veriler, bilgisayar destekli statik analiz yazılımına aktarılarak binanın deprem yükleri altındaki davranışı modellenir. Analiz sonucunda binanın mevcut performans düzeyi (göçme öncesi, can güvenliği veya kesintisiz kullanım) belirlenir ve bu düzeyin bina kullanım amacı için yeterli olup olmadığı değerlendirilir. Yetersiz bulunması durumunda, hangi taşıyıcı elemanların hangi yöntemle güçlendirilmesi gerektiği raporlanır.

Sürecin sonunda bina sahiplerine sunulan rapor; teknik bulguları, önerilen güçlendirme senaryolarını ve bu senaryoların yaklaşık maliyet-süre karşılaştırmasını içerir. Böylece bina sahipleri, teknik verilere dayanarak bilinçli bir karar verebilir. Analiz süreci bina büyüklüğüne göre değişmekle birlikte genellikle 2-4 hafta içinde tamamlanır.`,
      coverImage: "/uploads/placeholder-blog-3.svg",
      published: true,
      publishedAt: new Date("2026-05-30T09:00:00.000Z"),
      seoTitle: "Bina Risk Analizi Süreci Adım Adım | Hepa",
      seoDescription:
        "Deprem risk analizi sürecinin rölöveden statik analize, raporlamaya kadar nasıl işlediğini bina sahipleri için özetliyoruz.",
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log(`✓ ${posts.length} blog yazısı eklendi.`);
}

async function seedSiteSettings() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      heroTitle: "Binanızın deprem güvenliğini mühendislik hassasiyetiyle belirliyoruz.",
      heroSubtitle:
        "Kahramanmaraş, Hatay ve Adıyaman'da deprem risk analizi, statik proje ve bina güçlendirme hizmetleri.",
      phone: "+90 344 000 00 00",
      email: "info@hepa.com",
      address: "Kahramanmaraş, Türkiye",
      seoTitle: "Hepa — Bina Güçlendirme ve İnşaat",
      seoDescription:
        "Kahramanmaraş, Hatay ve Adıyaman'da deprem risk analizi, statik proje ve bina güçlendirme hizmetleri. Mühendislik hassasiyetiyle, güvenle inşa ediyoruz.",
    },
    create: {
      id: "default",
      heroTitle: "Binanızın deprem güvenliğini mühendislik hassasiyetiyle belirliyoruz.",
      heroSubtitle:
        "Kahramanmaraş, Hatay ve Adıyaman'da deprem risk analizi, statik proje ve bina güçlendirme hizmetleri.",
      phone: "+90 344 000 00 00",
      email: "info@hepa.com",
      address: "Kahramanmaraş, Türkiye",
      seoTitle: "Hepa — Bina Güçlendirme ve İnşaat",
      seoDescription:
        "Kahramanmaraş, Hatay ve Adıyaman'da deprem risk analizi, statik proje ve bina güçlendirme hizmetleri. Mühendislik hassasiyetiyle, güvenle inşa ediyoruz.",
    },
  });

  console.log("✓ Site ayarları eklendi.");
}

async function main() {
  await seedAdminUser();
  await seedServices();
  await seedProjects();
  await seedBlogPosts();
  await seedSiteSettings();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
