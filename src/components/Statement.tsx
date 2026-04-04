"use client";

import useReveal from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";

export default function Statement() {
    const { t, lang } = useLanguage();
    const ref = useReveal();

    return (
        <section
            id="statement"
            className="min-h-dvh flex items-center px-8 md:px-16 bg-[#0a0a0a]"
            aria-label="Artistic Statement"
        >
            <div className="max-w-[900px] mx-auto w-full flex flex-col items-center gap-10" ref={ref}>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#8A8A8A] to-transparent" />
                <blockquote 
                    className="font-['Sedgwick_Ave_Display'] text-[clamp(2rem,6vw,4rem)] text-center leading-[1.2] tracking-wider transform -rotate-2 my-8"
                    style={{ 
                        opacity: 0.95,
                        color: "#F5F0E8", 
                        WebkitTextStroke: "2px #8A8A8A",
                        textShadow: "6px 6px 0px rgba(138, 138, 138, 0.4)"
                    }}
                >
                    &ldquo;
                    {lang === 'es' ? (
                        <>Nada es casual en la calle.<br /> Aquí todo significa.</>
                    ) : (
                        <>Nothing is accidental on the street.<br /> Here everything has a meaning.</>
                    )}
                    &rdquo;
                </blockquote>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#8A8A8A] to-transparent" />
            </div>
        </section>
    );
}
