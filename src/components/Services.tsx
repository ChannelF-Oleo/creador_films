"use client";

import Image from "next/image";
import { memo } from "react";
import useReveal from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";

// ── Constantes Visuales (Se mantienen aquí para fácil edición de rutas) ───────
const EDITORIAL_ASSETS = [
    {
        issue: "01",
        mainImg: "/flow_kids.avif",
        thumbs: ["/flow_kids2.avif", "/flow_kids3.avif", "/flow_kid4.avif"],
    },
    {
        issue: "02",
        mainImg: "/cultura.avif",
        thumbs: ["/street.avif", "/urban.avif", "culture2.avif", "/street2.avif"],
    },
    {
        issue: "03",
        mainImg: "/moda2.avif",
        thumbs: ["/moda.avif", "/moda3.avif", "/moda4.avif", "/moda5.avif"],
    },
    {
        issue: "04",
        mainImg: "/rural4.avif", // Replace with Salvaje if you have them, using street for now
        thumbs: ["/rural.avif", "/rural2.avif", "/rural3.avif"],
    },
] as const;

// ── Sub-componentes ───────────────────────────────────────────────────────────

/** Cabecera tipo masthead de revista */
const Masthead = memo(function Masthead() {
    const { t } = useLanguage();
    return (
        <header className="services-masthead">
            <div className="masthead-meta">
                <span className="masthead-label">{t.services.mastheadLabel1}</span>
                <span className="masthead-label">{t.services.mastheadLabel2}</span>
                <span className="masthead-label">{t.services.mastheadLabel3}</span>
            </div>

            <div className="masthead-title-wrapper">
                <span className="masthead-ghost" aria-hidden="true">LA</span>
                <h2 className="masthead-title font-gothic">{t.services.title}</h2>
            </div>

            <div className="masthead-rule">
                <div className="masthead-rule-line" aria-hidden="true" />
                <p className="masthead-rule-copy font-mono-urban">
                    {t.services.mastheadRule}
                </p>
            </div>
        </header>
    );
});

/** Spread individual por editorial */
const EditorialSpread = memo(function EditorialSpread({
    issue, tag, title, copy, mainImg, thumbs, pull, flip,
}: {
    issue: string;
    tag: string;
    title: string;
    copy: string;
    mainImg: string;
    thumbs: readonly string[];
    pull: string;
    flip: boolean;
}) {
    const lines = title.split("\n");
    const pullLines = pull.split("\n");

    return (
        <article
            className={`spread ${flip ? "spread--flip" : ""}`}
            aria-label={`Editorial ${tag}: ${title.replace("\n", " ")}`}
        >
            <div className="spread-visual">
                <span className="spread-issue font-gothic" aria-hidden="true">
                    {issue}
                </span>

                <div className="spread-main-photo relative aspect-[4/5]">
                    <Image
                        src={mainImg}
                        alt={title.replace("\n", " ")}
                        fill
                        className="spread-main-img object-cover"
                        sizes="(max-width: 1024px) 100vw, 55vw"
                    />
                    <div className="spread-tag-badge" aria-hidden="true">
                        <span className="font-mono-urban">{tag}</span>
                    </div>
                </div>

                <div className="spread-strips flex gap-2 mt-2 h-24" aria-hidden="true">
                    {thumbs.slice(0, 3).map((src, i) => (
                        <div key={i} className="spread-strip relative flex-1 overflow-hidden">
                            <Image
                                src={src}
                                alt=""
                                fill
                                className="spread-strip-img object-cover"
                                sizes="15vw"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="spread-text">
                <h3 className="spread-title font-gothic" aria-label={title.replace("\n", " ")}>
                    {lines.map((line, i) => (
                        <span key={i} className="spread-title-line" aria-hidden="true">
                            {line}
                        </span>
                    ))}
                </h3>

                <div className="spread-divider" aria-hidden="true" />

                <p className="spread-copy font-serif">{copy}</p>

                <blockquote className="spread-pull font-gothic" aria-label={pull.replace("\n", " ")}>
                    {pullLines.map((line, i) => (
                        <span key={i} className="spread-pull-line" aria-hidden="true">
                            {line}
                        </span>
                    ))}
                </blockquote>

                <button
                    className="btn-urban spread-cta"
                    aria-label={`Ver serie completa de ${tag}`}
                >
                    VER SERIE →
                </button>
            </div>
        </article>
    );
});

/** Bloque combo brutalista al final */
const ComboBlock = memo(function ComboBlock() {
    const { t } = useLanguage();
    const WA_COMBO = `https://wa.me/18292971687?text=${t.services.combo.waLink}`;

    return (
        <aside className="combo-block" aria-label="El Combo Cabrón — Sesión + Makeup + Hair">
            <div className="combo-label-wrap">
                <span className="combo-badge font-mono-urban">{t.services.combo.badge}</span>
                <h4 className="combo-title font-gothic">
                    {t.services.combo.title.split('\n').map((line, i) => (
                        <span key={i}>{line}{i === 0 && <br />}</span>
                    ))}
                </h4>
            </div>

            <div className="combo-body">
                <div className="combo-vline" aria-hidden="true" />

                <div className="combo-body-text">
                    <p className="combo-copy font-serif">
                        {t.services.combo.copy1}{" "}
                        <strong className="combo-collab">@cuetobeauty</strong>.{" "}
                        {t.services.combo.copy2}
                    </p>

                    <a
                        href={WA_COMBO}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-urban combo-cta"
                        aria-label="Reservar El Combo Cabrón por WhatsApp"
                    >
                        {t.services.combo.cta}
                    </a>
                </div>
            </div>
        </aside>
    );
});

// ── Componente principal ──────────────────────────────────────────────────────
export default function Services() {
    const { t } = useLanguage();
    const revealRef = useReveal();

    return (
        <section
            id="servicios"
            className="services-section bg-black py-20"
            aria-label="Editoriales — La Carta"
        >
            <div ref={revealRef} className="section-container">
                <Masthead />

                <div className="spreads-stack">
                    {t.services.editoriales.map((ed, idx) => (
                        <EditorialSpread
                            key={ed.issue}
                            {...ed}
                            mainImg={EDITORIAL_ASSETS[idx]?.mainImg || "/flow_kids.avif"}
                            thumbs={EDITORIAL_ASSETS[idx]?.thumbs || []}
                        />
                    ))}
                </div>

                <ComboBlock />
            </div>
        </section>
    );
}
