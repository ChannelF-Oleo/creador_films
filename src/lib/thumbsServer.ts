import "server-only";

import sharp from "sharp";
import { adminStorage } from "@/lib/firebaseAdmin";
import { THUMB_WIDTHS, hasThumbs, thumbPath } from "@/lib/thumbs";

const QUALITY = 80;

/** Genera y sube las miniaturas WebP de una foto ya subida a Storage. */
export async function createThumbs(bucketName: string, path: string) {
    if (!hasThumbs(path)) throw new Error(`La foto debe estar en portfolio/: ${path}`);
    const bucket = adminStorage().bucket(bucketName);
    const [original] = await bucket.file(path).download();

    await Promise.all(THUMB_WIDTHS.map(async (width) => {
        const data = await sharp(original)
            .rotate() // aplica la orientación EXIF
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: QUALITY })
            .toBuffer();
        await bucket.file(thumbPath(path, width)).save(data, {
            contentType: "image/webp",
            metadata: { cacheControl: "public, max-age=31536000, immutable" },
        });
    }));
}

export async function deleteThumbs(bucketName: string, path: string) {
    if (!hasThumbs(path)) return;
    const bucket = adminStorage().bucket(bucketName);
    await Promise.all(THUMB_WIDTHS.map((w) => bucket.file(thumbPath(path, w)).delete({ ignoreNotFound: true })));
}
