"use server";

import { updateTag } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { editorialForCategory, LANDING_SLOTS, type LandingSlot } from "@/lib/editorials";

// Las reglas de Firestore/Storage usan el mismo UID
const ADMIN_UID = process.env.FIREBASE_ADMIN_UID || "u47vBmzPBdPj7MjJCK3z109VbNq1";

type Result = { ok: true } | { ok: false; error: string };

// ── Helpers ───────────────────────────────────────────────────────────────────
/** Toda acción empieza aquí: sin un token válido del admin no se escribe nada. */
async function requireAdmin(idToken: string) {
    const decoded = await adminAuth().verifyIdToken(idToken);
    if (decoded.uid !== ADMIN_UID) throw new Error("No autorizado");
}

async function run(idToken: string, fn: () => Promise<void>, tags: string[]): Promise<Result> {
    try {
        await requireAdmin(idToken);
        await fn();
        tags.forEach((t) => updateTag(t));
        return { ok: true };
    } catch (err) {
        console.error("Acción de admin fallida", err);
        return { ok: false, error: err instanceof Error ? err.message : "Error desconocido" };
    }
}

const photos = () => adminDb().collection("photos");
const categories = () => adminDb().collection("categories");
const landingRef = () => adminDb().collection("settings").doc("landing");

async function categorySlug(categoryId: string | null | undefined) {
    if (!categoryId) return null;
    const snap = await categories().doc(categoryId).get();
    return (snap.data()?.slug as string | undefined) ?? null;
}

/** Editorial de una foto según su categoría */
async function editorialOf(photoId: string) {
    const snap = await photos().doc(photoId).get();
    if (!snap.exists) throw new Error("La foto no existe");
    const slug = await categorySlug(snap.data()?.categoryId);
    const editorial = slug ? editorialForCategory(slug) : null;
    if (!editorial) throw new Error("La categoría de esta foto no tiene editorial en el landing");
    return editorial;
}

/** Ruta en Storage a partir de la URL de descarga */
function storageLocation(src: string) {
    const m = /\/v0\/b\/([^/]+)\/o\/([^?]+)/.exec(src);
    return m ? { bucket: m[1], path: decodeURIComponent(m[2]) } : null;
}

