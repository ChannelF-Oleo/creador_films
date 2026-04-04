"use client";

import { useEffect, useState, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";

// ── Constantes ────────────────────────────────────────────────────────────────
const WA_TEXT = encodeURIComponent("Klk mio, me gustaria agendar una sesion de fotos");
const WA_LINK = `https://wa.me/18292971687?text=${WA_TEXT}`;

const NAV_LINKS = [
    { href: "/#hero", label: "Inicio" },
    { href: "/#chef", label: "Chef" },
    { href: "/#servicios", label: "Servicios" },
    { href: "/#planes", label: "Planes" },
    { href: "/portafolio", label: "Portafolio" },
] as const;

// ── Sub-componentes ───────────────────────────────────────────────────────────
const HamburgerIcon = memo(function HamburgerIcon({ open }: { open: boolean }) {
    return (
        <span className="hamburger" aria-hidden="true">
            <span className={`hamburger-line ${open ? "hamburger-line--top-open" : ""}`} />
            <span className={`hamburger-line ${open ? "hamburger-line--mid-open" : ""}`} />
            <span className={`hamburger-line ${open ? "hamburger-line--bot-open" : ""}`} />
        </span>
    );
});

// ── Componente principal ──────────────────────────────────────────────────────
export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Scroll listener — passive + cleanup
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Bloquear scroll del body cuando el menú está abierto
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    // Cerrar menú con Escape
    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    const closeMenu = useCallback(() => setMenuOpen(false), []);
    const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

    const isScrolled = scrolled || menuOpen;

    return (
        <>
            <nav
                className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}
                aria-label="Navegación principal"
            >
                <div className="navbar-inner">

                    {/* Logo */}
                    <Link href="/" className="navbar-logo" aria-label="El Chef de las Fotos — Inicio">
                        <Image
                            src="/logo.png"
                            alt=""
                            width={200}
                            height={80}
                            className="navbar-logo-img"
                            style={{ width: "auto" }}
                            priority
                        />
                    </Link>

                    {/* Desktop */}
                    <div className="navbar-desktop" role="navigation">
                        <ul className="navbar-links" role="list">
                            {NAV_LINKS.map(({ href, label }) => (
                                <li key={href}>
                                    <Link href={href} className="navbar-link">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <Link 
                            href="/#contacto"
                            className="navbar-cta"
                            aria-label="Ir a la sección de contacto"
                        >
                            Reserva
                        </Link>
                    </div>

                    {/* Hamburger */}
                    <button
                        className="navbar-hamburger"
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        <HamburgerIcon open={menuOpen} />
                    </button>
                </div>
            </nav>

            {/* Mobile overlay — fuera del <nav> para no afectar z-index del navbar */}
            <div
                id="mobile-menu"
                className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}
                aria-hidden={!menuOpen}
                role="dialog"
                aria-modal="true"
                aria-label="Menú de navegación"
            >
                <ul className="mobile-menu-links" role="list">
                    {[...NAV_LINKS, { href: "/#contacto", label: "Reserva" } as const].map(
                        ({ href, label }, i) => (
                            <li
                                key={href}
                                className="mobile-menu-item"
                                style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}
                            >
                                <Link
                                    href={href}
                                    className="mobile-menu-link font-gothic"
                                    onClick={closeMenu}
                                    target={href.startsWith("http") ? "_blank" : undefined}
                                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    tabIndex={menuOpen ? 0 : -1}
                                >
                                    {label}
                                </Link>
                            </li>
                        )
                    )}
                </ul>
            </div>
        </>
    );
}

