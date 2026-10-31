"use client";

import { useLanguageContent } from "@/src/components/layout/LanguageProvider";
import CertificatePreviewClient from "@/src/components/sections/CertificatePreviewClient";

export default function CertificatePreviewSection({ channelId }: { channelId: string }) {
  const content = useLanguageContent();
  return (
    <main className="certificate-page-main">
      <div className="certificate-page-title">
        <p className="kick">{content.layout.header.brand}</p>
        <h1>{content.certificatePreview.title}</h1>
        <p>{content.certificatePreview.subtitle}</p>
      </div>
      <CertificatePreviewClient channelId={channelId} />
    </main>
  );
}