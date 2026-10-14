// Migración única al modelo de fotos administrables (fase 0 del plan de trabajo).
//
//   node --env-file=.env scripts/migrate-photos.mjs           → simulación: solo lee y reporta
//   node --env-file=.env scripts/migrate-photos.mjs --write   → aplica los cambios en producción
//
// Es idempotente: se puede volver a ejecutar sin duplicar fotos ni pisar la selección del landing.
// Las fotos migradas desde public/ no llevan `createdAt` a propósito: el código viejo de producción
// ordena por ese campo, así que no las mostrará duplicadas antes de desplegar el código nuevo.

import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import sharp from "sharp";

const WRITE = process.argv.includes("--write");
const MAX_SIZE = 2400;
const QUALITY = 85;
const PUBLIC_DIR = path.resolve("public");

// ── Categorías: orden de los filtros del portafolio ───────────────────────────
const CATEGORIES = [
    { slug: "street", name: "Street", aliases: ["calle", "urban"] },
    { slug: "cultura", name: "Cultura", aliases: ["culture"] },
    { slug: "moda", name: "Moda", aliases: ["fashion"] },
    { slug: "rural", name: "Rural", aliases: [] },
    { slug: "studio", name: "Studio", aliases: ["estudio"] },
    { slug: "bts", name: "BTS - Urbano", aliases: ["bts"] },
    { slug: "kids", name: "Kids", aliases: [] },
];

// ── Fotos fijas en public/ → categoría (decidido el 2026-10-14) ───────────────
// alt: el que tenían en Gallery.tsx; si no tenían, se genera con la categoría.
const STATIC_PHOTOS = [
    { file: "street2", cat: "street", alt: "Escena urbana de calle" },
    { file: "street", cat: "street" },
    { file: "urban", cat: "street", alt: "Fotografía urbana — barrio" },
    { file: "urban2", cat: "street", alt: "Retrato urbano" },
    { file: "cultura", cat: "cultura", alt: "Cultura urbana" },
    { file: "culture2", cat: "cultura" },
    { file: "moda2", cat: "moda", alt: "Editorial de moda — retrato" },
    { file: "moda", cat: "moda", alt: "Fotografía de moda editorial" },
    { file: "moda3", cat: "moda", alt: "Moda editorial callejera" },
    { file: "moda4", cat: "moda", alt: "Moda urbana — ambiente" },
    { file: "moda5", cat: "moda", alt: "Editorial de moda" },
    { file: "rural4", cat: "rural", alt: "Rural — documentación" },
    { file: "rural", cat: "rural", alt: "Fotografía rural — paisaje" },
    { file: "rural2", cat: "rural", alt: "Rural — naturaleza" },
    { file: "rural3", cat: "rural", alt: "Rural — documental" },
    { file: "studio2", cat: "studio", alt: "Retrato de estudio" },
    { file: "studio", cat: "studio" },
    { file: "Studio3", cat: "studio" },
    { file: "studio4", cat: "studio" },
    { file: "studio5", cat: "studio" },
    { file: "street_studio", cat: "studio", alt: "Retrato de estudio" },
    { file: "street_studio2", cat: "studio" },
    { file: "bts", cat: "bts" },
    { file: "bts2", cat: "bts" },
    { file: "bts3", cat: "bts" },
    { file: "bts4", cat: "bts" },
    { file: "bts5", cat: "bts" },
    { file: "flow_kids", cat: "kids", alt: "Kids — comunidad" },
    { file: "flow_kids2", cat: "kids", alt: "Kids — infancia urbana" },
    { file: "flow_kids3", cat: "kids", alt: "Kids — momento espontáneo" },
    { file: "flow_kid4", cat: "kids", alt: "Kids — retrato espontáneo" },
    // Solo landing: ocultas en la grilla
    { file: "Hero", cat: null, hidden: true, alt: "Portada — Creador Films" },
    { file: "about", cat: null, hidden: true, alt: "Edwin — El Chef de las Fotos" },
    { file: "bookings", cat: null, hidden: true, alt: "Reservas — Creador Films" },
];

