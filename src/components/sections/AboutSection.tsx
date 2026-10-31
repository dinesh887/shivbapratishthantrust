"use client";

import { useLanguageContent } from "@/src/components/layout/LanguageProvider";

export default function AboutSection() {
  const content = useLanguageContent();
  const about = content.sections.about;
  return <section id="about" className="sec about"><div className="w"><div style={{ maxWidth: 440 }}><p className="kick">{about.eyebrow}</p><h2 className="h2" style={{ marginBottom: 24 }}>{about.title}</h2>{about.paragraphs.map((paragraph: string, index: number) => <p key={paragraph} style={{ fontSize: 17, lineHeight: 1.65, margin: index === 0 ? "0 0 22px" : 0 }}>{paragraph}</p>)}</div></div></section>;
}
