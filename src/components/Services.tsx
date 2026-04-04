"use client";

import Image from "next/image";
import { memo, useState, useCallback, useEffect } from "react";
import useReveal from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";

// ── Constantes Visuales ───────────────────────────────────────────────────────
const EDITORIAL_ASSETS = [
    {
        issue: "01",
        mainImg: "/flow_kids.avif",
        thumbs: ["/flow_kids2.avif", "/flow_kids3.avif", "/flow_kid4.avif"],
    },
    {
        issue: "02",
        mainImg: "/street2.avif",
        thumbs: ["/street.avif", "/urban.avif", "/culture2.avif", "/cultura.avif", "/street_studio.avif", "/street_studio2.avif"],
    },
    {
        issue: "03",
        mainImg: "/moda2.avif",
        thumbs: ["/moda.avif", "/moda3.avif", "/moda4.avif", "/moda5.avif"],
    },
    {
        issue: "04",
        mainImg: "/rural4.avif",
        thumbs: ["/rural.avif", "/rural2.avif", "/rural3.avif"],
    },
] as const;

// ── Sub-componentes ───────────────────────────────────────────────────────────

/** Lightbox minimalista tipo editorial */
const Lightbox = ({ images, title, onClose }: { images: string[], title: string, onClose: () => void }) => {
    const [index, setIndex] = useState(0);

    // Bloquear scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);

    const next = () => setIndex((prev) => (prev + 1) % images.length);
    const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-fadeIn p-4 md:p-10"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            {/* Header del Lightbox */}
            <header className="absolute top-0 left-0 w-full p-6 flex justify-end items-center z-10">
                <button
                    onClick={onClose}
                    className="text-[#F5F0E8] hover:rotate-90 transition-transform duration-300 p-2 bg-black/20 rounded-full"
                    aria-label="Cerrar galería"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </header>

            {/* Imagen Principal */}
            <div
                className="relative w-full max-w-5xl h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={prev} className="absolute left-0 z-20 p-4 text-white hover:scale-110 transition-transform">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M15 18l-6-6 6-6" /></svg>
                </button>

                <div className="relative w-full h-full animate-fadeUp">
                    <Image
                        src={images[index]}
                        alt={`Slide ${index + 1}`}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <button onClick={next} className="absolute right-0 z-20 p-4 text-white hover:scale-110 transition-transform">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            </div>

            {/* Tiras de control */}
            <footer className="absolute bottom-6 flex gap-3 z-10 px-6 overflow-x-auto max-w-full">
                {images.map((src, i) => (
                    <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                        className={`relative w-12 h-16 md:w-16 md:h-20 border-2 transition-all duration-300 overflow-hidden
                                   ${i === index ? 'border-[#F5F0E8] scale-105' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                    >
                        <Image src={src} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                ))}
            </footer>
        </div>
    );
};

/** Cabecera tipo masthead de revista */
const Masthead = memo(function Masthead() {
    const { t } = useLanguage();
    return (
        <header className="services-masthead mb-20 md:mb-32">
            <div className="masthead-meta">
                <span className="masthead-label">{t.services.mastheadLabel1}</span>
                <span className="masthead-label">{t.services.mastheadLabel2}</span>
                <span className="masthead-label">{t.services.mastheadLabel3}</span>
            </div>

            <div className="masthead-title-wrapper">
                <span className="masthead-ghost" aria-hidden="true">LA</span>
                <h2 className="masthead-title font-gothic">{t.services.title}</h2>
            </div>

            <div className="masthead-rule">
                <div className="masthead-rule-line" aria-hidden="true" />
                <p className="masthead-rule-copy font-mono-urban">
                    {t.services.mastheadRule}
                </p>
            </div>
        </header>
    );
});

/** Spread individual por editorial */
const EditorialSpread = memo(function EditorialSpread({
    issue, tag, title, copy, mainImg, thumbs, pull, flip, onOpen
}: {
    issue: string;
    tag: string;
    title: string;
    copy: string;
    mainImg: string;
    thumbs: readonly string[];
    pull: string;
    flip: boolean;
    onOpen: (allPhotos: string[], name: string) => void;
}) {
    const lines = title.split("\n");
    const pullLines = pull.split("\n");
    const allPhotos = [mainImg, ...thumbs];

    return (
        <article
            className={`spread ${flip ? "spread--flip" : ""} mb-32 md:mb-56 last:mb-0`}
            aria-label={`Editorial ${tag}: ${title.replace("\n", " ")}`}
        >
            <div className="spread-visual group/gallery cursor-pointer" onClick={() => onOpen(allPhotos, title)}>
                <span className="spread-issue font-gothic" aria-hidden="true">
                    {issue}
                </span>

                <div className="spread-main-photo relative aspect-[4/5] overflow-hidden">
                    <Image
                        src={mainImg}
                        alt={title.replace("\n", " ")}
                        fill
                        className="spread-main-img object-cover group-hover/gallery:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 55vw"
                    />
                    <div className="spread-tag-badge" aria-hidden="true">
                        <span className="font-mono-urban">{tag}</span>
                    </div>
                    {/* Hover indicator overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/gallery:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs tracking-widest bg-black/40 px-4 py-2 uppercase font-mono-urban">Explore Story</span>
                    </div>
                </div>

                <div className="spread-strips flex gap-2 mt-4 h-24 md:h-32" aria-hidden="true">
                    {thumbs.slice(0, 3).map((src, i) => (
                        <div key={i} className="spread-strip relative flex-1 overflow-hidden">
                            <Image
                                src={src}
                                alt=""
                                fill
                                className="spread-strip-img object-cover group-hover/gallery:scale-110 transition-transform duration-700 delay-75"
                                sizes="15vw"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="spread-text">
                <h3 className="spread-title font-gothic" aria-label={title.replace("\n", " ")}>
                    {lines.map((line, i) => (
                        <span
                            key={i}
                            className={`spread-title-line ${i > 0 ? 'text-[#8A8A8A] opacity-60' : ''}`}
                            aria-hidden="true"
                        >
                            {line}
                        </span>
                    ))}
                </h3>

                <div className="spread-divider" aria-hidden="true" />

                <p className="spread-copy font-serif">{copy}</p>

                <blockquote className="spread-pull font-gothic" aria-label={pull.replace("\n", " ")}>
                    {pullLines.map((line, i) => (
                        <span key={i} className="spread-pull-line" aria-hidden="true">
                            {line}
                        </span>
                    ))}
                </blockquote>

                <button
                    className="btn-urban spread-cta group"
                    aria-label={`Ver serie completa de ${tag}`}
                    onClick={() => onOpen(allPhotos, title)}
                >
                    <span className="relative z-10 flex items-center gap-3">
                        {tag === "RURAL" || tag === "SALVAJE" ? "VER SERIE →" : "EXPLORAR →"}
                    </span>
                </button>
            </div>
        </article>
    );
});

/** Bloque combo brutalista al final */
const ComboBlock = memo(function ComboBlock() {
    const { t } = useLanguage();
    const WA_COMBO = `https://wa.me/18292971687?text=${t.services.combo.waLink}`;

    return (
        <aside className="combo-block" aria-label="El Combo Cabrón — Sesión + Makeup + Hair">
            <div className="combo-label-wrap">
                <span className="combo-badge font-mono-urban">{t.services.combo.badge}</span>
                <h4 className="combo-title font-gothic">
                    {t.services.combo.title.split('\n').map((line, i) => (
                        <span key={i}>{line}{i === 0 && <br />}</span>
                    ))}
                </h4>
            </div>

            <div className="combo-body">
                <div className="combo-vline" aria-hidden="true" />

                <div className="combo-body-text">
                    <p className="combo-copy font-serif">
                        {t.services.combo.copy1}{" "}
                        <strong className="combo-collab">@cuetobeauty</strong>.{" "}
                        {t.services.combo.copy2}
                    </p>

                    <a
                        href={WA_COMBO}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-urban combo-cta"
                        aria-label="Reservar El Combo Cabrón por WhatsApp"
                    >
                        {t.services.combo.cta}
                    </a>
                </div>
            </div>
        </aside>
    );
});

// ── Componente principal ──────────────────────────────────────────────────────
export default function Services() {
    const { t } = useLanguage();
    const revealRef = useReveal();
    const [viewer, setViewer] = useState<{ open: boolean, images: string[], title: string }>({
        open: false,
        images: [],
        title: ""
    });

    const openGallery = useCallback((images: string[], title: string) => {
        setViewer({ open: true, images, title });
    }, []);

    const closeGallery = useCallback(() => {
        setViewer(v => ({ ...v, open: false }));
    }, []);

    return (
        <section
            id="servicios"
            className="services-section bg-black py-24 md:py-32"
            aria-label="Editoriales — La Carta"
        >
            <div ref={revealRef} className="section-container">
                <Masthead />

                <div className="spreads-stack">
                    {t.services.editoriales.map((ed, idx) => (
                        <EditorialSpread
                            key={ed.issue}
                            {...ed}
                            mainImg={EDITORIAL_ASSETS[idx]?.mainImg || "/flow_kids.avif"}
                            thumbs={EDITORIAL_ASSETS[idx]?.thumbs || []}
                            onOpen={openGallery}
                        />
                    ))}
                </div>

                <ComboBlock />
            </div>

            {/* Galería / Lightbox */}
            {viewer.open && (
                <Lightbox
                    images={viewer.images}
                    title={viewer.title}
                    onClose={closeGallery}
                />
            )}
        </section>
    );
}