function slugify(name: string) {
    return name
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

// ── Fotos ─────────────────────────────────────────────────────────────────────
export async function createPhoto(
    idToken: string,
    photo: { src: string; storagePath: string; categoryId: string; alt: string; width: number; height: number }
) {
    return run(idToken, async () => {
        const cat = await categories().doc(photo.categoryId).get();
        if (!cat.exists) throw new Error("La categoría no existe");

        // Primera de su categoría (sin orderBy: evita exigir un índice compuesto)
        const siblings = await photos().where("categoryId", "==", photo.categoryId).get();
        const order = Math.min(1, ...siblings.docs.map((s) => (s.data().order as number | undefined) ?? 0)) - 1;

        await photos().add({
            ...photo,
            alt: photo.alt.trim() || `Fotografía de ${cat.data()?.name}`,
            cat: cat.data()?.name ?? "",
            order,
            hidden: false,
            createdAt: FieldValue.serverTimestamp(),
        });
    }, ["photos"]);
}

export async function updatePhoto(idToken: string, photoId: string, patch: { alt?: string; hidden?: boolean }) {
    return run(idToken, async () => {
        const data: Record<string, unknown> = {};
        if (typeof patch.alt === "string") {
            if (!patch.alt.trim()) throw new Error("El texto alternativo no puede quedar vacío");
            data.alt = patch.alt.trim();
        }
        if (typeof patch.hidden === "boolean") data.hidden = patch.hidden;
        await photos().doc(photoId).update(data);
    }, ["photos", "landing"]);
}

export async function deletePhoto(idToken: string, photoId: string) {
    return run(idToken, async () => {
        const ref = photos().doc(photoId);
        const snap = await ref.get();
        if (!snap.exists) return;
        const d = snap.data()!;

        // Quitarla del landing antes de borrarla
        const landing = (await landingRef().get()).data() ?? {};
        const update: Record<string, unknown> = {};
        for (const { field } of LANDING_SLOTS) if (landing[field] === photoId) update[field] = null;
        for (const [slug, e] of Object.entries((landing.editorials ?? {}) as Record<string, { coverId?: string; photoIds?: string[] }>)) {
            if (e.coverId === photoId) update[`editorials.${slug}.coverId`] = null;
            if (e.photoIds?.includes(photoId)) update[`editorials.${slug}.photoIds`] = FieldValue.arrayRemove(photoId);
        }
        if (Object.keys(update).length) await landingRef().update(update);

        const location = d.storagePath
            ? { bucket: storageLocation(d.src)?.bucket, path: d.storagePath as string }
            : storageLocation(d.src);
        if (location?.path) {
            await getStorage().bucket(location.bucket).file(location.path).delete({ ignoreNotFound: true });
        }
        await ref.delete();
    }, ["photos", "landing"]);
}

/** Intercambia la foto con la anterior o la siguiente de su categoría. */
export async function movePhoto(idToken: string, photoId: string, direction: -1 | 1) {
    return run(idToken, async () => {
        const snap = await photos().doc(photoId).get();
        const categoryId = snap.data()?.categoryId;
        if (!categoryId) throw new Error("La foto no tiene categoría");

        const siblings = (await photos().where("categoryId", "==", categoryId).get()).docs
            .sort((a, b) => (a.data().order ?? 0) - (b.data().order ?? 0));
        const i = siblings.findIndex((s) => s.id === photoId);
        const j = i + direction;
        if (i === -1 || j < 0 || j >= siblings.length) return;

        // Renumerar 0..n evita empates heredados de subidas viejas
        [siblings[i], siblings[j]] = [siblings[j], siblings[i]];
        const batch = adminDb().batch();
        siblings.forEach((s, order) => { if (s.data().order !== order) batch.update(s.ref, { order }); });
        await batch.commit();
    }, ["photos"]);
}

// ── Landing ───────────────────────────────────────────────────────────────────
export async function setLandingPhoto(idToken: string, slot: LandingSlot, photoId: string) {
    return run(idToken, async () => {
        const field = LANDING_SLOTS.find((s) => s.slot === slot)?.field;
        if (!field) throw new Error("Sección desconocida");
        await landingRef().set({ [field]: photoId }, { merge: true });
    }, ["landing"]);
}

export async function setEditorialCover(idToken: string, photoId: string) {
    return run(idToken, async () => {
        const editorial = await editorialOf(photoId);
        await landingRef().set({ editorials: { [editorial]: { coverId: photoId } } }, { merge: true });
    }, ["landing"]);
}

/** Añade o quita la foto de las tiras y el visor de su editorial. */
export async function setInEditorial(idToken: string, photoId: string, included: boolean) {
    return run(idToken, async () => {
        const editorial = await editorialOf(photoId);
        await landingRef().set({
            editorials: {
                [editorial]: { photoIds: included ? FieldValue.arrayUnion(photoId) : FieldValue.arrayRemove(photoId) },
            },
        }, { merge: true });
    }, ["landing"]);
}

// ── Categorías ────────────────────────────────────────────────────────────────
export async function createCategory(idToken: string, rawName: string) {
    return run(idToken, async () => {
        const name = rawName.trim().replace(/\s+/g, " ");
        if (!name) throw new Error("Escribe un nombre");
        const all = (await categories().get()).docs;
        if (all.some((c) => String(c.data().name).trim().toLowerCase() === name.toLowerCase())) {
            throw new Error(`Ya existe una categoría llamada "${name}"`);
        }
        const order = Math.max(-1, ...all.map((c) => (c.data().order as number | undefined) ?? 0)) + 1;
        await categories().add({ name, slug: slugify(name), order, createdAt: FieldValue.serverTimestamp() });
    }, ["photos"]);
}

export async function moveCategory(idToken: string, categoryId: string, direction: -1 | 1) {
    return run(idToken, async () => {
        const all = (await categories().get()).docs
            .sort((a, b) => (a.data().order ?? 0) - (b.data().order ?? 0));
        const i = all.findIndex((c) => c.id === categoryId);
        const j = i + direction;
        if (i === -1 || j < 0 || j >= all.length) return;

        [all[i], all[j]] = [all[j], all[i]];
        const batch = adminDb().batch();
        all.forEach((c, order) => { if (c.data().order !== order) batch.update(c.ref, { order }); });
        await batch.commit();
    }, ["photos", "landing"]);
}
