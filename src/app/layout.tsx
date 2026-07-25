import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hepa — Bina Güçlendirme ve İnşaat",
    template: "%s | Hepa",
  },
  description:
    "Kahramanmaraş, Hatay ve Adıyaman'da deprem risk analizi, statik proje ve bina güçlendirme hizmetleri. Mühendislik hassasiyetiyle, güvenle inşa ediyoruz.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Hepa",
    title: "Hepa — Bina Güçlendirme ve İnşaat",
    description:
      "Kahramanmaraş, Hatay ve Adıyaman'da deprem risk analizi, statik proje ve bina güçlendirme hizmetleri.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.siteSettings
    .findUnique({ where: { id: "default" } })
    .catch(() => null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Hepa",
    description:
      settings?.seoDescription ??
      "Kahramanmaraş, Hatay ve Adıyaman'da bina güçlendirme ve inşaat hizmetleri.",
    url: SITE_URL,
    telephone: settings?.phone,
    email: settings?.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings?.address ?? "Kahramanmaraş",
      addressCountry: "TR",
    },
    areaServed: [
      { "@type": "City", name: "Kahramanmaraş" },
      { "@type": "City", name: "Hatay" },
      { "@type": "City", name: "Adıyaman" },
    ],
  };

  return (
    <html
      lang="tr"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
