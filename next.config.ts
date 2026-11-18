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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
