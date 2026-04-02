"use client";

import {
    useState,
    useEffect,
    useCallback,
    useMemo,
    memo,
    useRef,
} from "react";
import Image from "next/image";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface GalleryItem {
    src: string;
    alt: string;
    cat: string;
    tall?: boolean;
    wide?: boolean;
}

// ── Datos estáticos ───────────────────────────────────────────────────────────
const STATIC_CATEGORIES = ["Street", "Moda", "Cultura", "Rural", "Studio"] as const;

const STATIC_ITEMS: GalleryItem[] = [
    { src: "/street2.jpeg", alt: "Escena urbana de calle", cat: "Calle" },
    { src: "/moda.jpeg", alt: "Fotografía de moda editorial", cat: "Moda", tall: true },
    { src: "/cultura.jpeg", alt: "Cultura urbana", cat: "Cultura" },
    { src: "/urban.jpg", alt: "Fotografía urbana — barrio", cat: "Calle", wide: true },
    { src: "/moda2.jpeg", alt: "Editorial de moda — retrato", cat: "Moda", tall: true },
    { src: "/rural.jpeg", alt: "Fotografía rural — paisaje", cat: "Rural" },
    { src: "/moda3.jpeg", alt: "Moda editorial callejera", cat: "Moda" },
    { src: "/street_studio.jpeg", alt: "Retrato de estudio", cat: "Studio" },
    { src: "/moda4.jpeg", alt: "Moda urbana — ambiente", cat: "Moda", wide: true },
    { src: "/rural2.jpeg", alt: "Rural — naturaleza", cat: "Rural" },
    { src: "/urban2.jpg", alt: "Retrato urbano", cat: "Calle", tall: true },
    { src: "/moda5.jpeg", alt: "Editorial de moda", cat: "Moda" },
    { src: "/rural3.jpeg", alt: "Rural — documental", cat: "Rural" },
    { src: "/studio2.jpeg", alt: "Retrato de estudio", cat: "Studio", wide: true },
    { src: "/rural4.jpeg", alt: "Rural — documentación", cat: "Rural" },
    { src: "/flow_kids.jpg", alt: "Cultura — comunidad", cat: "Cultura", tall: true },
    { src: "/flow_kids2.jpg", alt: "Cultura — infancia urbana", cat: "Cultura" },
    { src: "/flow_kids3.jpg", alt: "Cultura — momento espontáneo", cat: "Cultura" },
    { src: "/flow_kid4.jpg", alt: "Cultura — retrato espontáneo", cat: "Cultura" },
];

const ALL_CATEGORIES = ["Todo", ...STATIC_CATEGORIES] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────
function aspectClass(item: GalleryItem) {
    if (item.tall) return "aspect-[3/4]";
    if (item.wide) return "aspect-[16/9]";
    return "aspect-[4/3]";
}

// ── Sub-componentes ───────────────────────────────────────────────────────────
const FilterBar = memo(function FilterBar({
    categories,
    active,
    onChange,
}: {
    categories: string[];
    active: string;
    onChange: (cat: string) => void;
}) {
    return (
        <div
            className="gallery-filters"
            role="tablist"
            aria-label="Filtrar por categoría"
        >
            {categories.map((cat) => (
                <button
                    key={cat}
                    role="tab"
                    aria-selected={active === cat}
                    onClick={() => onChange(cat)}
                    className={`gallery-filter-btn ${active === cat ? "gallery-filter-btn--active" : ""}`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
});

const GalleryCard = memo(function GalleryCard({
    item,
    onOpen,
}: {
    item: GalleryItem;
    onOpen: (item: GalleryItem) => void;
}) {
    return (
        <div
            className={`gallery-card ${aspectClass(item)}`}
            onClick={() => onOpen(item)}
            role="button"
            tabIndex={0}
            aria-label={`Ver imagen: ${item.alt}`}
            onKeyDown={(e) => e.key === "Enter" && onOpen(item)}
        >
            <div className="gallery-card-overlay" aria-hidden="true" />
            <Image
                src={item.src}
                alt={item.alt}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                className="gallery-card-img"
            />
            <div className="gallery-card-hover" aria-hidden="true">
                <span className="gallery-card-tag font-mono-urban">{item.cat}</span>
            </div>
        </div>
    );
});

const Lightbox = memo(function Lightbox({
    item,
    onClose,
}: {
    item: GalleryItem;
    onClose: () => void;
}) {
    // Cerrar con Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        // Bloquear scroll del body
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <div
            className="lightbox"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={item.alt}
        >
            <button
                className="lightbox-close font-mono-urban"
                onClick={onClose}
                aria-label="Cerrar lightbox"
            >
                ✕
            </button>

            {/* Stoppropagate para que click en imagen no cierre */}
            <div
                className="lightbox-img-wrapper"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={item.src}
                    alt={item.alt}
                    width={1400}
                    height={900}
                    className="lightbox-img"
                    priority
                />
            </div>
        </div>
    );
});

// ── Componente principal ──────────────────────────────────────────────────────
export default function Gallery() {
    const [active, setActive] = useState("Todo");
    const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
    const [categories, setCategories] = useState<string[]>([...ALL_CATEGORIES]);
    const [dynItems, setDynItems] = useState<GalleryItem[]>([]);

    // Firebase — carga una sola vez
    useEffect(() => {
        if (!db) return;

        (async () => {
            try {
                const [catSnap, photosSnap] = await Promise.all([
                    getDocs(collection(db, "categories")),
                    getDocs(query(collection(db, "photos"), orderBy("createdAt", "desc"))),
                ]);

                const dynamicCats: string[] = [];
                catSnap.forEach((doc) => dynamicCats.push(doc.data().name as string));
                const merged = Array.from(new Set([...STATIC_CATEGORIES, ...dynamicCats]));
                setCategories(["Todo", ...merged]);

                const dynamicPhotos: GalleryItem[] = [];
                photosSnap.forEach((doc) => {
                    const d = doc.data();
                    dynamicPhotos.push({
                        src: d.src,
                        alt: d.alt,
                        cat: d.cat,
                        tall: d.tall,
                        wide: d.wide,
                    });
                });
                setDynItems(dynamicPhotos);
            } catch (err) {
                console.error("Gallery: error cargando datos de Firebase", err);
            }
        })();
    }, []);

    // Items combinados — recalcula solo cuando dynItems cambia
    const allItems = useMemo(
        () => [...dynItems, ...STATIC_ITEMS],
        [dynItems]
    );

    // Filtrado — recalcula solo cuando active o allItems cambia
    const filtered = useMemo(
        () => active === "Todo" ? allItems : allItems.filter((i) => i.cat === active),
        [active, allItems]
    );

    const openLightbox = useCallback((item: GalleryItem) => setLightbox(item), []);
    const closeLightbox = useCallback(() => setLightbox(null), []);

    return (
        <section
            id="trabajo"
            className="gallery-section"
            aria-label="Portafolio de trabajo"
        >
            <FilterBar
                categories={categories}
                active={active}
                onChange={setActive}
            />

            {/* Masonry grid */}
            <div className="gallery-grid">
                {filtered.map((item, i) => (
                    <GalleryCard
                        key={`${item.src}-${i}`}
                        item={item}
                        onOpen={openLightbox}
                    />
                ))}
            </div>

            {lightbox && (
                <Lightbox item={lightbox} onClose={closeLightbox} />
            )}
        </section>
    );
}