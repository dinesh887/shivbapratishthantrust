"use client";

import { useEffect, useState } from "react";
import { useLanguage, useLanguageContent } from "@/src/components/layout/LanguageProvider";

type PreviewState = { status: "loading" | "error" | "ready"; name: string; url: string; message: string };

export default function CertificatePreviewClient({ channelId }: { channelId: string }) {
  const { language } = useLanguage();
  const content = useLanguageContent();
  const [preview, setPreview] = useState<PreviewState>(() => channelId
    ? { status: "loading", name: "", url: "", message: content.certificatePreview.loading }
    : { status: "error", name: "", url: "", message: content.certificatePreview.unavailable });

  useEffect(() => {
    if (!channelId || !("BroadcastChannel" in window)) return;

    const channel = new BroadcastChannel(`shivba-certificate-${channelId}`);
    let objectUrl = "";
    let received = false;
    const timeout = window.setTimeout(() => {
      if (received) return;
      received = true;
      setPreview({ status: "error", name: "", url: "", message: content.certificatePreview.notLoaded });
    }, 20000);

    channel.onmessage = ({ data }) => {
      if (data?.type === "timeout") {
        received = true;
        window.clearTimeout(timeout);
        setPreview({ status: "error", name: "", url: "", message: content.certificatePreview.notLoaded });
        return;
      }
      if (data?.type !== "certificate" || received || !(data.blob instanceof Blob) || data.blob.type !== "application/pdf") return;

      received = true;
      window.clearTimeout(timeout);
      objectUrl = URL.createObjectURL(data.blob);
      setPreview({ status: "ready", name: data.name || "", url: objectUrl, message: "" });
      channel.postMessage({ type: "received" });
    };

    channel.postMessage({ type: "ready" });
    return () => {
      channel.close();
      window.clearTimeout(timeout);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [channelId, language]);

  useEffect(() => {
    setPreview((current) => current.status === "ready" ? current : {
      ...current,
      message: current.status === "loading" ? content.certificatePreview.loading : content.certificatePreview.unavailable,
    });
  }, [language]);

  const filename = `Certificate_${preview.name.replace(/[^\p{L}\p{N} -]/gu, "").trim().replace(/\s+/g, "_") || "Participant"}.pdf`;

  return (
    <section className="certificate-tab-content" aria-label={content.certificatePreview.participationCertificate}>
      {preview.status === "loading" && <p className="certificate-tab-message" role="status">{preview.message}</p>}
      {preview.status === "error" && <p className="certificate-tab-message error" role="alert">{preview.message}</p>}
      {preview.status === "ready" && (
        <>
          <div className="certificate-tab-toolbar">
            <p>{content.certificatePreview.label} <strong>{preview.name}</strong></p>
            <a className="btn pri" href={preview.url} download={filename}>{content.certificatePreview.download}</a>
          </div>
          <div className="certificate-tab-document">
            <iframe src={preview.url} title={`${content.certificatePreview.participationCertificate} for ${preview.name}`} />
          </div>
        </>
      )}
    </section>
  );
}
