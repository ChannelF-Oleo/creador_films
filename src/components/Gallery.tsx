"use client";

import { useState } from "react";
import Image from "next/image";

const CATEGORIES = ["Todo", "Calle", "Moda", "Cultura", "Rural", "Studio"] as const;
type Category = typeof CATEGORIES[number];

const ITEMS: { src: string; alt: string; cat: Exclude<Category, "Todo">; tall?: boolean; wide?: boolean }[] = [
    { src: "/street2.jpeg", alt: "Fotografía de calle — escena urbana", cat: "Calle" },
    { src: "/moda.jpeg", alt: "Fotografía de moda editorial", cat: "Moda", tall: true },
    { src: "/cultura.jpeg", alt: "Cultura urbana", cat: "Cultura" },
    { src: "/urban.jpg", alt: "Fotografía urbana — barrio", cat: "Calle", wide: true },
    { src: "/moda2.jpeg", alt: "Editorial de moda — retrato", cat: "Moda", tall: true },
    { src: "/rural.jpeg", alt: "Fotografía rural — paisaje", cat: "Rural" },
    { src: "/moda3.jpeg", alt: "Moda editorial callejera", cat: "Moda" },
    { src: "/street_studio.jpeg", alt: "Studio — retrato", cat: "Studio" },
    { src: "/moda4.jpeg", alt: "Moda urbana — ambiente", cat: "Moda", wide: true },
    { src: "/rural2.jpeg", alt: "Rural — naturaleza", cat: "Rural" },
    { src: "/urban2.jpg", alt: "Retrato urbano", cat: "Calle", tall: true },
    { src: "/moda5.jpeg", alt: "Editorial de moda", cat: "Moda" },
    { src: "/rural3.jpeg", alt: "Rural — documental", cat: "Rural" },
    { src: "/studio2.jpeg", alt: "Retrato de estudio", cat: "Studio", wide: true },
    { src: "/rural4.jpeg", alt: "Rural — documentación", cat: "Rural" },
    { src: "/flow_kids.jpg", alt: "Cultura — comunidad", cat: "Cultura", tall: true },
    { src: "/flow_kids2.jpg", alt: "Cultura — infancia urbana", cat: "Cultura" },
    { src: "/flow_kids3.jpg", alt: "Cultura — momento espontáneo", cat: "Cultura" },
    { src: "/flow_kid4.jpg", alt: "Cultura — retrato espontáneo", cat: "Cultura" },
];

export default function Gallery() {
    const [active, setActive] = useState<Category>("Todo");
    const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

    const filtered = active === "Todo" ? ITEMS : ITEMS.filter((i) => i.cat === active);

    return (
        <section id="trabajo" className="pb-24 bg-black" aria-label="Portafolio de trabajo">
            {/* Header */}


            {/* Filter bar */}
            <div className="flex gap-1 justify-center flex-wrap px-8 pb-12" role="tablist">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        role="tab"
                        aria-selected={active === cat}
                        onClick={() => setActive(cat)}
                        className={`text-[0.7rem] tracking-[0.25em] uppercase px-5 py-2 border transition-all duration-300 cursor-pointer
              ${active === cat
                                ? "text-[#F5F0E8] border-[#F5F0E8]"
                                : "text-[#8A8A8A] border-transparent hover:text-[#F5F0E8] hover:border-[#F5F0E8]"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Masonry grid */}
            <div className="max-w-[1400px] mx-auto px-6 columns-1 md:columns-2 lg:columns-3 gap-6">
                {filtered.map((item, i) => (
                    <div
                        key={item.src + i}
                        onClick={() => setLightbox({ src: item.src, alt: item.alt })}
                        className={`break-inside-avoid mb-6 overflow-hidden relative cursor-pointer group border border-white/5
              ${item.tall ? "aspect-[3/4]" : item.wide ? "aspect-[16/9]" : "aspect-[4/3]"}`}
                    >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                        <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            loading="lazy"
                            sizes="(max-width:768px) 100vw, (max-width:1100px) 50vw, 33vw"
                            className="object-cover group-hover:scale-[1.03] transition-all duration-1000 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-6 z-20">
                            <span className="text-[0.65rem] tracking-[0.4em] uppercase text-[#F5F0E8] border border-white/20 px-3 py-1 bg-black/40 backdrop-blur-sm">
                                {item.cat}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 bg-black/96 z-[1000] flex items-center justify-center animate-fadeIn"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        onClick={() => setLightbox(null)}
                        className="absolute top-6 right-6 text-[#F5F0E8] text-xl p-4 hover:text-[#8A8A8A] transition-colors z-[1001]"
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                    <div
                        className="max-w-[90vw] max-h-[90dvh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={lightbox.src}
                            alt={lightbox.alt}
                            width={1400}
                            height={900}
                            className="max-w-[90vw] max-h-[90dvh] w-auto h-auto object-contain animate-fadeUp"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