// Selección actual del landing (EDITORIAL_ASSETS en Services.tsx), por slug de editorial
const LANDING = {
    heroPhotoId: "static-Hero",
    aboutPhotoId: "static-about",
    bookingsPhotoId: "static-bookings",
    editorials: {
        "cultura-street": { cover: "street2", photos: ["street", "urban", "culture2", "cultura", "street_studio", "street_studio2"] },
        moda: { cover: "moda2", photos: ["moda", "moda3", "moda4", "moda5"] },
        rural: { cover: "rural4", photos: ["rural", "rural2", "rural3"] },
        studio: { cover: "studio2", photos: ["studio", "Studio3", "studio4", "studio5"] },
        bts: { cover: "bts", photos: ["bts2", "bts3", "bts4", "bts5"] },
        kids: { cover: "flow_kids", photos: ["flow_kids2", "flow_kids3", "flow_kid4"] },
    },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const normalize = (s) => String(s ?? "").trim().toLowerCase();
const staticId = (file) => `static-${file}`;
const log = (...a) => console.log(...a);

function originalFor(file) {
    for (const ext of [".jpeg", ".jpg", ".png"]) {
        const p = path.join(PUBLIC_DIR, file + ext);
        if (existsSync(p)) return p;
    }
    return null;
}

function bucketFromUrl(src) {
    return /\/v0\/b\/([^/]+)\/o\//.exec(src ?? "")?.[1] ?? null;
}

async function measureUrl(src) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const meta = await sharp(Buffer.from(await res.arrayBuffer())).metadata();
    // Las fotos con rotación EXIF se muestran giradas: medidas intercambiadas
    const rotated = (meta.orientation ?? 1) >= 5;
    return rotated ? { width: meta.height, height: meta.width } : { width: meta.width, height: meta.height };
}

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

log(WRITE ? "MODO ESCRITURA: se aplicarán cambios en producción\n" : "SIMULACIÓN: no se escribe nada (usa --write para aplicar)\n");

const collections = (await db.listCollections()).map((c) => c.id);
log(`Colecciones en Firestore: ${collections.join(", ")}`);
const unknown = collections.filter((c) => !["categories", "photos", "settings"].includes(c));
if (unknown.length) log(`  ⚠ Las reglas nuevas cierran estas colecciones: ${unknown.join(", ")}`);

// 1. Categorías ────────────────────────────────────────────────────────────────
const catSnap = await db.collection("categories").get();
const existingCats = catSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
log(`\n1. Categorías (${existingCats.length} en Firestore)`);

const categoryIdBySlug = new Map();
const categoryIdByName = new Map();
const batch = db.batch();

for (const [order, cat] of CATEGORIES.entries()) {
    const names = [cat.name, cat.slug, ...cat.aliases].map(normalize);
    const match = existingCats.find((c) => c.slug === cat.slug)
        ?? existingCats.find((c) => names.includes(normalize(c.name)));

    const ref = match ? db.collection("categories").doc(match.id) : db.collection("categories").doc();
    categoryIdBySlug.set(cat.slug, ref.id);
    for (const n of names) categoryIdByName.set(n, ref.id);
    if (match) categoryIdByName.set(normalize(match.name), ref.id);

    if (match) {
        log(`   ${match.name} → slug "${cat.slug}", orden ${order}`);
        batch.update(ref, { slug: cat.slug, order });
    } else {
        log(`   + crear "${cat.name}" (no existe) → slug "${cat.slug}", orden ${order}`);
        batch.set(ref, { name: cat.name, slug: cat.slug, order, createdAt: new Date() });
    }
}
for (const c of existingCats) {
    if (![...categoryIdBySlug.values()].includes(c.id)) {
        log(`   ⚠ "${c.name}" no está en el plan; queda al final de los filtros`);
        batch.update(db.collection("categories").doc(c.id), { order: CATEGORIES.length });
        categoryIdByName.set(normalize(c.name), c.id);
    }
}

// 2. Fotos ya subidas ──────────────────────────────────────────────────────────
const photoSnap = await db.collection("photos").get();
const photos = photoSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
const uploaded = photos.filter((p) => !p.id.startsWith("static-"));
log(`\n2. Fotos subidas desde el admin (${uploaded.length})`);

let bucketName = process.env.FIREBASE_STORAGE_BUCKET
    || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    || uploaded.map((p) => bucketFromUrl(p.src)).find(Boolean);

const unmatched = [];
const nextOrder = new Map(); // categoryId → siguiente orden libre
// Las más recientes primero, como se mostraban hasta ahora
uploaded.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));

