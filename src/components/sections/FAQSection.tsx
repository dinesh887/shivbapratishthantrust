"use client";

import { useLanguageContent } from "@/src/components/layout/LanguageProvider";
import AccordionList from "@/src/components/ui/AccordionList";

export default function FAQSection() {
  const content = useLanguageContent();
  const faq = content.sections.faq;
  return <section id="faq" className="faq"><div className="w rl"><div><p className="kick" style={{ color: "#FFD21F" }}>{faq.eyebrow}</p><h2 className="h2" style={{ color: "#FBF3E4", fontSize: 40 }}>{faq.title}</h2></div><div id="faq-accordion-root" className="fq"><AccordionList group="faq" items={content.accordions.faq}/></div></div></section>;
}
