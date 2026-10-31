"use client";

import Image from "next/image";
import { useLanguageContent } from "@/src/components/layout/LanguageProvider";

type FooterProps = { className?: string };

export default function Footer({ className }: FooterProps) {
  const content = useLanguageContent();
  const footer = content.layout.footer;
  const lines = (values: string[]) => values.map((line, index) => <span key={`${index}-${line}`}>{index > 0 && <br />}{line}</span>);
  const markup = (
    <footer style={{ background: "#3F0208", color: "#FBF3E4", padding: "48px 0" }}>
      <div className="w grid three" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Image src={footer.logo.src} alt={footer.logo.alt} width={footer.logo.width} height={footer.logo.height} style={{ width: footer.logo.width, height: footer.logo.height, objectFit: "contain" }} />
          <div>
            <b style={{ fontSize: 22 }}>{footer.brand}</b>
            <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>{lines(footer.description)}</p>
          </div>
        </div>
        <div>
          <b style={{ color: "#FFD21F" }}>{footer.contact.label}</b>
          <p style={{ margin: "8px 0 0", lineHeight: 1.7 }}>{lines(footer.contact.lines)}</p>
        </div>
        <div>
          <b style={{ color: "#FFD21F" }}>{footer.address.label}</b>
          <p style={{ margin: "8px 0 0", lineHeight: 1.7 }}>{lines(footer.address.lines)}</p>
        </div>
      </div>
      <div className="w" style={{ marginTop: 24 }}>
        <a
          href={footer.social.instagram.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={footer.social.instagram.label}
          title={footer.social.instagram.label}
          style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "inherit" }}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
          </svg>
          <span>{footer.social.instagram.label}</span>
        </a>
      </div>
      <p className="w" style={{ marginTop: 32, fontSize: 14, opacity: 0.8 }}>{footer.copyright}</p>
    </footer>
  );
  return className ? <div className={className}>{markup}</div> : markup;
}
