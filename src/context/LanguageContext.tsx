"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Language, TranslationDict, translations } from "@/translations";

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>("es");

    useEffect(() => {
        // Detect browser language
        const browserLang = window.navigator.language.split("-")[0] as Language;
        if (browserLang === "en" || browserLang === "es") {
            setLang(browserLang);
        }
    }, []);

    const value = {
        lang,
        setLang,
        t: translations[lang]
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
