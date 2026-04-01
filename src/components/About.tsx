"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";
import useReveal from "@/hooks/useReveal";

// ── Constantes ────────────────────────────────────────────────────────────────
const WA_TEXT = encodeURIComponent(
    "Klk mio, me gustaria agendar una sesion de fotos"
);
const WA_LINK = `https://wa.me/18292971687?text=${WA_TEXT}`;

const INGREDIENTES = [
    { label: "Calle", value: "50%" },
    { label: "Actitud", value: "30%" },
    { label: "Luz", value: "20%" },
] as const;

// ── Sub-componentes ───────────────────────────────────────────────────────────
const ChefImage = memo(function ChefImage() {
    return (
        <div className="chef-image-wrapper animate-fadeUp">
            <div className="chef-image-frame" aria-hidden="true" />
            <div className="chef-image-container">
                <Image
                    src="/about.jpeg"
                    alt="Edwin — El Chef de las Fotos"
                    fill
                    className="chef-photo"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
            <div className="corner-accent-top" aria-hidden="true" />
            <div className="corner-accent-left" aria-hidden="true" />
            <div className="chef-image-shadow" aria-hidden="true" />
        </div>
    );
});

type Ingrediente = (typeof INGREDIENTES)[number];

const IngredienteRow = memo(function IngredienteRow({ label, value }: Ingrediente) {
    return (
        <div className="ingredient-item">
            <div className="ingredient-info">
                <span className="ingredient-label">{label}</span>
                <span className="ingredient-value">{value}</span>
            </div>
            <div
                className="ingredient-bar-bg"
                role="meter"
                aria-label={`${label}: ${value}`}
                aria-valuenow={parseInt(value)}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div className="ingredient-bar-fill" style={{ width: value }} />
            </div>
        </div>
    );
});

const Ingredientes = memo(function Ingredientes() {
    return (
        <div className="ingredients-container animate-fadeUp [animation-delay:800ms]">
            <p className="ingredients-title">Ingredientes:</p>
            <div className="ingredients-grid">
                {INGREDIENTES.map((ing) => (
                    <IngredienteRow key={ing.label} {...ing} />
                ))}
            </div>
        </div>
    );
});

const ChefText = memo(function ChefText() {
    return (
        <div className="chef-text-content">
            <p className="chef-eyebrow animate-fadeUp [animation-delay:200ms]">
                — Edwin De Leon
            </p>

            <h2 className="chef-name font-gothic animate-fadeUp [animation-delay:400ms]">

                <span className="chef-name-sep" aria-hidden="true">/</span>{" "}
                El Chef
            </h2>

            <div className="chef-description animate-fadeUp [animation-delay:600ms]">
                <p className="font-serif">
                    Nací en la calle y aprendí a ver con la cámara. Mi trabajo captura
                    la tensión entre lo efímero y lo eterno — el instante en que una
                    esquina cualquiera se convierte en escenario.
                </p>
                <p className="font-serif italic text-bone">
                    Trabajo con marcas, artistas y comunidades. Desde editoriales de
                    moda hasta documentales rurales; siempre con la misma honestidad
                    visual.
                </p>
            </div>

            <Ingredientes />

            <div className="animate-fadeUp [animation-delay:1000ms]">

                <a href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-urban"
                    aria-label="Contactar a Edwin por WhatsApp"
                >
                    Trabajemos →
                </a>
            </div>
        </div>
    );
});

// ── Componente principal ──────────────────────────────────────────────────────
export default function About() {
    const ref = useReveal();

    return (
        <section id="chef" className="chef-section" aria-label="Edwin — El Chef">
            <div className="grain-layer" aria-hidden="true" />

            <div ref={ref} className="section-container chef-grid">
                <ChefImage />
                <ChefText />
            </div>
        </section>
    );
}
