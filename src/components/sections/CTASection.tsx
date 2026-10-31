"use client";

import { useLanguageContent } from "@/src/components/layout/LanguageProvider";

export default function CTASection() {
  const content = useLanguageContent();
  const cta = content.sections.cta;
  return <section className="cta"><div className="w"><p className="kick" style={{ color: "#FFD21F", marginBottom: 12 }}>{cta.eyebrow}</p><h2 className="h2 cta-h">{cta.titleLines.map((line, index) => <span key={line}>{index > 0 && <br/>}{line}</span>)}</h2><a className="btn go cta-b" href={cta.href}>{cta.button} <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#3F0208" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a></div></section>;
}
