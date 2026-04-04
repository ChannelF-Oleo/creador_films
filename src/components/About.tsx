"use client";

import Image from "next/image";
import { memo } from "react";
import useReveal from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";

// ── Constantes ────────────────────────────────────────────────────────────────
const WA_TEXT = encodeURIComponent("Klk mio, me gustaria agendar una sesion de fotos");
const WA_LINK = `https://wa.me/18292971687?text=${WA_TEXT}`;

// ── Sub-componentes ───────────────────────────────────────────────────────────
const ChefImage = memo(function ChefImage() {
  return (
    <div className="chef-image-wrapper animate-fadeUp">
      <div className="chef-image-frame" aria-hidden="true" />
      <div className="chef-image-container">
        <Image
          src="/about.avif"
          alt="Edwin — El Chef de las Fotos"
          fill
          className="chef-photo grayscale contrast-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="corner-accent-top" aria-hidden="true" />
      <div className="corner-accent-left" aria-hidden="true" />
      <div className="chef-image-shadow" aria-hidden="true" />
    </div>
  );
});

const IngredienteRow = memo(function IngredienteRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="ingredient-item">
      <div className="ingredient-info">
        <span className="ingredient-label">{label}</span>
        <span className="ingredient-value">{value}</span>
      </div>
      <div
        className="ingredient-bar-bg"
        role="meter"
        aria-label={`${label}: ${value}`}
        aria-valuenow={parseInt(value)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="ingredient-bar-fill" style={{ width: value }} />
      </div>
    </div>
  );
});

export default function About() {
  const { t, lang } = useLanguage();
  const ref = useReveal();

  return (
    <section id="chef" className="chef-section" aria-label="Edwin — El Chef">
      <div className="grain-layer" aria-hidden="true" />

      <div ref={ref} className="section-container chef-grid">
        <ChefImage />
        
        <div className="chef-text-content">
          <p className="chef-eyebrow animate-fadeUp [animation-delay:200ms]">
            — Edwin de León
          </p>

          <h2 className="chef-name font-gothic animate-fadeUp [animation-delay:400ms]">
            {t.about.chef}
          </h2>

          <div className="chef-description animate-fadeUp [animation-delay:600ms]">
            <p className="font-serif">
              {t.about.description1}
            </p>
            <p className="font-serif italic text-bone">
              {t.about.description2}
            </p>
          </div>

          <div className="ingredients-container animate-fadeUp [animation-delay:800ms]">
            <p className="ingredients-title">{t.about.ingredientsTitle}</p>
            <div className="ingredients-grid">
              {t.about.ingredients.map((ing) => (
                <IngredienteRow key={ing.label} {...ing} />
              ))}
            </div>
          </div>

          <div className="animate-fadeUp [animation-delay:1000ms]">
            <a 
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-urban"
              aria-label="Contact Edwin via WhatsApp"
            >
              {t.about.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
