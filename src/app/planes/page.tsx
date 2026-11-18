import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Planes from "@/components/Planes";
import Footer from "@/components/Footer";
import { getCurrentYear } from "@/lib/year";

const TITLE = "Planes de sesión de fotos en Santo Domingo";
const DESCRIPTION =
    "Planes de sesión fotográfica urbana y editorial en Santo Domingo con Edwin de León, «el chef de las fotos»: fotos con retoque profesional, en locación o estudio. Cotiza por WhatsApp.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/planes" },
    openGraph: {
        title: `${TITLE} — Creador Films`,
        description: DESCRIPTION,
        url: "/planes",
        siteName: "Creador Films",
        images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Planes de sesión de fotos — Creador Films" }],
        locale: "es_DO",
        type: "website",
    },
};

export default async function PlanesPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className="pt-20">
                <Planes />
            </div>
            <Footer year={await getCurrentYear()} />
        </main>
    );
}
