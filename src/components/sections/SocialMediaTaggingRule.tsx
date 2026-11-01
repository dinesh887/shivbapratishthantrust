"use client";

import { useLanguage } from "@/src/components/layout/LanguageProvider";

const INSTAGRAM_URL = "https://www.instagram.com/__shivbapratishthantrust__/";

export default function SocialMediaTaggingRule() {
  const { language } = useLanguage();
  const copy = language === "en"
    ? {
      title: "Social Media Tagging & Collaboration",
      text: "Post your competition fort video on Instagram, tag @__shivbapratishthantrust__, and invite Shivba Pratishthan Trust (Reg.) as a collaborator on the post.",
      link: "Open the official Instagram profile",
    }
    : {
      title: "सोशल मीडिया टॅगिंग आणि सहकार्य",
      text: "स्पर्धेसाठीचा किल्ल्याचा व्हिडिओ Instagram वर पोस्ट करा, @__shivbapratishthantrust__ ला tag करा आणि Shivba Pratishthan Trust (Reg.) ला पोस्टमध्ये collaborator म्हणून invite करा.",
      link: "अधिकृत Instagram प्रोफाइल पहा",
    };

  return (
    <section className="social-rule" aria-labelledby="social-rule-title">
      <span className="social-rule-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.8" r=".8" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <div>
        <h3 id="social-rule-title">{copy.title}</h3>
        <p>{copy.text}</p>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">{copy.link}</a>
      </div>
    </section>
  );
}
