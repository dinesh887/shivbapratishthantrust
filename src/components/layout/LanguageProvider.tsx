"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { content, type Language, type WebsiteLanguageContent } from "@/src/data/content";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  content: WebsiteLanguageContent;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("mr");

  useEffect(() => {
    const saved = window.localStorage.getItem("shivba-language");
    if (saved === "mr" || saved === "en") setLanguageState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = content[language].site.title;

    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = content[language].site.description;
  }, [language]);

  const setLanguage = (nextLanguage: Language) => {
    window.localStorage.setItem("shivba-language", nextLanguage);
    document.documentElement.lang = nextLanguage;
    setLanguageState(nextLanguage);
  };

  const value = useMemo(() => ({ language, setLanguage, content: content[language] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used within LanguageProvider");
  return value;
}

export function useLanguageContent() {
  return useLanguage().content;
}
