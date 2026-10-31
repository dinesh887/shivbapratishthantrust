"use client";

import { useLanguageContent } from "@/src/components/layout/LanguageProvider";

export default function CertificatePreviewLoading() {
  const content = useLanguageContent();
  return <p className="certificate-tab-message" role="status">{content.certificatePreview.loading}</p>;
}
