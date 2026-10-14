"use client";

import { useState, useEffect, useCallback, useMemo, memo, useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import Lightbox from "@/components/Lightbox";
import PhotoTools from "@/components/PhotoTools";
import useAdmin from "@/hooks/useAdmin";
import { auth } from "@/lib/firebase";
import { editorialForCategory, type LandingSettings } from "@/lib/editorials";
import type { Category, Photo } from "@/lib/portfolio";

// ── Constantes ────────────────────────────────────────────────────────────────
const ALL = "todo";
/** Proporción provisional para fotos que aún no tienen medidas guardadas */
const FALLBACK_RATIO = 4 / 5;
/** Columnas por ancho de pantalla; deben coincidir con las media queries de .masonry--N */
const COLUMN_COUNTS = [1, 2, 3] as const;
const SIZES = "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw";

// ── Helpers ───────────────────────────────────────────────────────────────────
const ratioOf = (p: Photo) => (p.width && p.height ? p.width / p.height : FALLBACK_RATIO);

/**
 * Reparte las fotos en columnas poniendo cada una en la columna más baja.
 * Así el orden se lee de izquierda a derecha, a diferencia de CSS `columns`.
 */
function toColumns(photos: Photo[], count: number) {
    const columns: { photo: Photo; index: number }[][] = Array.from({ length: count }, () => []);
    const heights = new Array(count).fill(0);
    photos.forEach((photo, index) => {
        const shortest = heights.indexOf(Math.min(...heights));
        columns[shortest].push({ photo, index });
        heights[shortest] += 1 / ratioOf(photo);
    });
    return columns;
}

/** "Todo" alterna categorías para que no salgan todas las de una serie seguidas. */
function interleave(categories: Category[], photos: Photo[]) {
    const groups = categories.map((c) => photos.filter((p) => p.categoryId === c.id));
    const result: Photo[] = [];
    for (let i = 0; groups.some((g) => i < g.length); i++) {
        groups.forEach((g) => { if (i < g.length) result.push(g[i]); });
    }
    // Fotos cuya categoría no existe: al final, para que no desaparezcan
    const known = new Set(categories.map((c) => c.id));
    return [...result, ...photos.filter((p) => !p.categoryId || !known.has(p.categoryId))];
}

const photoParam = () => new URLSearchParams(window.location.search).get("foto");

function setPhotoParam(id: string | null, mode: "push" | "replace") {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("foto", id);
    else url.searchParams.delete("foto");
    window.history[mode === "push" ? "pushState" : "replaceState"](window.history.state, "", url);
}

// ── Sub-componentes ───────────────────────────────────────────────────────────
const FilterBar = memo(function FilterBar({
    categories,
    active,
    onChange,
}: {
    categories: { id: string; name: string }[];
    active: string;
    onChange: (id: string) => void;
}) {
    return (
        <div className="gallery-filters" role="tablist" aria-label="Filtrar por categoría">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    role="tab"
                    aria-selected={active === cat.id}
                    onClick={() => onChange(cat.id)}
                    className={`gallery-filter-btn ${active === cat.id ? "gallery-filter-btn--active" : ""}`}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
});

const GalleryCard = memo(function GalleryCard({
    photo,
    index,
    tag,
    onOpen,
    tools,
}: {
    photo: Photo;
    index: number;
    tag: string;
    onOpen: (index: number) => void;
    /** Barra de edición, solo con la sesión del admin */
    tools?: ReactNode;
}) {
    const hasSize = photo.width !== null && photo.height !== null;

    return (
        <div className={`gallery-item ${photo.hidden ? "gallery-item--hidden" : ""}`}>
            <button
                type="button"
                className="gallery-card"
                style={hasSize ? undefined : { aspectRatio: FALLBACK_RATIO }}
                onClick={() => onOpen(index)}
                aria-label={`Ver imagen: ${photo.alt}`}
            >
                {hasSize ? (
                    <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={photo.width!}
                        height={photo.height!}
                        sizes={SIZES}
                        className="gallery-card-img"
                    />
                ) : (
                    <Image src={photo.src} alt={photo.alt} fill sizes={SIZES} className="gallery-card-img object-cover" />
                )}
                {tag && (
                    <span className="gallery-card-hover" aria-hidden="true">
                        <span className="gallery-card-tag font-mono-urban">{tag}</span>
                    </span>
                )}
                {photo.hidden && <span className="gallery-card-hidden font-mono-urban">Oculta</span>}
            </button>
            {tools}
        </div>
    );
});

// ── Componente principal ──────────────────────────────────────────────────────
export default function Gallery({
    categories,
    photos: allPhotos,
    landing,
}: {
    categories: Category[];
    /** Incluye las ocultas: solo el admin las ve */
    photos: Photo[];
    landing: LandingSettings;
}) {
    const { user, busy, act } = useAdmin();
    const photos = useMemo(() => (user ? allPhotos : allPhotos.filter((p) => !p.hidden)), [user, allPhotos]);
    const [active, setActive] = useState(ALL);
    const [open, setOpen] = useState<number | null>(null);
    /** true si el visor añadió una entrada al historial, para cerrarlo con "atrás" */
    const pushedRef = useRef(false);

    // Solo categorías con al menos una foto, en el orden guardado
    const filters = useMemo(() => {
        const used = categories.filter((c) => photos.some((p) => p.categoryId === c.id));
        return [{ id: ALL, name: "Todo" }, ...used];
    }, [categories, photos]);

    const nameById = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);
    const editorialById = useMemo(
        () => new Map(categories.map((c) => [c.id, editorialForCategory(c.slug)])),
        [categories]
    );

    const filtered = useMemo(
        () => (active === ALL ? interleave(categories, photos) : photos.filter((p) => p.categoryId === active)),
        [active, categories, photos]
    );

    const layouts = useMemo(
        () => COLUMN_COUNTS.map((count) => ({ count, columns: toColumns(filtered, count) })),
        [filtered]
    );

    const openAt = useCallback((index: number) => {
        setOpen(index);
        setPhotoParam(filtered[index].id, "push");
        pushedRef.current = true;
    }, [filtered]);

    const changeIndex = useCallback((index: number) => {
        setOpen(index);
        setPhotoParam(filtered[index].id, "replace");
    }, [filtered]);

    const close = useCallback(() => {
        if (pushedRef.current) {
            // Vuelve a la entrada anterior; el popstate cierra el visor
            window.history.back();
        } else {
            setPhotoParam(null, "replace");
            setOpen(null);
        }
    }, []);

    // Enlace directo (?foto=id) y botón "atrás"
    useEffect(() => {
        const sync = () => {
            const id = photoParam();
            const index = id ? filtered.findIndex((p) => p.id === id) : -1;
            if (index === -1) pushedRef.current = false;
            setOpen(index === -1 ? null : index);
        };
        sync();
        window.addEventListener("popstate", sync);
        return () => window.removeEventListener("popstate", sync);
        // Solo al montar: un cambio de filtro no debe reabrir el visor
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeFilter = useCallback((id: string) => {
        setActive(id);
        setOpen(null);
    }, []);

    return (
        <section id="trabajo" className="gallery-section" aria-label="Portafolio de trabajo">
            {user && (
                <div className="gallery-admin-bar font-mono-urban">
                    <span>Modo edición</span>
                    <Link href="/admin/dashboard">Subir fotos y categorías</Link>
                    <button onClick={() => signOut(auth)}>Cerrar sesión</button>
                </div>
            )}

            <FilterBar categories={filters} active={active} onChange={changeFilter} />

            {/* Una maqueta por número de columnas; CSS muestra solo la que corresponde */}
            {layouts.map(({ count, columns }) => (
                <div key={count} className={`masonry masonry--${count}`}>
                    {columns.map((column, c) => (
                        <div key={c} className="masonry-column">
                            {column.map(({ photo, index }) => (
                                <GalleryCard
                                    key={photo.id}
                                    photo={photo}
                                    index={index}
                                    tag={active === ALL ? nameById.get(photo.categoryId ?? "") ?? "" : ""}
                                    onOpen={openAt}
                                    tools={user && (
                                        <PhotoTools
                                            photo={photo}
                                            editorial={editorialById.get(photo.categoryId ?? "") ?? null}
                                            landing={landing}
                                            busy={busy}
                                            act={act}
                                        />
                                    )}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            ))}

            {open !== null && filtered[open] && (
                <Lightbox items={filtered} index={open} onIndexChange={changeIndex} onClose={close} />
            )}
        </section>
    );
}
