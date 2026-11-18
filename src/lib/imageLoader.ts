"use client";

import { thumbUrl } from "@/lib/thumbs";

/** Loader global de next/image (next.config.ts → images.loaderFile). */
export default function imageLoader({ src, width }: { src: string; width: number }) {
    // Archivos de public/ (logo, respaldos): se sirven tal cual
    return thumbUrl(src, width);
}
