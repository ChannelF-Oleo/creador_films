"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
    const { t, lang } = useLanguage();
    const [nombre, setNombre] = useState("");
    const [plan, setPlan] = useState("");
    const [informacion, setInformacion] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nombre.trim() || !plan) return;

        let message = "";
        const greeting = lang === 'es' ? "Buenas!" : "Hello!";
        const intro = lang === 'es' ? `soy ${nombre.trim()} y me gustaria realizar una reserva para` : `I am ${nombre.trim()} and I would like to make a booking for`;
        const availability = lang === 'es' ? "¿Cuando tienen disponibilidad?" : "When are you available?";

        if (plan === "Solicitar cotización" || plan === "Custom Quote") {
            if (!informacion.trim()) return;
            message = lang === 'es' 
                ? `${greeting} soy ${nombre.trim()} y me gustaria realizar una cotizacion para: ${informacion.trim()}. ¡Cuando tenga lista la cotizacion me deja saber!`
                : `${greeting} I am ${nombre.trim()} and I'd like a quote for: ${informacion.trim()}. Please let me know your rates.`;
        } else {
            message = `${greeting} ${intro} ${plan}. ${availability}`;
        }

        const url = `https://wa.me/18292971687?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <section id="contacto" className="w-full bg-[#0a0a0a] py-24 px-4 md:px-8 border-t border-[#222]" aria-label="Contact and Bookings">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Visual */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#111]">
                    <Image
                        src="/bookings.avif"
                        alt="Bookings"
                        fill
                        className="object-contain object-top"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </div>

                {/* Formulario */}
                <div className="flex flex-col">
                    <p className="text-[0.75rem] tracking-[0.3em] uppercase text-[#8A8A8A] mb-4">— {t.contact.eyebrow}</p>
                        <h2 
                        className="font-['Sedgwick_Ave_Display'] text-[clamp(2.8rem,7vw,5rem)] leading-[0.9] mb-12 tracking-wider transform -rotate-2 inline-block shadow-none"
                        style={{ 
                            color: "#F5F0E8", 
                            WebkitTextStroke: "1px #8A8A8A",
                            textShadow: "4px 4px 0px rgba(138, 138, 138, 0.4)" 
                        }}
                    >
                        {lang === 'es' ? <>{t.contact.title.split(" ")[0]} {t.contact.title.split(" ")[1]}<br/>{t.contact.title.split(" ")[2]}</> : <>{t.contact.title.split(" ")[0]} a<br/>{t.contact.title.split(" ").slice(1).join(" ")}</>}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="nombre" className="text-[0.7rem] tracking-[0.2em] uppercase text-[#8A8A8A]">{t.contact.labelName}</label>
                            <input 
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder={t.contact.placeholderName}
                                required
                                className="bg-transparent border-b border-[#333] pb-2 text-[#F5F0E8] focus:outline-none focus:border-[#F5F0E8] transition-colors placeholder:text-[#333] placeholder:italic"
                            />
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <label htmlFor="plan" className="text-[0.7rem] tracking-[0.2em] uppercase text-[#8A8A8A]">{t.contact.labelPlan}</label>
                            <select
                                id="plan"
                                value={plan}
                                onChange={(e) => setPlan(e.target.value)}
                                required
                                className="bg-transparent border-b border-[#333] pb-2 text-[#F5F0E8] focus:outline-none focus:border-[#F5F0E8] transition-colors appearance-none cursor-pointer relative z-10"
                            >
                                <option value="" disabled className="bg-[#0a0a0a] text-[#8A8A8A]">{t.contact.placeholderPlan}</option>
                                <option value="Plan A" className="bg-[#0a0a0a]">Plan A</option>
                                <option value="Plan B" className="bg-[#0a0a0a]">Plan B</option>
                                <option value={lang === 'es' ? "Solicitar cotización" : "Custom Quote"} className="bg-[#0a0a0a]">{lang === 'es' ? "Solicitar Cotización Personalizada" : "Custom Quote"}</option>
                            </select>
                            <div className="absolute right-0 top-6 text-[#8A8A8A] pointer-events-none">▼</div>
                        </div>

                        {(plan === "Solicitar cotización" || plan === "Custom Quote") && (
                            <div className="flex flex-col gap-2 animate-fadeIn">
                                <label htmlFor="informacion" className="text-[0.7rem] tracking-[0.2em] uppercase text-[#8A8A8A]">{t.contact.labelDetails}</label>
                                <textarea
                                    id="informacion"
                                    value={informacion}
                                    onChange={(e) => setInformacion(e.target.value)}
                                    required
                                    rows={4}
                                    placeholder={t.contact.placeholderDetails}
                                    className="bg-transparent border border-[#333] p-3 text-[#F5F0E8] focus:outline-none focus:border-[#F5F0E8] transition-colors placeholder:text-[#444] placeholder:italic resize-y text-sm"
                                ></textarea>
                            </div>
                        )}

                        <div className="mt-4">
                            <button 
                                type="submit" 
                                className="bg-[#F5F0E8] text-black w-full py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-white transition-colors duration-300"
                            >
                                {t.contact.btn}
                            </button>
                            <p className="text-center text-[#8A8A8A] text-[0.65rem] tracking-wider uppercase mt-3">
                                {t.contact.hint}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
