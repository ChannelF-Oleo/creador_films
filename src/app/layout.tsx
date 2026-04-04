import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://elchefdelasfotos.com"),
  title: {
    default: "CREADOR FILMS — Fotografía Urbana Editorial",
    template: "%s | CREADOR FILMS",
  },
  description: "Fotografía editorial, urbana, moda y cultura. La mirada que eleva el asfalto al arte en la escena underground.",
  keywords: ["fotografía", "fotografía urbana", "editorial", "moda", "underground", "street photography", "República Dominicana", "arte urbano", "creador films"],
  authors: [{ name: "Creador Films" }],
  creator: "Creador Films",
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
    title: "CREADOR FILMS — Estética del Asfalto",
    description: "Fotografía documental, editorial y de moda desde las calles.",
    url: "https://elchefdelasfotos.com",
    siteName: "Creador Films",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/Hero.avif",
        width: 1200,
        height: 630,
        alt: "Creador Films - Estética del Asfalto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CREADOR FILMS — Fotografía Urbana Editorial",
    description: "Fotografía editorial, urbana, moda y cultura.",
    images: ["/Hero.avif"],
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

import { LanguageProvider, useLanguage } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="es">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Bodoni+Moda:ital,opsz,wght@0,6..96,300;0,6..96,400;0,6..96,700;1,6..96,300;1,6..96,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Rubik+Dirt&family=Yeseva+One&family=Sedgwick+Ave+Display&display=swap"
            rel="stylesheet"
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
