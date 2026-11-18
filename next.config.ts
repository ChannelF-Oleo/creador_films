import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  // Necesario para 'use cache' + cacheTag (lecturas de Firestore en el servidor)
  cacheComponents: true,
  images: {
    // Sin la optimización de Vercel (su cuota del plan Hobby se agotaba y devolvía 402):
    // las fotos de Storage usan miniaturas WebP propias (src/lib/thumbs.ts).
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
  },
};

export default nextConfig;
