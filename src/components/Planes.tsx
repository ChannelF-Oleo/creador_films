"use client";

import useReveal from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";

export default function Planes() {
    const { t, lang } = useLanguage();
    const revealRef = useReveal();

    const planesData = [
        {
            name: t.planes.pA.name,
            price: t.planes.pA.price,
            features: t.planes.pA.features,
            ctaText: `${t.planes.cta} ${t.planes.pA.name}`,
            waLink: `https://wa.me/18292971687?text=${encodeURIComponent(lang === 'es' ? "Hola. Edwin!, me gustaria agendar el Plan A" : "Hi, I'd like to book Plan A")}`
        },
        {
            name: t.planes.pB.name,
            price: t.planes.pB.price,
            popular: true,
            features: t.planes.pB.features,
            ctaText: `${t.planes.cta} ${t.planes.pB.name}`,
            waLink: `https://wa.me/18292971687?text=${encodeURIComponent(lang === 'es' ? "Hola. Edwin!, me gustaria agendar el Plan B" : "Hi, I'd like to book Plan B")}`
        }
    ];

    return (
        <section id="planes" className="w-full bg-black py-24 px-6 md:px-8 border-t border-[#222]">
            <div ref={revealRef} className="max-w-[1200px] mx-auto z-10 relative">
                {/* Header Planes */}
                <div className="text-center pb-16">
                    <p className="text-[0.75rem] tracking-[0.3em] uppercase text-[#8A8A8A] mb-3">— {t.planes.eyebrow}</p>
                    <h2 className="font-gothic text-[clamp(2.5rem,6vw,4.5rem)] font-normal leading-none text-[#F5F0E8] mb-6">
                        {t.planes.title}
                    </h2>
                    <p className="max-w-xl mx-auto text-[#8A8A8A] text-sm md:text-base leading-relaxed font-serif italic opacity-80">
                        {t.planes.desc}
                    </p>
                </div>

                {/* Cards de Planes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto mb-20">
                    {planesData.map((plan, idx) => (
                        <div 
                            key={idx} 
                            className={`relative group rounded-xl p-8 transition-all duration-500 hover:-translate-y-2
                                ${plan.popular 
                                    ? 'bg-[#111] border border-[#F5F0E8] shadow-[0_0_30px_rgba(245,240,232,0.05)]' 
                                    : 'bg-[#0f0f12] border border-[#222]'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-8 -translate-y-1/2">
                                    <span className="bg-[#F5F0E8] text-black text-[0.65rem] font-black tracking-[0.2em] uppercase py-1.5 px-4 rounded-full shadow-[0_4px_15px_rgba(245,240,232,0.1)]">
                                        {t.planes.popular}
                                    </span>
                                </div>
                            )}

                            <div>
                                <h3 
                                    className="font-['Sedgwick_Ave_Display'] text-4xl text-[#F5F0E8] mb-4 tracking-wider transform -rotate-1 origin-left" 
                                    style={{ WebkitTextStroke: "1px #8A8A8A" }}
                                >
                                    {plan.name}
                                </h3>

                            </div>

                            <div className="space-y-4 mb-10 w-full">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222] pb-3 last:border-0 last:pb-0">
                                        <span className={`text-xs font-medium ${plan.popular ? 'text-[#F5F0E8]' : 'text-[#F5F0E8]'}`}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <a 
                                href={plan.waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block w-full py-4 text-center text-xs tracking-[0.2em] uppercase transition-all duration-300 font-bold
                                    ${plan.popular 
                                        ? 'bg-[#F5F0E8] text-black hover:bg-white shadow-[0_10px_25px_rgba(245,240,232,0.1)]' 
                                        : 'bg-transparent border border-[#F5F0E8] text-[#F5F0E8] hover:bg-[#F5F0E8] hover:text-black'}`}
                            >
                                {plan.ctaText}
                            </a>
                        </div>
                    ))}
                </div>

                {/* Framing / Impresión */}
                <div className="max-w-4xl mx-auto mb-16 rounded-xl border border-[#F5F0E8]/20 bg-[#0f0f12] overflow-hidden">
                    <div className="flex flex-col md:flex-row items-stretch">
                        {/* Icono decorativo */}
                        <div className="flex items-center justify-center bg-[#F5F0E8]/5 px-10 py-8 md:py-0 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#F5F0E8]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <rect x="3" y="3" width="18" height="18" rx="1" />
                                <rect x="7" y="7" width="10" height="10" rx="0.5" />
                            </svg>
                        </div>
                        {/* Contenido */}
                        <div className="flex-1 p-8">
                            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-[#8A8A8A] mb-3">
                                — Add-on
                            </p>
                            <h3 className="font-gothic text-xl md:text-2xl text-[#F5F0E8] mb-5 leading-tight">
                                {t.planes.framing.title}
                            </h3>
                            <ul className="space-y-2 mb-5">
                                {t.planes.framing.options.map((opt, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-[#8A8A8A]">
                                        <span className="text-[#F5F0E8]/50">✔</span>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-[#8A8A8A]/60 italic">
                                {t.planes.framing.alert}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="max-w-3xl mx-auto border-t border-[#222] pt-12">
                    <h4 className="text-[#F5F0E8] font-gothic text-xl mb-8 flex items-center gap-3">
                        <span className="text-[#8A8A8A] text-sm">/</span>
                        {t.planes.notesTitle}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        {t.planes.notes.map((note, i) => (
                            <div key={i} className="bg-[#0f0f0f] border border-[#1a1a1a] p-4 rounded-lg flex flex-col gap-1">
                                <p className="text-[#8A8A8A] leading-relaxed">
                                    {note}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
