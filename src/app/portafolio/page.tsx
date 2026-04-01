import Gallery from "@/components/Gallery";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Portafolio",
    description: "Explora el portafolio completo de CREADOR FILMS. Fotografía editorial, moda, calle, cultura y documental.",
    openGraph: {
        title: "Portafolio — CREADOR FILMS",
        description: "Explora el portafolio completo de CREADOR FILMS. Fotografía editorial, moda, calle, cultura y documental.",
        url: "https://elchefdelasfotos.com/portafolio",
        siteName: "Creador Films",
        images: [
            {
                url: "/Hero.jpeg",
                width: 1200,
                height: 630,
                alt: "Portafolio Creador Films",
            },
        ],
        locale: "es_ES",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Portafolio — CREADOR FILMS",
        description: "Portafolio de fotografía editorial y urbana.",
        images: ["/Hero.jpeg"],
    },
};

export default function PortafolioPage() {
    return (
        <main className="min-h-screen bg-black">
            {/* Mini nav */}
            <header className="fixed top-0 left-0 right-0 z-50 h-[64px] bg-black/95 backdrop-blur-md border-b border-[#8A8A8A]/15 flex items-center px-8">
                <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo.png" alt="Creador Films" width={120} height={40} className="h-9 w-auto object-contain" style={{ width: "auto" }} />
                    </Link>
                    <Link
                        href="/"
                        className="text-[0.7rem] tracking-[0.25em] uppercase text-[#8A8A8A] hover:text-[#F5F0E8] transition-colors duration-300"
                    >
                        ← Volver
                    </Link>
                </div>
            </header>

            <div className="pt-[64px]">
                <div className="text-center pt-16 pb-4 px-8">
                    <p className="text-[0.75rem] tracking-[0.3em] uppercase text-[#8A8A8A] mb-3">— Todo el trabajo</p>
                    <h1 className="font-gothic text-[clamp(2.5rem,6vw,5rem)] font-normal leading-none text-[#F5F0E8]">
                        Portafolio
                    </h1>
                </div>
                <Gallery />
            </div>
        </main>
    );
}
