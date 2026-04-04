"use client";

import Image from "next/image";
import { memo, useState, useCallback, useEffect } from "react";
import useReveal from "@/hooks/useReveal";

// ── Constantes ────────────────────────────────────────────────────────────────
const WA_COMBO = "https://wa.me/18292971687?text=Quiero%20reservar%20El%20Combo%20Cabrón";

const SERVICES_LIST = [
    "Fotografía para Bodas",
    "Fotografía BTS (Behind The Scenes)",
    "Fotografía de Eventos",
    "Fotografía de Moda",
    "Fotografía de Conciertos",
    "Fotografía de Cumpleaños"
];

const EDITORIALES = [
    {
        issue: "01",
        tag: "KIDS",
        title: ["The New", "School"],
        copy: "El flow no se enseña. Se lleva en la sangre, se afina en la calle, se revela en la mirada antes de aprender a caminar. Esta serie documenta a la nueva generación del asfalto — los que ya nacieron sabiendo que la calle es suya.",
        sub: "Porque el estilo más puro es el que todavía no conoce las reglas.",
        pull: ["«La calle", "no miente»"],
        mainImg: "/flow_kids.avif",
        thumbs: ["/flow_kids2.avif", "/flow_kids3.avif", "/flow_kid4.avif"],
        flip: false,
    },
    {
        issue: "02",
        tag: "URBAN",
        title: ["Cultura", "Street"],
        copy: "Entre humo, concreto y miradas que no negocian lo que son. Esta es la sintaxis del bajo mundo: cruda, honesta, con orgullo.",
        sub: "Cada disparo es evidencia. Cada esquina, territorio.",
        pull: ["«Cada esquina", "es un estudio»"],
        mainImg: "/street2.avif",
        thumbs: ["/street.avif", "/street_studio.avif", "/cultura.avif", "/culture2.avif", "/street_studio2.avif"],
        flip: true,
    },
    {
        issue: "03",
        tag: "Moda",
        title: ["Editorial", "& Moda"],
        copy: "La calle deja de ser fondo y se convierte en discurso. Entre concreto, tránsito y ruido, la prenda encuentra otra forma de decir quién es. Aquí la moda no adorna: se enfrenta, se adapta y se afirma.",
        sub: "Donde la identidad se porta con orgullo.",
        pull: ["«Pasarela", "disruptiva»"],
        mainImg: "/moda2.avif",
        thumbs: ["/moda.avif", "/moda3.avif", "/moda4.avif", "/moda5.avif"],
        flip: false,
    },
    {
        issue: "04",
        tag: "RURAL",
        title: ["Salvaje"],
        copy: "Donde el asfalto se rinde y empieza la tierra, la esencia respira diferente. Lejos del ruido, la belleza más brutal es la que no pidió permiso. Esta serie es un viaje al borde — al lugar donde somos parte de algo que nos trasciende.",
        sub: "La naturaleza es arte por si misma.",
        pull: ["«Cimarronaje", "libertad»"],
        mainImg: "/rural4.avif",
        thumbs: ["/rural2.avif", "/rural3.avif", "/rural.avif"],
        flip: false,
    },
] as const;

// ── Masthead ──────────────────────────────────────────────────────────────────
const Masthead = memo(function Masthead() {
    return (
        <header className="services-masthead">
            <div className="masthead-meta">
                <span className="masthead-label">EDICIÓN</span>
                <span className="masthead-label">2026</span>
                <span className="masthead-label">VOL. I</span>
            </div>

            <div className="masthead-title-wrapper ml-4">
                <span className="masthead-ghost font-['Sedgwick_Ave_Display'] tracking-wider transform -rotate-2" aria-hidden="true" style={{ opacity: 0.5 }}>La</span>
                <h3 
                    className="masthead-title font-['Sedgwick_Ave_Display'] tracking-wider transform -rotate-2"
                    style={{ 
                        color: "#F5F0E8", 
                        WebkitTextStroke: "2px #D49B72",
                        textShadow: "6px 6px 0px rgba(212, 155, 114, 0.5)" 
                    }}
                >
                    Muestra
                </h3>
            </div>

            <div className="masthead-footer">
                <div className="masthead-rule-line" aria-hidden="true" />
                <p className="masthead-rule-copy font-mono-urban">
                    Series — Que narran — Historias
                </p>
                <div className="masthead-rule-line masthead-rule-line--short" aria-hidden="true" />
            </div>
        </header>
    );
});

