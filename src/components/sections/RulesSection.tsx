"use client";

import { useLanguageContent } from "@/src/components/layout/LanguageProvider";
import AccordionList from "@/src/components/ui/AccordionList";
import SocialMediaTaggingRule from "@/src/components/sections/SocialMediaTaggingRule";

export default function RulesSection() {
  const content = useLanguageContent();
  const rules = content.sections.rules;
  const ruleItems = content.accordions.rules;
  const insertAfterPhotoVideo = Math.max(0, ruleItems.length - 1);
  return <section id="rules" className="rules"><div className="w rl"><div className="rl-l"><p className="kick">{rules.eyebrow}</p><h2 className="h2 rl-h">{rules.title}</h2><p className="rl-p">{rules.description}</p><i className="rl-line"/></div><div id="rules-accordion-root" className="acc"><AccordionList group="rules" items={ruleItems.slice(0, insertAfterPhotoVideo)}/><SocialMediaTaggingRule/><AccordionList group="rules" items={ruleItems.slice(insertAfterPhotoVideo)} startIndex={insertAfterPhotoVideo}/></div></div></section>;
}
