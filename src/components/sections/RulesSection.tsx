"use client";

import { useLanguageContent } from "@/src/components/layout/LanguageProvider";
import AccordionList from "@/src/components/ui/AccordionList";

export default function RulesSection() {
  const content = useLanguageContent();
  const rules = content.sections.rules;
  return <section id="rules" className="rules"><div className="w rl"><div className="rl-l"><p className="kick">{rules.eyebrow}</p><h2 className="h2 rl-h">{rules.title}</h2><p className="rl-p">{rules.description}</p><i className="rl-line"/></div><div id="rules-accordion-root" className="acc"><AccordionList group="rules" items={content.accordions.rules}/></div></div></section>;
}
