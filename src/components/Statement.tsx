"use client";

import useReveal from "@/hooks/useReveal";

export default function Statement() {
    const ref = useReveal();

    return (
        <section
            id="statement"
            className="min-h-dvh flex items-center px-8 md:px-16 bg-[#0a0a0a]"
            aria-label="Declaración artística"
        >
            <div className="max-w-[900px] mx-auto w-full flex flex-col items-center gap-10" ref={ref}>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#8A8A8A] to-transparent" />
                <blockquote className="font-serif italic font-light text-[clamp(1.6rem,4vw,2.8rem)] text-[#F5F0E8] text-center leading-[1.4] tracking-[0.02em]">
                    &ldquo;Nada es casual en la calle. Aquí todo significa.&rdquo;
                </blockquote>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#8A8A8A] to-transparent" />
            </div>
        </section>
    );
}
