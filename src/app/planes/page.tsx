import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Planes from "@/components/Planes";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Planes y Precios",
    description: "Conoce nuestros planes de fotografía, diseñados para capturar la esencia urbana y editorial con la más alta calidad.",
    openGraph: {
        title: "Planes y Precios — CREADOR FILMS",
        description: "Elige el plan ideal para tu próxima sesión de fotos. Calidad profesional y retoque editorial.",
        url: "https://elchefdelasfotos.com/planes",
        siteName: "Creador Films",
        images: [
            {
                url: "/Hero.avif",
                width: 1200,
                height: 630,
                alt: "Planes Creador Films",
            },
        ],
        locale: "es_ES",
        type: "website",
    },
};

export default function PlanesPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className="pt-20">
                <Planes />
            </div>
            <Footer />
        </main>
    );
}
