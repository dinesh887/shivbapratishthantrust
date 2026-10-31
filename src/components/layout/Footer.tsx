"use client";

import Image from "next/image";
import { useLanguageContent } from "@/src/components/layout/LanguageProvider";

type FooterProps = { className?: string };
type ContactIconName = "phone" | "email" | "location";

function ContactIcon({ name }: { name: ContactIconName }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 19px" }}>
      {name === "phone" && <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.07 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.62a2 2 0 0 1-.45 2.11L9 10.69a16 16 0 0 0 4.31 4.31l1.24-1.24a2 2 0 0 1 2.11-.45c.84.29 1.72.5 2.62.62A2 2 0 0 1 22 16.92Z" />}
      {name === "email" && <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>}
      {name === "location" && <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>}
    </svg>
  );
}

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
          <div style={{ display: "grid", gap: 5, marginTop: 8 }}>
            {footer.contact.lines.map((line) => (
              <div key={line} style={{ display: "flex", alignItems: "center", gap: 9, lineHeight: 1.7 }}>
                <ContactIcon name={line.includes("@") ? "email" : "phone"} />
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <b style={{ color: "#FFD21F" }}>{footer.address.label}</b>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 9, marginTop: 8, lineHeight: 1.7 }}>
            <span style={{ marginTop: 4 }}><ContactIcon name="location" /></span>
            <p style={{ margin: 0 }}>{lines(footer.address.lines)}</p>
          </div>
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
