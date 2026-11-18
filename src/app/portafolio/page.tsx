import Gallery from "@/components/Gallery";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { getPortfolio } from "@/lib/portfolio";
import { getLandingSettings } from "@/lib/landing";
import { SITE_ID, SITE_URL, jsonLd } from "@/lib/site";

const TITLE = "Portafolio de fotografía urbana y editorial en Santo Domingo";
const DESCRIPTION =
    "Portafolio de Edwin de León, «el chef de las fotos»: fotografía urbana, editorial, de moda, estudio y documental en Santo Domingo, República Dominicana.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/portafolio" },
    openGraph: {
        title: `${TITLE} — Creador Films`,
        description: DESCRIPTION,
        url: "/portafolio",
        siteName: "Creador Films",
        images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Portafolio de Creador Films" }],
        locale: "es_DO",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: `${TITLE} — Creador Films`,
        description: DESCRIPTION,
        images: ["/og.jpg"],
    },
};

export default async function PortafolioPage() {
    const [{ categories, photos }, landing] = await Promise.all([getPortfolio(), getLandingSettings()]);

    const gallery = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/portafolio`,
        inLanguage: "es",
        isPartOf: { "@id": SITE_ID.website },
        author: { "@id": SITE_ID.photographer },
        about: categories.map((c) => c.name),
    };

    return (
        <main className="min-h-screen bg-black">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(gallery) }} />
            <Navbar />

            <div className="pt-[64px]">
                <div className="text-center pt-16 pb-4 px-8">
                    <p className="text-[0.75rem] tracking-[0.3em] uppercase text-[#8A8A8A] mb-3">— Todo el trabajo · Santo Domingo, RD</p>
                    <h1 className="font-gothic text-[clamp(2.5rem,6vw,5rem)] font-normal leading-none text-[#F5F0E8]">
                        Portafolio
                    </h1>
                    <p className="font-serif text-[#8A8A8A] max-w-[60ch] mx-auto mt-6 text-[1rem] leading-relaxed">
                        Fotografía urbana, editorial y de moda de Edwin de León, «el chef de las fotos», hecha en las
                        calles y estudios de Santo Domingo, República Dominicana: cultura street, moda, estudio, detrás
                        de cámaras, documental rural y la nueva generación del asfalto.
                    </p>
                </div>
                <Gallery categories={categories} photos={photos} landing={landing} />
            </div>
        </main>
    );
}
