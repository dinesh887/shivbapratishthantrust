"use client";

import Image from "next/image";
import { useLanguageContent } from "@/src/components/layout/LanguageProvider";
import Header from "@/src/components/layout/Header";

export default function HeroSection() {
  const content = useLanguageContent();
  const hero = content.sections.top;
  return (
    <section id="top" className="hero" style={{ position: "relative", color: "#FBF3E4", padding: "160px 0 88px" }}>
      <Header />
      <div className="w">
        <div style={{ maxWidth: 520 }}>
          <p className="kick" style={{ color: "#FFD21F" }}>{hero.tagline}</p>
          <h1 style={{ margin: "0 0 16px" }}><Image className="ttl" src={hero.image.src} alt={hero.image.alt} width={900} height={738} priority style={{ display: "block", width: "100%", maxWidth: 340, height: "auto", filter: "drop-shadow(0 8px 20px rgba(0,0,0,.4))" }} /></h1>
          <p style={{ fontSize: 20, lineHeight: 1.6, margin: "0 0 32px", maxWidth: 520 }}>{hero.description}</p>
          <a className="btn pri" href={hero.primaryHref} style={{ marginRight: 12 }}>{hero.primaryButton}</a><a className="btn sec2" href={hero.secondaryHref}>{hero.secondaryButton}</a>
          <div style={{ display: "flex", gap: 32, marginTop: 40, flexWrap: "wrap" }}>{hero.details.map((item) => <div key={item.label}><b style={{ color: "#FFD21F" }}>{item.label}</b><br />{item.value}</div>)}</div>
        </div>
      </div>
    </section>
  );
}
