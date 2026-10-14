import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { adminDb } from "@/lib/firebaseAdmin";
import { EDITORIAL_CATEGORIES, type LandingSettings } from "@/lib/editorials";
import { getPortfolio, type Photo } from "@/lib/portfolio";

export interface LandingImage {
    id: string;
    src: string;
    alt: string;
    width: number | null;
    height: number | null;
}

export interface Landing {
    hero: LandingImage | null;
    about: LandingImage | null;
    bookings: LandingImage | null;
    /** Por slug de editorial; una editorial sin fotos no aparece */
    editorials: Record<string, { cover: LandingImage; photos: LandingImage[] }>;
}

const EMPTY_SETTINGS: LandingSettings = { heroPhotoId: null, aboutPhotoId: null, bookingsPhotoId: null, editorials: {} };

/** Documento settings/landing tal como lo guarda el admin. */
export async function getLandingSettings(): Promise<LandingSettings> {
    "use cache";
    cacheTag("landing");

    const snap = await adminDb().collection("settings").doc("landing").get();
    const d = snap.data() ?? {};
    const editorials: LandingSettings["editorials"] = {};
    for (const [slug, e] of Object.entries((d.editorials ?? {}) as Record<string, { coverId?: string; photoIds?: string[] }>)) {
        editorials[slug] = { coverId: e.coverId ?? null, photoIds: e.photoIds ?? [] };
    }
    return {
        heroPhotoId: d.heroPhotoId ?? null,
        aboutPhotoId: d.aboutPhotoId ?? null,
        bookingsPhotoId: d.bookingsPhotoId ?? null,
        editorials,
    };
}

const toImage = (p: Photo): LandingImage => ({ id: p.id, src: p.src, alt: p.alt, width: p.width, height: p.height });

/**
 * Fotos que muestra el landing, ya resueltas.
 * Nunca lanza: si Firestore falla, devuelve vacío y los componentes usan su foto de respaldo.
 */
export async function getLanding(): Promise<Landing> {
    "use cache";
    cacheTag("landing", "photos");

    let settings = EMPTY_SETTINGS;
    let portfolio: Awaited<ReturnType<typeof getPortfolio>> = { categories: [], photos: [] };
    try {
        [settings, portfolio] = await Promise.all([getLandingSettings(), getPortfolio()]);
    } catch (err) {
        console.error("Landing: error leyendo Firestore; se usan fotos de respaldo", err);
        // Reintentar pronto en vez de guardar el fallo con la duración normal
        cacheLife("minutes");
    }

    const byId = new Map(portfolio.photos.map((p) => [p.id, p]));
    const findPhoto = (id: string | null) => {
        const p = id ? byId.get(id) : undefined;
        return p && p.src ? p : null;
    };
    // Las fotos ocultas del portafolio (Hero, About, Contact) pueden usarse en esas secciones
    const slot = (id: string | null) => {
        const p = findPhoto(id);
        return p ? toImage(p) : null;
    };

    const categoryOrder = new Map(portfolio.categories.map((c) => [c.id, c.order]));
    const slugById = new Map(portfolio.categories.map((c) => [c.id, c.slug]));

    const editorials: Landing["editorials"] = {};
    for (const [slug, categorySlugs] of Object.entries(EDITORIAL_CATEGORIES)) {
        const selection = settings.editorials[slug] ?? { coverId: null, photoIds: [] };
        const inSeries = (p: Photo) => !p.hidden && categorySlugs.includes(slugById.get(p.categoryId ?? "") ?? "");

        // Mismo orden que en el portafolio: por categoría y luego por foto
        const chosen = selection.photoIds
            .map((id) => findPhoto(id))
            .filter((p): p is Photo => p !== null && !p.hidden)
            .sort((a, b) =>
                (categoryOrder.get(a.categoryId ?? "") ?? 0) - (categoryOrder.get(b.categoryId ?? "") ?? 0)
                || a.order - b.order
            );

        const coverPhoto = findPhoto(selection.coverId);
        // Sin portada elegida (o borrada): la primera foto de la serie
        const cover = coverPhoto && !coverPhoto.hidden
            ? coverPhoto
            : chosen[0] ?? portfolio.photos.find(inSeries) ?? null;
        if (!cover) continue;

        editorials[slug] = {
            cover: toImage(cover),
            photos: chosen.filter((p) => p.id !== cover.id).map(toImage),
        };
    }

    return {
        hero: slot(settings.heroPhotoId),
        about: slot(settings.aboutPhotoId),
        bookings: slot(settings.bookingsPhotoId),
        editorials,
    };
}
