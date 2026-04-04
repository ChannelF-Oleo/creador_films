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
                <blockquote 
                    className="font-['Sedgwick_Ave_Display'] text-[clamp(2rem,6vw,4rem)] text-center leading-[1.2] tracking-wider transform -rotate-2 my-8"
                    style={{ 
                        opacity: 0.95,
                        color: "#F5F0E8", 
                        WebkitTextStroke: "2px #8A8A8A",
                        textShadow: "6px 6px 0px rgba(138, 138, 138, 0.4)"
                    }}
                >
                    &ldquo;Nada es casual en la calle.<br /> Aquí todo significa.&rdquo;
                </blockquote>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#8A8A8A] to-transparent" />
            </div>
        </section>
    );
}
