import type { Metadata } from "next";
import Script from "next/script";
import { Bodoni_Moda, Sedgwick_Ave_Display, UnifrakturMaguntia } from "next/font/google";
import "./globals.css";
import { SITE_URL, jsonLd, siteGraph } from "@/lib/site";

const gothic = UnifrakturMaguntia({ weight: "400", subsets: ["latin"], variable: "--nf-gothic", display: "swap" });
const serif = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--nf-serif",
  display: "swap",
});
// Solo se usa en titulares decorativos debajo del primer pantallazo: sin preload
const graffiti = Sedgwick_Ave_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--nf-graffiti",
  display: "swap",
  preload: false,
});

const TITLE = "Fotógrafo en Santo Domingo | El Chef de las Fotos — Creador Films";
const DESCRIPTION =
  "Edwin de León, «el chef de las fotos»: fotografía urbana, editorial y de moda en Santo Domingo, República Dominicana. Sesiones en calle o estudio. Reserva por WhatsApp.";
const OG_IMAGE = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "Sesión de fotografía urbana en Santo Domingo por Creador Films",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Creador Films",
  },
  description: DESCRIPTION,
  authors: [{ name: "Edwin de León", url: SITE_URL }],
  creator: "Edwin de León",
  publisher: "Creador Films",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/camera_favicon_32px.ico",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Creador Films",
    locale: "es_DO",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="es" className={`${gothic.variable} ${serif.variable} ${graffiti.variable}`}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd(siteGraph) }}
          />
        </head>
        <body>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=G-773P2LB2X7`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-773P2LB2X7');
              `,
            }}
          />
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </body>
      </html>
  );
}
