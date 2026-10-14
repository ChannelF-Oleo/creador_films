"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

// ── Tipos ─────────────────────────────────────────────────────────────────────
export interface LightboxItem {
    id: string;
    src: string;
    alt: string;
}

interface LightboxProps {
    items: LightboxItem[];
    index: number;
    onIndexChange: (index: number) => void;
    onClose: () => void;
    /** Nombre de la serie, para lectores de pantalla */
    label?: string;
}

// ── Componente ────────────────────────────────────────────────────────────────
/**
 * Visor a pantalla completa compartido por el landing y el portafolio.
 * Cada foto es un slide de un carril con scroll-snap: en móvil se desliza con el dedo,
 * en escritorio con flechas o teclado. Solo se montan la foto actual y sus vecinas,
 * así las vecinas quedan precargadas sin descargar toda la serie.
 */
export default function Lightbox({ items, index, onIndexChange, onClose, label }: LightboxProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const total = items.length;

    const goTo = useCallback((i: number, smooth = true) => {
        const track = trackRef.current;
        if (!track || total === 0) return;
        const target = (i + total) % total;
        track.scrollTo({ left: target * track.clientWidth, behavior: smooth ? "smooth" : "instant" });
    }, [total]);

    // Posición inicial sin animación
    useLayoutEffect(() => {
        goTo(index, false);
        // Solo al abrir: los cambios posteriores los provoca el propio scroll
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // El índice sale del scroll, así el deslizamiento nativo y las flechas comparten estado
    const onScroll = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        const current = Math.round(track.scrollLeft / track.clientWidth);
        if (current !== index && current >= 0 && current < total) onIndexChange(current);
    }, [index, total, onIndexChange]);

    // Teclado, bloqueo del scroll de la página y devolución del foco al cerrar
    useEffect(() => {
        const previousFocus = document.activeElement as HTMLElement | null;
        closeRef.current?.focus();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus?.();
        };
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowRight") goTo(index + 1);
            else if (e.key === "ArrowLeft") goTo(index - 1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [index, goTo, onClose]);

    // Al girar el móvil cambia el ancho de cada slide
    useEffect(() => {
        const onResize = () => goTo(index, false);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [index, goTo]);

    if (total === 0) return null;

    return (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={label ?? items[index]?.alt}>
            <div className="lightbox-bar">
                <span className="lightbox-counter font-mono-urban" aria-live="polite">
                    {index + 1} / {total}
                </span>
                <button
                    ref={closeRef}
                    className="lightbox-close font-mono-urban"
                    onClick={onClose}
                    aria-label="Cerrar visor"
                >
                    ✕
                </button>
            </div>

            <div ref={trackRef} className="lightbox-track" onScroll={onScroll}>
                {items.map((item, i) => (
                    <div key={item.id} className="lightbox-slide" aria-hidden={i !== index}>
                        {Math.abs(i - index) <= 1 && (
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                sizes="100vw"
                                className="lightbox-img"
                            />
                        )}
                    </div>
                ))}
            </div>

            {total > 1 && (
                <>
                    <button
                        className="lightbox-arrow lightbox-arrow--prev"
                        onClick={() => goTo(index - 1)}
                        aria-label="Foto anterior"
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        className="lightbox-arrow lightbox-arrow--next"
                        onClick={() => goTo(index + 1)}
                        aria-label="Foto siguiente"
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
}
