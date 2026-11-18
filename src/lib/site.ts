/**
 * Datos canónicos del sitio: un solo host (www) para metadata, sitemap, robots y JSON-LD.
 * El apex (elchefdelasfotos.com) redirige a www desde Vercel → Domains.
 */
export const SITE_URL = "https://www.elchefdelasfotos.com";

export const BUSINESS = {
    name: "CREADOR FILMS",
    alternateName: "El chef de las fotos",
    photographer: "Edwin de León",
    city: "Santo Domingo",
    region: "Distrito Nacional",
    country: "DO",
    phone: "+18292971687",
    email: "creadorfilms89@gmail.com",
    instagram: "https://www.instagram.com/creador.films/",
    description:
        "Edwin de León, «el chef de las fotos», es fotógrafo urbano, editorial y de moda en Santo Domingo, República Dominicana, y fundador de CREADOR FILMS.",
} as const;

/** Serializa JSON-LD escapando "<" para evitar inyección de HTML (recomendación de la guía de Next). */
export function jsonLd(data: unknown): string {
    return JSON.stringify(data).replace(/</g, "\\u003c");
}

const id = (fragment: string) => `${SITE_URL}/#${fragment}`;

/** Grafo base: sitio web, negocio (servicio a domicilio, sin dirección pública) y fotógrafo. Sin precios por decisión del fotógrafo. */
export const siteGraph = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": id("website"),
            url: `${SITE_URL}/`,
            name: BUSINESS.name,
            alternateName: BUSINESS.alternateName,
            inLanguage: "es",
            publisher: { "@id": id("business") },
        },
        {
            "@type": "ProfessionalService",
            "@id": id("business"),
            name: BUSINESS.name,
            alternateName: BUSINESS.alternateName,
            description: BUSINESS.description,
            url: `${SITE_URL}/`,
            logo: `${SITE_URL}/logo.png`,
            image: `${SITE_URL}/og.jpg`,
            telephone: BUSINESS.phone,
            email: BUSINESS.email,
            address: {
                "@type": "PostalAddress",
                addressLocality: BUSINESS.city,
                addressRegion: BUSINESS.region,
                addressCountry: BUSINESS.country,
            },
            areaServed: { "@type": "City", name: BUSINESS.city },
            founder: { "@id": id("photographer") },
            sameAs: [BUSINESS.instagram],
            knowsAbout: ["Fotografía urbana", "Fotografía editorial", "Fotografía de moda", "Fotografía documental"],
        },
        {
            "@type": "Person",
            "@id": id("photographer"),
            name: BUSINESS.photographer,
            alternateName: BUSINESS.alternateName,
            jobTitle: "Fotógrafo",
            worksFor: { "@id": id("business") },
            homeLocation: { "@type": "City", name: BUSINESS.city },
            sameAs: [BUSINESS.instagram],
        },
    ],
};

export const SITE_ID = { website: id("website"), business: id("business"), photographer: id("photographer") };
