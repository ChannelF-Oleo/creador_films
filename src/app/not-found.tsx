import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-black flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8 pt-[64px]">
                <p className="font-mono-urban text-[#8A8A8A] tracking-[0.3em] uppercase text-xs mb-4">— Error 404</p>
                <h1 className="font-gothic text-[clamp(2.5rem,6vw,5rem)] leading-none text-[#F5F0E8] mb-6">
                    Esta esquina no existe
                </h1>
                <p className="font-serif text-[#8A8A8A] max-w-[45ch] mb-10">
                    La página que buscas se movió o nunca estuvo aquí. Vuelve al inicio o mira el portafolio.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/" className="btn-urban">Inicio</Link>
                    <Link href="/portafolio" className="btn-urban-outline">Ver portafolio</Link>
                </div>
            </div>
        </main>
    );
}
