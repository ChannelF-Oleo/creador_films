"use client";

import Image from "next/image";
import { useState } from "react";

export default function Contact() {
    const [nombre, setNombre] = useState("");
    const [plan, setPlan] = useState("");
    const [informacion, setInformacion] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nombre.trim() || !plan) return;

        let message = "";
        if (plan === "Solicitar cotización") {
            if (!informacion.trim()) return;
            message = `Buenas! soy ${nombre.trim()} y me gustaria realizar una cotizacion para: ${informacion.trim()}. ¡Cuando tenga lista la cotizacion me deja saber! si necesita cualquier otra informacion estoy a la orden.`;
        } else {
            message = `Buenas! soy ${nombre.trim()} y me gustaria realizar una reserva para ${plan} ¿Cuando tienen disponibilidad?`;
        }

        const url = `https://wa.me/18292971687?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <section id="contacto" className="w-full bg-[#0a0a0a] py-24 px-4 md:px-8 border-t border-[#222]" aria-label="Contacto y Reservas">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Visual */}
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <Image
                        src="/bookings.avif"
                        alt="Bookings - Reserva Tu Sesión"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </div>

                {/* Formulario */}
                <div className="flex flex-col">
                    <p className="text-[0.75rem] tracking-[0.3em] uppercase text-[#8A8A8A] mb-4">— Work With Us</p>
                    <h2 
                        className="font-['Sedgwick_Ave_Display'] text-[clamp(2.8rem,7vw,5rem)] leading-[0.9] mb-12 tracking-wider transform -rotate-2 inline-block shadow-none"
                        style={{ 
                            color: "#F5F0E8", 
                            WebkitTextStroke: "1.5px #D49B72",
                            textShadow: "4px 4px 0px rgba(212, 155, 114, 0.5)" 
                        }}
                    >
                        Haz tu<br/>Reserva
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="nombre" className="text-[0.7rem] tracking-[0.2em] uppercase text-[#8A8A8A]">Tu Nombre</label>
                            <input 
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej. Edwin De Leon"
                                required
                                className="bg-transparent border-b border-[#333] pb-2 text-[#F5F0E8] focus:outline-none focus:border-[#F5F0E8] transition-colors placeholder:text-[#333] placeholder:italic"
                            />
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <label htmlFor="plan" className="text-[0.7rem] tracking-[0.2em] uppercase text-[#8A8A8A]">Elige un Plan</label>
                            <select
                                id="plan"
                                value={plan}
                                onChange={(e) => setPlan(e.target.value)}
                                required
                                className="bg-transparent border-b border-[#333] pb-2 text-[#F5F0E8] focus:outline-none focus:border-[#F5F0E8] transition-colors appearance-none cursor-pointer relative z-10"
                            >
                                <option value="" disabled className="bg-[#0a0a0a] text-[#8A8A8A]">Selecciona una opción</option>
                                <option value="Plan A" className="bg-[#0a0a0a]">Plan A</option>
                                <option value="Plan B" className="bg-[#0a0a0a]">Plan B</option>
                                <option value="Solicitar cotización" className="bg-[#0a0a0a]">Solicitar Cotización Personalizada</option>
                            </select>
                            <div className="absolute right-0 top-6 text-[#8A8A8A] pointer-events-none">▼</div>
                        </div>

                        {plan === "Solicitar cotización" && (
                            <div className="flex flex-col gap-2 animate-fadeIn">
                                <label htmlFor="informacion" className="text-[0.7rem] tracking-[0.2em] uppercase text-[#8A8A8A]">Detalles de la sesión</label>
                                <textarea
                                    id="informacion"
                                    value={informacion}
                                    onChange={(e) => setInformacion(e.target.value)}
                                    required
                                    rows={4}
                                    placeholder="Ingrese aqui cantidad de personas, localidad, tipo de sesion o evento, cambios de ropa, horas de servicio y demas detalles pertinentes."
                                    className="bg-transparent border border-[#333] p-3 text-[#F5F0E8] focus:outline-none focus:border-[#F5F0E8] transition-colors placeholder:text-[#444] placeholder:italic resize-y text-sm"
                                ></textarea>
                            </div>
                        )}

                        <div className="mt-4">
                            <button 
                                type="submit" 
                                className="bg-[#F5F0E8] text-black w-full py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-white transition-colors duration-300"
                            >
                                Reservar
                            </button>
                            <p className="text-center text-[#8A8A8A] text-[0.65rem] tracking-wider uppercase mt-3">
                                Serás redirigido a WhatsApp
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