// ── Carousel Modal ────────────────────────────────────────────────────────────
const CarouselModal = memo(function CarouselModal({
    images,
    onClose,
}: {
    images: string[];
    onClose: () => void;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose, next, prev]);

    return (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md flex items-center justify-center animate-fadeIn" onClick={onClose}>
            <button className="absolute top-6 right-6 text-[#F5F0E8] text-2xl p-4 hover:text-[#8A8A8A] transition-colors z-[1010]" onClick={onClose} aria-label="Cerrar">✕</button>

            <div className="relative w-full max-w-[90vw] h-[80vh] flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                <Image
                    src={images[currentIndex]}
                    alt={`Foto ${currentIndex + 1}`}
                    fill
                    className="object-contain animate-fadeIn"
                    sizes="90vw"
                    priority
                />
            </div>

            {images.length > 1 && (
                <>
                    <button className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-[#F5F0E8] text-5xl p-4 hover:text-[#8A8A8A] transition-colors z-[1010]" onClick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
                    <button className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-[#F5F0E8] text-5xl p-4 hover:text-[#8A8A8A] transition-colors z-[1010]" onClick={(e) => { e.stopPropagation(); next(); }}>›</button>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-[1010]" onClick={(e) => e.stopPropagation()}>
                        {images.map((_, i) => (
                            <button
                                key={i}
                                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentIndex ? "bg-[#F5F0E8]" : "bg-[#222222] hover:bg-[#8A8A8A]"}`}
                                onClick={() => setCurrentIndex(i)}
                                aria-label={`Ir a foto ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
});

// ── Editorial Spread ──────────────────────────────────────────────────────────
type Editorial = (typeof EDITORIALES)[number];

const EditorialSpread = memo(function EditorialSpread({
    issue, tag, title, copy, sub, mainImg, thumbs, pull, flip,
}: Editorial) {
    const [carouselOpen, setCarouselOpen] = useState(false);
    const allImages = [mainImg, ...thumbs];

    return (
        <>
            <article
                className={`spread ${flip ? "spread--flip" : ""}`}
                aria-label={`Editorial ${tag}: ${title.join(" ")}`}
            >
                {/* ── Visual ── */}
                <div className="spread-visual">
                    <span className="spread-issue font-gothic" aria-hidden="true">{issue}</span>

                    <div className="spread-main-photo">
                        <Image
                            src={mainImg}
                            alt={title.join(" ")}
                            fill
                            className="spread-main-img"
                            sizes="(max-width: 1024px) 100vw, 55vw"
                        />
                        <div className="spread-tag-badge">
                            <span className="font-mono-urban">{tag}</span>
                        </div>
                        {/* Gradiente inferior para legibilidad en mobile */}
                        <div className="spread-photo-gradient" aria-hidden="true" />
                    </div>

                    {/* Tiras */}
                    <div className="spread-strips" aria-hidden="true">
                        {thumbs.slice(0, 3).map((src, i) => (
                            <div key={i} className="spread-strip">
                                <Image src={src} alt="" fill className="spread-strip-img" sizes="15vw" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Texto ── */}
                <div className="spread-text">
                    {/* Issue mobile */}
                    <span className="spread-issue-mobile font-mono-urban" aria-hidden="true">
                        {issue} / {tag}
                    </span>

                    <h3 
                        className="spread-title font-['Sedgwick_Ave_Display'] transform -rotate-2 mb-6" 
                        aria-label={title.join(" ")}
                    >
                        {title.map((line, i) => (
                            <span 
                                key={i} 
                                className={`spread-title-line tracking-wider ${i === 1 ? "md:pl-16 pl-6 mt-[-0.2em]" : ""}`} 
                                aria-hidden="true"
                                style={{ 
                                    color: "#F5F0E8", 
                                    WebkitTextStroke: "2px #D49B72",
                                    textShadow: "6px 6px 0px rgba(212, 155, 114, 0.5)" 
                                }}
                            >
                                {line}
                            </span>
                        ))}
                    </h3>

                    <div className="spread-divider" aria-hidden="true" />

                    <p className="spread-copy font-serif">{copy}</p>
                    <p className="spread-sub font-mono-urban">{sub}</p>

                    <blockquote
                        className="spread-pull font-['Sedgwick_Ave_Display'] tracking-wider"
                        aria-label={pull.join(" ")}
                        style={{ 
                            opacity: 0.45,
                            color: "#E52A2A", 
                            WebkitTextStroke: "1px #8a1313",
                            textShadow: "2px 2px 0px rgba(138, 19, 19, 0.4)"
                        }}
                    >
                        {pull.map((line, i) => (
                            <span key={i} className={`spread-pull-line ${i === 1 ? "pl-4 md:pl-8" : ""}`} aria-hidden="true">{line}</span>
                        ))}
                    </blockquote>

                    <button
                        className="btn-urban spread-cta"
                        aria-label={`Ver serie completa de ${tag}`}
                        onClick={() => setCarouselOpen(true)}
                    >
                        VER SERIE →
                    </button>
                </div>
            </article>

            {carouselOpen && (
                <CarouselModal images={allImages} onClose={() => setCarouselOpen(false)} />
            )}
        </>
    );
});

// ── Combo Block ───────────────────────────────────────────────────────────────
const ComboBlock = memo(function ComboBlock() {
    return (
        <aside className="combo-block" aria-label="El Combo Cabrón">
            <div className="combo-label-wrap">
                <span className="combo-badge font-mono-urban">Exclusive Collab</span>
                <h4 
                    className="combo-title font-['Sedgwick_Ave_Display'] tracking-wider transform -rotate-2 mt-4 px-2"
                    style={{ 
                        color: "#F5F0E8", 
                        WebkitTextStroke: "1px #D49B72",
                        textShadow: "3px 3px 0px rgba(212, 155, 114, 0.5)",
                        lineHeight: 0.95
                    }}
                >
                    El Combo<br />
                    <span className="inline-block mt-2 ml-4">Cabrón</span>
                </h4>
            </div>

            <div className="combo-body">
                <div className="combo-vline" aria-hidden="true" />
                <div className="combo-body-text">
                    <p className="combo-copy font-serif">
                        No te estreses — solo ven con todo el concepto. Sesión completa + Makeup + Hair con{" "}
                        <a href="https://www.instagram.com/cuetobeauty/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                            <strong className="combo-collab">@cuetobeauty</strong>
                        </a>. Dos artistas, un resultado: la versión más brutal de ti mismo frente a la cámara. Porque el flow se construye centimetro a centimetro.
                    </p>
                    <p className="combo-sub font-mono-urban">
                        Plazas limitadas — primera cita, primer disparo.
                    </p>

                    <a href={WA_COMBO}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-urban combo-cta"
                        aria-label="Reservar El Combo Cabrón por WhatsApp"
                    >
                        RESERVAR ESPACIO
                    </a>
                </div>
            </div>
        </aside>
    );
});

// ── Componente principal ──────────────────────────────────────────────────────
export default function Services() {
    const revealRef = useReveal();

    return (
        <section
            id="servicios"
            className="services-section"
            aria-label="Editoriales — La Carta"
        >
            <div ref={revealRef} className="section-container">
                {/* Especialidades */}
                <div className="mb-20 md:mb-32 max-w-4xl">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="font-mono-urban text-[#8A8A8A]">— Especialidades</span>
                        <div className="h-[1px] flex-1 bg-[#222]"></div>
                    </div>
                    <ul className="flex flex-wrap gap-3 md:gap-4">
                        {SERVICES_LIST.map((service, idx) => (
                            <li 
                                key={idx} 
                                className="border border-[#222] bg-[#0a0a0a] text-[#F5F0E8] px-5 py-3 md:px-6 md:py-3.5 text-sm md:text-base font-serif italic tracking-wide rounded-full hover:bg-[#F5F0E8] hover:text-black hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(245,240,232,0.15)] transition-all duration-300 cursor-default"
                            >
                                {service}
                            </li>
                        ))}
                    </ul>
                </div>

                <Masthead />
                <div className="spreads-stack">
                    {EDITORIALES.map((ed) => (
                        <EditorialSpread key={ed.issue} {...ed} />
                    ))}
                </div>
                <ComboBlock />
            </div>
        </section>
    );
}

