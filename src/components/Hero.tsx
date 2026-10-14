"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { LandingImage } from "@/lib/landing";

// Foto de respaldo si Firestore no responde o no hay foto elegida
const FALLBACK_SRC = "/Hero.avif";

// ── Sub-componentes ───────────────────────────────────────────────────────────
const HeroBackground = memo(function HeroBackground({ src }: { src: string }) {
    return (
        <div className="hero-bg-container" aria-hidden="true">
            <Image
                src={src}
                alt=""                      // decorativo: aria-label en <section> describe el contexto
                fill
                preload                     // LCP de la página
                className="hero-image"
                sizes="100vw"
            />
            <div className="hero-overlay-gradient" />
            <div className="hero-overlay-radial" />
        </div>
    );
});

// ── Componente principal ──────────────────────────────────────────────────────
export default function Hero({ photo }: { photo: LandingImage | null }) {
    const { t } = useLanguage();

    return (
        <section id="hero" className="hero-section" aria-label="Portada">
            <HeroBackground src={photo?.src ?? FALLBACK_SRC} />

            <div className="section-container relative z-40 h-full flex flex-col justify-center">
                <div className="hero-content-wrapper">
                    <div className="hero-eyebrow animate-fadeUp">
                        <span className="hero-line" aria-hidden="true" />
                        <p className="font-mono-urban text-bone/80">{t.hero.eyebrow}</p>
                    </div>

                    <h1 className="font-gothic hero-title animate-fadeUp [animation-delay:0.2s]">
                        {t.hero.title.split(" ").slice(0, 2).join(" ")}
                        <br className="hidden sm:block" />
                        {t.hero.title.split(" ").slice(2).join(" ")}
                    </h1>

                    <div className="hero-subtitle-container animate-fadeUp [animation-delay:0.4s]">
                        <p className="hero-subtitle">
                            {t.hero.services.map((service, i) => (
                                <span key={service}>
                                    {service}
                                    {i < t.hero.services.length - 1 && (
                                        <span className="hero-separator" aria-hidden="true"> / </span>
                                    )}
                                </span>
                            ))}
                        </p>
                    </div>
                    
                    <div className="hero-actions animate-fadeUp [animation-delay:0.6s]">
                        <Link href="/portafolio" className="btn-urban">
                            {t.hero.cta1}
                        </Link>

                        <Link href="/#contacto"
                            className="btn-urban-outline"
                            aria-label="Ir a la sección de contacto para reservar"
                        >
                            {t.hero.cta2}
                        </Link>
                    </div >
                </div>
            </div>

            <div className="hero-scroll-indicator animate-fadeIn" aria-hidden="true">
                <span className="font-mono-urban text-cement uppercase text-[10px] tracking-widest">
                    {t.hero.scroll}
                </span>
                <div className="scroll-line-wrapper">
                    <div className="scroll-line-active" />
                </div>
            </div>

            {/* Textura de Grano */}
            <div className="grain-layer" aria-hidden="true" />
        </section>
    );
}
