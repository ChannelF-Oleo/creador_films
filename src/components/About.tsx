"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState, useRef, useEffect } from "react";
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
                    src="/about.avif"
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
    const [count, setCount] = useState(0);
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const targetValue = parseInt(value);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!visible) return;
        
        let startTime: number | null = null;
        const duration = 1500;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // easeOutQuart 
            const ease = 1 - Math.pow(1 - percentage, 4);
            setCount(Math.floor(ease * targetValue));

            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                setCount(targetValue);
            }
        };
        requestAnimationFrame(animate);
    }, [visible, targetValue]);

    return (
        <div className="ingredient-item" ref={ref}>
            <div className="ingredient-info">
                <span className="ingredient-label">{label}</span>
                <span className="ingredient-value">{count}%</span>
            </div>
            <div
                className="ingredient-bar-bg"
                role="meter"
                aria-label={`${label}: ${value}`}
                aria-valuenow={count}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div 
                    className="h-full bg-[#F5F0E8] transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]" 
                    style={{ width: visible ? value : "0%" }} 
                />
            </div>
        </div>
    );
});

const Ingredientes = memo(function Ingredientes() {
    return (
        <div className="ingredients-container animate-fadeUp [animation-delay:800ms]">
            <p 
                className="font-['Sedgwick_Ave_Display'] text-[2.2rem] mb-8 tracking-wider transform -rotate-2"
                style={{ 
                    color: "#F5F0E8", 
                    WebkitTextStroke: "1px #D49B72",
                    textShadow: "3px 3px 0px rgba(212, 155, 114, 0.5)" 
                }}
            >
                Ingredientes:
            </p>
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
            <div className="relative inline-block self-start mb-10 mt-4 animate-fadeUp [animation-delay:200ms] w-full max-w-max">
                <h2 style={{ fontFamily: "'Yeseva One', serif" }} className="text-[#D49B72] text-[clamp(4.5rem,10vw,7rem)] leading-none m-0 p-0 tracking-tight uppercase">
                    Edwin
                </h2>
                <div 
                    className="absolute -bottom-6 left-[25%] md:left-[35%] text-[clamp(1.6rem,3vw,2.2rem)] whitespace-nowrap rotate-[-4deg] z-10 font-['Sedgwick_Ave_Display']"
                    style={{ 
                        color: "#F5F0E8", 
                        WebkitTextStroke: "1px #D49B72",
                        textShadow: "3px 3px 0px rgba(212, 155, 114, 0.5)" 
                    }}
                >
                    el chef de las fotos
                </div>
            </div>

            <div className="chef-description animate-fadeUp [animation-delay:600ms]">
                <p className="font-serif">
                    Mi trabajo captura la tensión entre lo efímero y lo eterno — el instante en que una
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
