"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage, useLanguageContent } from "@/src/components/layout/LanguageProvider";

type HeaderProps = { className?: string; homeLinks?: boolean };

export default function Header({ className, homeLinks = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const content = useLanguageContent();
  const header = content.layout.header;
  const href = (path: string) => homeLinks && path.startsWith("#") ? `/${path}` : path;

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const navigationLinks = header.navigation.map((item) => (
    <a key={item.href} href={href(item.href)} onClick={() => setMenuOpen(false)}>{item.label}</a>
  ));
  const languageSwitcher = content.languageSwitcher;
  const languageButtons = (
    <div className="language-switch" aria-label={languageSwitcher.label}>
      <button type="button" className={language === "mr" ? "active" : ""} aria-pressed={language === "mr"} onClick={() => setLanguage("mr")}>{languageSwitcher.marathi}</button>
      <button type="button" className={language === "en" ? "active" : ""} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>{languageSwitcher.english}</button>
    </div>
  );

  const markup = (
    <header style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 5, color: "#FBF3E4", background: "linear-gradient(180deg,rgba(63,2,8,.92) 0%,rgba(63,2,8,0) 100%)" }}>
      <div className="w hbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <a href={href("#top")} className="header-brand" style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 800, fontSize: 20 }}>
          <Image src={header.logo.src} alt={header.logo.alt} width={header.logo.width} height={header.logo.height} style={{ width: header.logo.width, height: header.logo.height, objectFit: "contain" }} />
          <span className="header-brand-copy">
            <span className="header-brand-name">{header.brand}</span>
            <span className="header-registration-number">{language === "mr" ? "नोंदणी क्र.: E-36744(m)" : "Registration No.: E-36744(m)"}</span>
          </span>
        </a>
        <nav className="nav" aria-label={header.navLabel}>{navigationLinks}</nav>
        <div className="desktop-language-switch">{languageButtons}</div>
        <a className="btn pri hbtn" href={href(header.action.href)} style={{ padding: "10px 20px", minHeight: 44 }}>{header.action.label}</a>
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuOpen ? content.messages.menuClose : content.messages.menuOpen}
          aria-expanded={menuOpen}
          aria-controls="site-mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>
      <nav id="site-mobile-navigation" className="mobile-nav" aria-label={header.navLabel} hidden={!menuOpen}>
        {navigationLinks}
        <div className="mobile-language-switch">{languageButtons}</div>
        <a className="mobile-register" href={href(header.action.href)} onClick={() => setMenuOpen(false)}>{header.action.label}</a>
      </nav>
    </header>
  );

  const wrapperClassName = className ? `${className}${menuOpen ? " menu-open" : ""}` : undefined;
  return wrapperClassName ? <div className={wrapperClassName}>{markup}</div> : markup;
}
