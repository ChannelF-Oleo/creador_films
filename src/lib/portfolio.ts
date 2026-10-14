import "server-only";

import { cacheTag } from "next/cache";
import { adminDb } from "@/lib/firebaseAdmin";

// ── Tipos ─────────────────────────────────────────────────────────────────────
export interface Category {
    id: string;
    name: string;
    slug: string;
    order: number;
}

export interface Photo {
    id: string;
    src: string;
    alt: string;
    categoryId: string | null;
    /** Medidas reales; null mientras la foto no se haya migrado */
    width: number | null;
    height: number | null;
    order: number;
    hidden: boolean;
}

export interface Portfolio {
    categories: Category[];
    photos: Photo[];
}

const normalize = (name: string) => name.trim().toLowerCase();

// ── Lectura ───────────────────────────────────────────────────────────────────
/** Categorías y fotos, cacheadas hasta que una acción del admin invalide la etiqueta "photos". */
export async function getPortfolio(): Promise<Portfolio> {
    "use cache";
    cacheTag("photos");

    const db = adminDb();
    const [catSnap, photoSnap] = await Promise.all([
        db.collection("categories").get(),
        db.collection("photos").get(),
    ]);

    const categories: Category[] = catSnap.docs
        .map((doc) => {
            const d = doc.data();
            return {
                id: doc.id,
                name: String(d.name ?? ""),
                slug: String(d.slug ?? ""),
                order: typeof d.order === "number" ? d.order : Number.MAX_SAFE_INTEGER,
            };
        })
        .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

    // Fotos sin migrar solo traen el nombre de la categoría en `cat`
    const idByName = new Map(categories.map((c) => [normalize(c.name), c.id]));

    const photos: Photo[] = photoSnap.docs
        .map((doc) => {
            const d = doc.data();
            return {
                id: doc.id,
                src: String(d.src ?? ""),
                alt: String(d.alt ?? ""),
                categoryId: d.categoryId ?? idByName.get(normalize(String(d.cat ?? ""))) ?? null,
                width: typeof d.width === "number" ? d.width : null,
                height: typeof d.height === "number" ? d.height : null,
                order: typeof d.order === "number"
                    ? d.order
                    // Sin orden guardado: las más recientes primero
                    : -(d.createdAt?.toMillis?.() ?? 0),
                hidden: d.hidden === true,
            };
        })
        .filter((p) => p.src)
        .sort((a, b) => a.order - b.order);

    return { categories, photos };
}
