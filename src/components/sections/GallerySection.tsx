"use client";

import Image from "next/image";
import { useLanguageContent } from "@/src/components/layout/LanguageProvider";

export default function GallerySection() {
  const content = useLanguageContent();
  const gallery = content.sections.gallery;
  return <section id="gallery" className="sec"><div className="w"><p className="kick">{gallery.eyebrow}</p><h2 className="h2">{gallery.title}</h2><div className="grid three g6" style={{ gridTemplateColumns: "repeat(3,1fr)", marginTop: 32 }}>{gallery.items.map((item) => <div className="ph gallery-photo" key={item.src}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 820px) 100vw, 33vw" /></div>)}</div></div></section>;
}