for (const p of uploaded) {
    const categoryId = p.categoryId ?? categoryIdByName.get(normalize(p.cat)) ?? null;
    if (!categoryId) unmatched.push(p);
    const update = {};
    if (!p.categoryId && categoryId) update.categoryId = categoryId;
    if (typeof p.order !== "number") {
        const key = categoryId ?? "none";
        update.order = nextOrder.get(key) ?? 0;
        nextOrder.set(key, update.order + 1);
    }
    if (typeof p.hidden !== "boolean") update.hidden = false;
    if (typeof p.width !== "number" || typeof p.height !== "number") {
        if (WRITE) {
            try {
                Object.assign(update, await measureUrl(p.src));
            } catch (e) {
                log(`   ⚠ ${p.id}: no se pudo medir (${e.message})`);
            }
        } else {
            update.width = update.height = "(se mide al aplicar)";
        }
    }
    const bucket = bucketFromUrl(p.src);
    if (bucket && bucket !== bucketName) log(`   ⚠ ${p.id} está en otro bucket: ${bucket}`);
    if (Object.keys(update).length) {
        log(`   ${p.id} [${p.cat}] → ${JSON.stringify(update)}`);
        if (WRITE) batch.update(db.collection("photos").doc(p.id), update);
    }
}

if (unmatched.length) {
    log(`\n   ⚠ ${unmatched.length} foto(s) con una categoría que no existe:`);
    for (const p of unmatched) log(`     - ${p.id}: cat = "${p.cat}"  ${p.src?.slice(0, 80)}…`);
}

// 3. Fotos fijas de public/ ────────────────────────────────────────────────────
log(`\n3. Fotos fijas de public/ (${STATIC_PHOTOS.length}) → Storage, bucket: ${bucketName ?? "?"}`);
if (!bucketName) throw new Error("No se pudo deducir el bucket; define FIREBASE_STORAGE_BUCKET en .env");
const bucket = getStorage(app).bucket(bucketName);
const existingIds = new Set(photos.map((p) => p.id));
const newDocs = [];

for (const item of STATIC_PHOTOS) {
    const id = staticId(item.file);
    if (existingIds.has(id)) {
        log(`   = ${item.file} ya migrada`);
        continue;
    }
    const original = originalFor(item.file);
    if (!original) {
        log(`   ⚠ ${item.file}: no hay JPEG/PNG original en public/`);
        continue;
    }
    const categoryId = item.cat ? categoryIdBySlug.get(item.cat) : null;
    const catName = CATEGORIES.find((c) => c.slug === item.cat)?.name;
    const key = categoryId ?? "none";
    const order = nextOrder.get(key) ?? 0;
    nextOrder.set(key, order + 1);

    const { data, info } = await sharp(original)
        .rotate() // aplica la orientación EXIF antes de medir
        .resize(MAX_SIZE, MAX_SIZE, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toBuffer({ resolveWithObject: true });

    const doc = {
        alt: item.alt ?? `${catName ?? "Fotografía"} — Creador Films`,
        categoryId,
        width: info.width,
        height: info.height,
        order,
        hidden: item.hidden === true,
    };
    log(`   + ${path.basename(original)} → ${info.width}×${info.height}, ${(data.length / 1024).toFixed(0)} KB, ${item.cat ?? "solo landing"}, orden ${order}`);

    if (WRITE) {
        const storagePath = `portfolio/static/${item.file}.jpg`;
        const token = randomUUID();
        await bucket.file(storagePath).save(data, {
            contentType: "image/jpeg",
            metadata: {
                cacheControl: "public, max-age=31536000, immutable",
                metadata: { firebaseStorageDownloadTokens: token },
            },
        });
        doc.src = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
        doc.storagePath = storagePath;
        newDocs.push([id, doc]);
    }
}
for (const [id, doc] of newDocs) batch.set(db.collection("photos").doc(id), doc);

// 4. Selección del landing ─────────────────────────────────────────────────────
const landingRef = db.collection("settings").doc("landing");
const landingSnap = await landingRef.get();
log(`\n4. settings/landing`);
if (landingSnap.exists) {
    log("   = ya existe; no se toca la selección del fotógrafo");
} else {
    const landing = {
        heroPhotoId: LANDING.heroPhotoId,
        aboutPhotoId: LANDING.aboutPhotoId,
        bookingsPhotoId: LANDING.bookingsPhotoId,
        editorials: Object.fromEntries(
            Object.entries(LANDING.editorials).map(([slug, e]) => [
                slug,
                { coverId: staticId(e.cover), photoIds: e.photos.map(staticId) },
            ])
        ),
    };
    log(`   + crear con la selección actual: ${Object.keys(landing.editorials).join(", ")}`);
    batch.set(landingRef, landing);
}

// ── Aplicar ───────────────────────────────────────────────────────────────────
if (WRITE) {
    await batch.commit();
    log("\nListo: cambios aplicados.");
} else {
    log("\nSimulación terminada. Revisa el reporte y ejecuta con --write para aplicar.");
}
