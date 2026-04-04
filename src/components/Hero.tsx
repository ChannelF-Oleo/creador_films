"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

// ── Constantes ────────────────────────────────────────────────────────────────
const WA_TEXT = encodeURIComponent(
    "Klk mio, me gustaria agendar una sesion de fotos"
);
const WA_LINK = `https://wa.me/18292971687?text=${WA_TEXT}`;

const SERVICES = ["Fotografía Documental", "Editorial", "Moda Urbana"] as const;

// ── Sub-componentes ───────────────────────────────────────────────────────────
const HeroBackground = memo(function HeroBackground() {
    return (
        <div className="hero-bg-container" aria-hidden="true">
            <Image
                src="/Hero.avif"
                alt=""                      // decorativo: aria-label en <section> describe el contexto
                fill
                priority
                fetchPriority="high"        // hint explícito al navegador
                className="hero-image"
                sizes="100vw"
            />
            <div className="hero-overlay-gradient" />
            <div className="hero-overlay-radial" />
        </div>
    );
});

const HeroEyebrow = memo(function HeroEyebrow() {
    return (
        <div className="hero-eyebrow animate-fadeUp">
            <span className="hero-line" aria-hidden="true" />
            <p className="font-mono-urban text-bone/80">Estética del Asfalto</p>
        </div>
    );
});


const HeroServices = memo(function HeroServices() {
    return (
        <div className="hero-subtitle-container animate-fadeUp [animation-delay:0.4s]">
            <p className="hero-subtitle">
                {SERVICES.map((service, i) => (
                    <span key={service}>
                        {service}
                        {i < SERVICES.length - 1 && (
                            <span className="hero-separator" aria-hidden="true"> / </span>
                        )}
                    </span>
                ))}
            </p>
        </div>
    );
});

const HeroActions = memo(function HeroActions() {
    return (
        <div className="hero-actions animate-fadeUp [animation-delay:0.6s]">
            <Link href="/portafolio" className="btn-urban">
                Ver Portafolio
            </Link>

            <a href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-urban-outline"
                aria-label="Agendar sesión por WhatsApp"
            >
                Agendar Sesión
            </a>
        </div >
    );
});

const ScrollIndicator = memo(function ScrollIndicator() {
    return (
        <div className="hero-scroll-indicator animate-fadeIn" aria-hidden="true">
            <span className="font-mono-urban text-cement uppercase text-[10px] tracking-widest">
                Scroll
            </span>
            <div className="scroll-line-wrapper">
                <div className="scroll-line-active" />
            </div>
        </div>
    );
});

// ── Componente principal ──────────────────────────────────────────────────────
export default function Hero() {
    return (
        <section id="hero" className="hero-section" aria-label="Portada">
            <HeroBackground />

            <div className="section-container relative z-40 h-full flex flex-col justify-center">
                <div className="hero-content-wrapper">
                    <HeroEyebrow />

                    <h1 className="font-gothic hero-title animate-fadeUp [animation-delay:0.2s]">
                        El chef{" "}
                        <br className="hidden sm:block" />
                        de las fotos
                    </h1>

                    <HeroServices />
                    <HeroActions />
                </div>
            </div>

            <ScrollIndicator />

            {/* Textura de Grano */}
            <div className="grain-layer" aria-hidden="true" />
        </section>
    );
}
