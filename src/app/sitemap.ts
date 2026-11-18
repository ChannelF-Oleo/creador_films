import type { MetadataRoute } from 'next';
import { getPortfolio } from '@/lib/portfolio';
import { SITE_URL } from '@/lib/site';

// Sin lastModified/priority/changeFrequency: Google ignora los dos últimos y una fecha
// que cambia en cada petición no aporta información.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { photos } = await getPortfolio();
    // Next no escapa <image:loc>: el "&" de las URLs de Storage (…?alt=media&token=…) rompería el XML
    const images = photos.filter((p) => !p.hidden).map((p) => p.src.replace(/&/g, '&amp;'));

    return [
        { url: `${SITE_URL}/` },
        { url: `${SITE_URL}/portafolio`, images },
        { url: `${SITE_URL}/planes` },
    ];
}
