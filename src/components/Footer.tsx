import Image from "next/image";

export default function Footer() {
    return (
        <footer className="py-20 px-8 border-t border-[#8A8A8A]/15 bg-black" aria-label="Pie de página">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 items-center text-center md:text-left">

                {/* 1. Espacio: Logo Más Grande */}
                <div className="flex justify-center md:justify-start">
                    <a href="#hero" className="inline-block hover:opacity-80 transition-opacity duration-300">
                        <Image
                            src="/logo.png"
                            alt="Creador Films"
                            width={300}
                            height={120}
                            className="h-20 md:h-24 w-auto object-contain"
                            style={{ width: "auto" }}
                        />
                    </a>
                </div>

                {/* 2. Espacio: Contactos */}
                <div className="flex flex-col items-center gap-4 text-[0.65rem] sm:text-[0.7rem] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#8A8A8A]">
                    <a href="https://www.instagram.com/creador.films/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5F0E8] transition-colors duration-300">
                        Instagram
                    </a>
                    <a href="mailto:creadorfilms89@gmail.com" className="hover:text-[#F5F0E8] transition-colors duration-300">
                        creadorfilms89@gmail.com
                    </a>
                    <a href="tel:+18292971687" className="hover:text-[#F5F0E8] transition-colors duration-300 mb-2">
                        +1 829-297-1687
                    </a>
                    <a href="/admin/login" className="text-[#8A8A8A]/50 hover:text-[#F5F0E8] transition-colors duration-300 flex items-center gap-2 mt-4 pt-4 border-t border-[#8A8A8A]/20">
                        Acceso Fotógrafo
                    </a>
                </div>

                {/* 3. Espacio: Créditos y Copy */}
                <div className="flex flex-col items-center md:items-end gap-3 text-[0.65rem] sm:text-[0.7rem] tracking-[0.1em] text-[#8A8A8A] md:text-right">
                    <p className="max-w-[200px] md:max-w-none">
                        © {new Date().getFullYear()} CreadorFilms<br />
                        Todos los derechos reservados.
                    </p>
                    <div className="w-8 h-px bg-[#8A8A8A]/30 my-2" aria-hidden="true" />
                    <p className="max-w-[200px] md:max-w-none leading-relaxed">
                        Curaduría, diseño y desarrollo por
                        <a href="https://fireforgerd.com" target="_blank" rel="noopener noreferrer" className="block text-[#F5F0E8] hover:text-white hover:underline uppercase tracking-[0.15em] mt-1.5 transition-all">
                            Fireforgerd
                        </a>
                    </p>
                </div>

            </div>
        </footer>
    );
}
