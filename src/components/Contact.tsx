"use client";

import Image from "next/image";

const WA_LINK = "https://wa.me/18292971687?text=Klk%20mio%2C%20me%20gustaria%20agendar%20una%20sesion%20de%20fotos";

export default function Contact() {
    return (
        <section id="contacto" className="w-full flex items-center justify-center bg-[#0a0a0a] py-24 px-4 md:px-8" aria-label="Reservas">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="block w-full max-w-[800px] mx-auto hover:opacity-95 transition-opacity duration-300">
                <Image
                    src="/bookings.jpg"
                    alt="Bookings - Reserva Tu Sesión"
                    width={800}
                    height={1000}
                    className="w-full h-auto object-cover shadow-2xl shadow-black/50"
                    quality={100}
                    style={{ width: "100%", height: "auto" }}
                />
            </a>
        </section>
    );
}
