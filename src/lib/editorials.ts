// Qué categorías alimentan cada editorial del landing.
// El orden y los textos de las editoriales están en src/translations/index.ts (campo `slug`).
export const EDITORIAL_CATEGORIES: Record<string, string[]> = {
    "cultura-street": ["street", "cultura"],
    moda: ["moda"],
    rural: ["rural"],
    studio: ["studio"],
    bts: ["bts"],
    kids: ["kids"],
};

/** Editorial a la que pertenece una categoría, por slug */
export function editorialForCategory(categorySlug: string): string | null {
    for (const [editorial, categories] of Object.entries(EDITORIAL_CATEGORIES)) {
        if (categories.includes(categorySlug)) return editorial;
    }
    return null;
}

export type LandingSlot = "hero" | "about" | "bookings";

export const LANDING_SLOTS: { slot: LandingSlot; field: "heroPhotoId" | "aboutPhotoId" | "bookingsPhotoId"; label: string }[] = [
    { slot: "hero", field: "heroPhotoId", label: "Hero" },
    { slot: "about", field: "aboutPhotoId", label: "About" },
    { slot: "bookings", field: "bookingsPhotoId", label: "Contact" },
];

export interface LandingSettings {
    heroPhotoId: string | null;
    aboutPhotoId: string | null;
    bookingsPhotoId: string | null;
    editorials: Record<string, { coverId: string | null; photoIds: string[] }>;
}
