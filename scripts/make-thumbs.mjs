// Genera las miniaturas WebP de las fotos que aún no las tienen (las subidas nuevas ya las crean
// en createPhoto). Hay que ejecutarlo ANTES de desplegar el loader propio de next/image, o las
// fotos sin miniaturas saldrán rotas.
//
//   node --env-file=.env scripts/make-thumbs.mjs           → simulación: cuenta las que faltan
//   node --env-file=.env scripts/make-thumbs.mjs --write   → las genera y sube a Storage
//   ... --write --force                                    → las regenera todas
//
// Es idempotente. Mantener en sincronía con src/lib/thumbs.ts y src/lib/thumbsServer.ts.

import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import sharp from "sharp";

const WRITE = process.argv.includes("--write");
const FORCE = process.argv.includes("--force");
const CONCURRENCY = 6;

// ── Igual que src/lib/thumbs.ts ───────────────────────────────────────────────
const THUMB_WIDTHS = [640, 1280, 1920];
const QUALITY = 80;
const ROOT = "portfolio/";
const THUMBS_ROOT = "portfolio/thumbs/";

function storageLocation(src) {
    const m = /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\/([^?#]+)/.exec(src ?? "");
    return m ? { bucket: m[1], path: decodeURIComponent(m[2]) } : null;
}
const hasThumbs = (path) => path.startsWith(ROOT) && !path.startsWith(THUMBS_ROOT);
const thumbPath = (path, width) => `${THUMBS_ROOT}${path.slice(ROOT.length)}_${width}.webp`;

// ── Main ──────────────────────────────────────────────────────────────────────
const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error("Faltan las credenciales FIREBASE_* en .env");
}
const app = initializeApp({
    credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
});
const db = getFirestore(app);
const storage = getStorage(app);

console.log(WRITE ? "MODO ESCRITURA: se suben miniaturas a Storage\n" : "SIMULACIÓN: no se sube nada (usa --write)\n");

const docs = (await db.collection("photos").get()).docs;
const pending = [];
for (const doc of docs) {
    const location = storageLocation(doc.data().src);
    if (!location || !hasThumbs(location.path)) {
        console.log(`   ⚠ ${doc.id}: no está en ${ROOT} (${String(doc.data().src).slice(0, 80)})`);
        continue;
    }
    pending.push({ id: doc.id, ...location });
}

async function missing({ bucket, path }) {
    if (FORCE) return THUMB_WIDTHS;
    const b = storage.bucket(bucket);
    const exists = await Promise.all(THUMB_WIDTHS.map((w) => b.file(thumbPath(path, w)).exists().then(([e]) => e)));
    return THUMB_WIDTHS.filter((_, i) => !exists[i]);
}

let done = 0, made = 0, failed = 0;
async function worker() {
    while (pending.length) {
        const photo = pending.shift();
        try {
            const widths = await missing(photo);
            if (widths.length && WRITE) {
                const b = storage.bucket(photo.bucket);
                const [original] = await b.file(photo.path).download();
                await Promise.all(widths.map(async (width) => {
                    const data = await sharp(original)
                        .rotate()
                        .resize({ width, withoutEnlargement: true })
                        .webp({ quality: QUALITY })
                        .toBuffer();
                    await b.file(thumbPath(photo.path, width)).save(data, {
                        contentType: "image/webp",
                        metadata: { cacheControl: "public, max-age=31536000, immutable" },
                    });
                }));
            }
            if (widths.length) made++;
        } catch (e) {
            failed++;
            console.log(`   ✗ ${photo.id} (${photo.path}): ${e.message}`);
        }
        if (++done % 20 === 0) console.log(`   ${done}/${docs.length}…`);
    }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`\n${docs.length} fotos · ${made} ${WRITE ? "con miniaturas generadas" : "sin miniaturas completas"} · ${failed} errores`);
if (failed) process.exitCode = 1;
