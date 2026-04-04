"use client";

import useReveal from "@/hooks/useReveal";

const WA_TEXT_A = encodeURIComponent("Klk mio, me gustaria agendar el Plan A");
const WA_TEXT_B = encodeURIComponent("Klk mio, me gustaria agendar el Plan B");

const planes = [
    {
        name: "Plan A",
        price: "RD$7,000",
        decimals: ".00",
        features: [
            { label: "Fotos Digitales", value: "10 fotos" },
            { label: "Retoque", value: "Profesional" },
            { label: "Duración", value: "1 hora" },
            { label: "Vestuarios", value: "1 vestuario" },
            { label: "Locación", value: "Distrito Nac. o Estudio*" },
            { label: "Hora Extra", value: "RD$1,000.00" },
        ],
        ctaText: "Reservar Plan A",
        waLink: `https://wa.me/18292971687?text=${WA_TEXT_A}`
    },
    {
        name: "Plan B",
        price: "RD$13,000",
        decimals: ".00",
        popular: true,
        features: [
            { label: "Fotos Digitales", value: "22 fotos" },
            { label: "Retoque", value: "Profesional" },
            { label: "Duración", value: "2 horas" },
            { label: "Vestuarios", value: "2 cambios" },
            { label: "Locación", value: "Distrito Nac. o Estudio*" },
            { label: "Hora Extra", value: "RD$1,300.00" },
        ],
        ctaText: "Reservar Plan B",
        waLink: `https://wa.me/18292971687?text=${WA_TEXT_B}`
    }
];

export default function Planes() {
    const revealRef = useReveal();

    return (
        <section id="planes" className="w-full bg-black py-24 px-6 md:px-8 border-t border-[#222]">
            <div ref={revealRef} className="max-w-[1200px] mx-auto z-10 relative">
                {/* Header Planes */}
                <div className="text-center pb-16">
                    <p className="text-[0.75rem] tracking-[0.3em] uppercase text-[#8A8A8A] mb-3">— Inversión en tu imagen</p>
                    <h2 className="font-gothic text-[clamp(2.5rem,6vw,4.5rem)] font-normal leading-none text-[#F5F0E8] mb-6">
                        Planes & Precios
                    </h2>
                    <p className="max-w-xl mx-auto text-[#8A8A8A] text-sm md:text-base leading-relaxed font-serif italic opacity-80">
                        Sesiones diseñadas para sacar tu mejor versión con un enfoque editorial y urbano. Elige el plan que mejor se adapte a tu visión creativa.
                    </p>
                </div>

                {/* Cards de Planes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto mb-20">
                    {planes.map((plan, idx) => (
                        <div 
                            key={idx} 
                            className={`relative group rounded-xl p-8 transition-all duration-500 hover:-translate-y-2
                                ${plan.popular 
                                    ? 'bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] border border-[#D49B72]/40 shadow-[0_0_50px_rgba(212,155,114,0.15)]' 
                                    : 'bg-[#0f0f12] border border-[#222]'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-8 -translate-y-1/2">
                                    <span className="bg-[#D49B72] text-black text-[0.65rem] font-black tracking-[0.2em] uppercase py-1.5 px-4 rounded-full shadow-[0_4px_15px_rgba(212,155,114,0.3)]">
                                        Más Popular
                                    </span>
                                </div>
                            )}

                            <div>
                                <h3 
                                    className="font-['Sedgwick_Ave_Display'] text-4xl text-[#F5F0E8] mb-4 tracking-wider transform -rotate-1 origin-left" 
                                    style={{ WebkitTextStroke: plan.popular ? "1px #D49B72" : "0.5px #8A8A8A" }}
                                >
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className={`text-4xl md:text-5xl font-light tracking-tight ${plan.popular ? 'text-[#D49B72]' : 'text-[#F5F0E8]'}`}>{plan.price}</span>
                                    <span className="text-[#8A8A8A] text-sm">{plan.decimals}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 w-full">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222] pb-3 last:border-0 last:pb-0">
                                        <span className="text-[#8A8A8A] text-xs font-mono uppercase tracking-[0.15em] mb-1 sm:mb-0 block">{feature.label}</span>
                                        <span className={`text-sm font-medium ${plan.popular ? 'text-[#F5F0E8]' : 'text-[#F5F0E8]'}`}>{feature.value}</span>
                                    </div>
                                ))}
                            </div>

                            <a 
                                href={plan.waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block w-full py-4 text-center text-xs tracking-[0.2em] uppercase transition-all duration-300 font-bold
                                    ${plan.popular 
                                        ? 'bg-[#D49B72] text-black hover:bg-[#F5F0E8] shadow-[0_10px_25px_rgba(212,155,114,0.2)]' 
                                        : 'bg-transparent border border-[#F5F0E8] text-[#F5F0E8] hover:bg-[#F5F0E8] hover:text-black'}`}
                            >
                                {plan.ctaText}
                            </a>
                        </div>
                    ))}
                </div>

                {/* Terms and Conditions */}
                <div className="max-w-3xl mx-auto border-t border-[#222] pt-12">
                    <h4 className="text-[#F5F0E8] font-gothic text-xl mb-8 flex items-center gap-3">
                        <span className="text-[#8A8A8A] text-sm">/</span>
                        Notas Importantes
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-5 rounded-lg flex flex-col gap-1">
                            <span className="text-[#D49B72] text-[0.6rem] font-bold tracking-[0.2em] uppercase">Reserva</span>
                            <p className="text-[#8A8A8A] text-xs leading-relaxed">Depósito del <strong className="text-[#F5F0E8] font-normal">50%</strong> para agendar.</p>
                        </div>
                        
                        <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-5 rounded-lg flex flex-col gap-1">
                            <span className="text-[#D49B72] text-[0.6rem] font-bold tracking-[0.2em] uppercase">Disponibilidad</span>
                            <p className="text-[#8A8A8A] text-xs leading-relaxed">Confirmar fecha antes de depositar.</p>
                        </div>
                        
                        <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-5 rounded-lg flex flex-col gap-1">
                            <span className="text-[#D49B72] text-[0.6rem] font-bold tracking-[0.2em] uppercase">Extras</span>
                            <p className="text-[#8A8A8A] text-xs leading-relaxed">*Alquiler de estudio no incluido.</p>
                        </div>
                        
                        <div className="bg-[#0f0f0f] border border-[#1a1a1a] p-5 rounded-lg flex flex-col gap-1">
                            <span className="text-[#D49B72] text-[0.6rem] font-bold tracking-[0.2em] uppercase">Flexibilidad</span>
                            <p className="text-[#8A8A8A] text-xs leading-relaxed">Ajustes según necesidades de la sesión.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
