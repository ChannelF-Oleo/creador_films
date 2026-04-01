import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://creadorfilms.com"),
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
    url: "https://creadorfilms.com",
    siteName: "Creador Films",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/Hero.jpeg",
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
    images: ["/Hero.jpeg"],
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
          href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Bodoni+Moda:ital,opsz,wght@0,6..96,300;0,6..96,400;0,6..96,700;1,6..96,300;1,6..96,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Rubik+Dirt&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
