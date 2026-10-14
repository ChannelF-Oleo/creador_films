"use client";

import Image from "next/image";
import { memo, useState, useCallback } from "react";
import useReveal from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";
import Lightbox from "@/components/Lightbox";
import type { Landing, LandingImage } from "@/lib/landing";

// ── Sub-componentes ───────────────────────────────────────────────────────────

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
    slug, issue, tag, title, copy, cover, photos, pull, flip, onOpen
}: {
    slug: string;
    issue: string;
    tag: string;
    title: string;
    copy: string;
    cover: LandingImage;
    photos: LandingImage[];
    pull: string;
    flip: boolean;
    onOpen: (slug: string, index: number) => void;
}) {
    const lines = title.split("\n");
    const pullLines = pull.split("\n");

    return (
        <article
            className={`spread ${flip ? "spread--flip" : ""} mb-32 md:mb-56 last:mb-0`}
            aria-label={`Editorial ${tag}: ${title.replace("\n", " ")}`}
        >
            <div className="spread-visual group/gallery cursor-pointer" onClick={() => onOpen(slug, 0)}>
                <span className="spread-issue font-gothic" aria-hidden="true">
                    {issue}
                </span>

                <div className="spread-main-photo relative aspect-[4/5] overflow-hidden">
                    <Image
                        src={cover.src}
                        alt={cover.alt || title.replace("\n", " ")}
                        fill
                        className="spread-main-img"
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
                    {photos.slice(0, 3).map((photo) => (
                        <div key={photo.id} className="spread-strip relative flex-1 overflow-hidden">
                            <Image
                                src={photo.src}
                                alt=""
                                fill
                                className="spread-strip-img"
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
                    onClick={() => onOpen(slug, 0)}
                >
                    <span className="relative z-10 flex items-center gap-3">
                        {tag === "RURAL" ? "VER SERIE →" : "EXPLORAR →"}
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
export default function Services({ editorials }: { editorials: Landing["editorials"] }) {
    const { t } = useLanguage();
    const revealRef = useReveal();
    const [viewer, setViewer] = useState<{ slug: string; index: number } | null>(null);

    const openGallery = useCallback((slug: string, index: number) => setViewer({ slug, index }), []);
    const closeGallery = useCallback(() => setViewer(null), []);
    const changeIndex = useCallback((index: number) => setViewer((v) => (v ? { ...v, index } : v)), []);

    // Solo las editoriales con fotos; el número y el lado salen de la posición
    const spreads = t.services.editoriales.filter((ed) => editorials[ed.slug]);
    const viewerSeries = viewer ? editorials[viewer.slug] : undefined;

    return (
        <section
            id="servicios"
            className="services-section bg-black py-24 md:py-32"
            aria-label="Editoriales — La Carta"
        >
            <div ref={revealRef} className="section-container">
                <Masthead />

                <div className="spreads-stack">
                    {spreads.map((ed, idx) => (
                        <EditorialSpread
                            key={ed.slug}
                            {...ed}
                            issue={String(idx + 1).padStart(2, "0")}
                            flip={idx % 2 === 1}
                            cover={editorials[ed.slug].cover}
                            photos={editorials[ed.slug].photos}
                            onOpen={openGallery}
                        />
                    ))}
                </div>

                <ComboBlock />
            </div>

            {viewer && viewerSeries && (
                <Lightbox
                    items={[viewerSeries.cover, ...viewerSeries.photos]}
                    index={viewer.index}
                    onIndexChange={changeIndex}
                    onClose={closeGallery}
                    label={t.services.editoriales.find((ed) => ed.slug === viewer.slug)?.title.replace("\n", " ")}
                />
            )}
        </section>
    );
}
