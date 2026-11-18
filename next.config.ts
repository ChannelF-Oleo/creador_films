import type { NextConfig } from "next";

// Fotos subidas desde el admin (URLs de descarga de Firebase Storage)
const storageBuckets = ["creador-films.firebasestorage.app", "creador-films.appspot.com"];

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  // Necesario para 'use cache' + cacheTag (lecturas de Firestore en el servidor)
  cacheComponents: true,
  images: {
    // La cuota de optimización de Vercel (plan Hobby) se agotó y devolvía 402:
    // se sirven las fotos tal cual desde Storage.
    unoptimized: true,
    remotePatterns: storageBuckets.map((bucket) => ({
      protocol: "https" as const,
      hostname: "firebasestorage.googleapis.com",
      pathname: `/v0/b/${bucket}/o/**`,
    })),
  },
};

export default nextConfig;
