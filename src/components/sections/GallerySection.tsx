"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguageContent } from "@/src/components/layout/LanguageProvider";

export default function GallerySection() {
  const content = useLanguageContent();
  const gallery = content.sections.gallery;
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isLightboxOpen = selectedIndex !== null;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const visibleItems = activeCategory === "all"
    ? gallery.items
    : gallery.items.filter((item) => item.category === activeCategory);
  const displayedItems = visibleItems.slice(0, visibleCount);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedIndex(null);
      } else if (event.key === "ArrowLeft" && visibleItems.length > 1) {
        event.preventDefault();
        setSelectedIndex((index) => index === null ? null : (index - 1 + visibleItems.length) % visibleItems.length);
      } else if (event.key === "ArrowRight" && visibleItems.length > 1) {
        event.preventDefault();
        setSelectedIndex((index) => index === null ? null : (index + 1) % visibleItems.length);
      } else if (event.key === "Tab") {
        const focusable = document.querySelectorAll<HTMLButtonElement>(".gallery-lightbox button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      activeTriggerRef.current?.focus();
    };
  }, [isLightboxOpen, visibleItems.length]);

  return (
    <section id="gallery" className="sec">
      <div className="w">
        <div className="gallery-heading">
          <p className="kick">{gallery.eyebrow}</p>
          <h2 className="h2">{gallery.title}</h2>
          <p className="gallery-subtitle">{gallery.subtitle}</p>
        </div>
        <div className="gallery-tabs" role="group" aria-label={gallery.title}>
          {gallery.categories.map((category) => (
            <button
              className="gallery-filter"
              type="button"
              key={category.id}
              aria-pressed={activeCategory === category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setVisibleCount(9);
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
        {displayedItems.length > 0 ? (
          <div id="gallery-grid" className="grid three g6 gallery-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            {displayedItems.map((item) => (
              <button
                className="ph gallery-photo"
                key={item.src}
                type="button"
                aria-label={item.alt}
                aria-haspopup="dialog"
                onClick={(event) => {
                  activeTriggerRef.current = event.currentTarget;
                  setSelectedIndex(visibleItems.findIndex((visibleItem) => visibleItem.src === item.src));
                }}
              >
                <Image src={item.src} alt={item.alt} fill sizes="(max-width: 820px) 100vw, 33vw" />
              </button>
            ))}
          </div>
        ) : (
          <p className="gallery-empty" role="status">{gallery.noResults}</p>
        )}
        {visibleItems.length > visibleCount && (
          <div className="gallery-more">
            <button className="btn pri" type="button" aria-controls="gallery-grid" onClick={() => setVisibleCount((count) => count + 9)}>
              {gallery.showMore}
            </button>
          </div>
        )}
      </div>
      {selectedIndex !== null && visibleItems[selectedIndex] && (
        <div
          className="gallery-lightbox"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedIndex(null);
          }}
        >
          <div className="gallery-lightbox-panel" role="dialog" aria-modal="true" aria-label={gallery.title}>
            <button
              className="gallery-lightbox-close"
              type="button"
              aria-label={gallery.closePreview}
              onClick={() => setSelectedIndex(null)}
              ref={closeButtonRef}
            >
              ×
            </button>
            {visibleItems.length > 1 && (
              <>
                <button
                  className="gallery-lightbox-nav gallery-lightbox-prev"
                  type="button"
                  aria-label={gallery.previousImage}
                  onClick={() => setSelectedIndex((index) => index === null ? null : (index - 1 + visibleItems.length) % visibleItems.length)}
                >
                  ‹
                </button>
                <button
                  className="gallery-lightbox-nav gallery-lightbox-next"
                  type="button"
                  aria-label={gallery.nextImage}
                  onClick={() => setSelectedIndex((index) => index === null ? null : (index + 1) % visibleItems.length)}
                >
                  ›
                </button>
              </>
            )}
            <div className="gallery-lightbox-frame">
              <Image
                src={visibleItems[selectedIndex].src}
                alt={visibleItems[selectedIndex].alt}
                fill
                sizes="100vw"
                priority
              />
            </div>
            <p className="gallery-lightbox-caption">{visibleItems[selectedIndex].alt}</p>
            <span className="gallery-lightbox-count" aria-live="polite">
              {selectedIndex + 1} / {visibleItems.length}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
