// Miniaturas propias de las fotos de Storage, en lugar de la optimización de Vercel
// (su cuota del plan Hobby se agotaba y las fotos salían rotas con un 402).
//
// Cada foto en portfolio/<ruta> tiene versiones WebP en portfolio/thumbs/<ruta>_<ancho>.webp.
// La carpeta portfolio/ es de lectura pública (storage.rules), así que la URL no necesita token
// y el loader de next/image puede deducirla solo a partir de la URL original.
// Este archivo lo usan el navegador (loader), el servidor y scripts/make-thumbs.mjs: sin dependencias.

/** Anchos generados; si se piden más grandes, se sirve el original (máx. 2400 px). */
export const THUMB_WIDTHS = [640, 1280, 1920] as const;

const ROOT = "portfolio/";
const THUMBS_ROOT = "portfolio/thumbs/";

/** Bucket y ruta en Storage a partir de la URL de descarga */
export function storageLocation(src: string) {
    const m = /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\/([^?#]+)/.exec(src);
    return m ? { bucket: m[1], path: decodeURIComponent(m[2]) } : null;
}

/** ¿Esta ruta de Storage lleva miniaturas? */
export const hasThumbs = (path: string) => path.startsWith(ROOT) && !path.startsWith(THUMBS_ROOT);

export const thumbPath = (path: string, width: number) =>
    `${THUMBS_ROOT}${path.slice(ROOT.length)}_${width}.webp`;

/** URL de la miniatura más pequeña que cubre `width`, o la original si ninguna alcanza. */
export function thumbUrl(src: string, width: number) {
    const location = storageLocation(src);
    if (!location || !hasThumbs(location.path)) return src;
    const w = THUMB_WIDTHS.find((t) => t >= width);
    if (!w) return src;
    return `https://firebasestorage.googleapis.com/v0/b/${location.bucket}/o/${encodeURIComponent(thumbPath(location.path, w))}?alt=media`;
}
