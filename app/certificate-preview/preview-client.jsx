"use client";

import { useEffect, useState } from "react";

export default function CertificatePreviewClient({ channelId }) {
  const [preview, setPreview] = useState(() => channelId
    ? { status: "loading", name: "", url: "", message: "प्रमाणपत्र लोड करत आहोत…" }
    : { status: "error", name: "", url: "", message: "Certificate preview उपलब्ध नाही. कृपया नोंदणी पानावरून पुन्हा उघडा." });

  useEffect(() => {
    if (!channelId || !("BroadcastChannel" in window)) return;

    const channel = new BroadcastChannel(`shivba-certificate-${channelId}`);
    let objectUrl = "";
    let received = false;
    const timeout = window.setTimeout(() => {
      if (received) return;
      received = true;
      setPreview({ status: "error", name: "", url: "", message: "Certificate preview लोड झाले नाही. कृपया मागील tab मधून पुन्हा प्रयत्न करा." });
    }, 20000);

    channel.onmessage = ({ data }) => {
      if (data?.type === "timeout") {
        received = true;
        window.clearTimeout(timeout);
        setPreview({ status: "error", name: "", url: "", message: "Certificate preview लोड झाले नाही. कृपया मागील tab मधून पुन्हा प्रयत्न करा." });
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
  }, [channelId]);

  const filename = `Certificate_${preview.name.replace(/[^\p{L}\p{N} -]/gu, "").trim().replace(/\s+/g, "_") || "Participant"}.pdf`;

  return (
    <section className="certificate-tab-content" aria-label="Participation certificate">
      {preview.status === "loading" && <p className="certificate-tab-message" role="status">{preview.message}</p>}
      {preview.status === "error" && <p className="certificate-tab-message error" role="alert">{preview.message}</p>}
      {preview.status === "ready" && (
        <>
          <div className="certificate-tab-toolbar">
            <p>प्रमाणपत्र: <strong>{preview.name}</strong></p>
            <a className="btn pri" href={preview.url} download={filename}>Download Certificate</a>
          </div>
          <div className="certificate-tab-document">
            <iframe src={preview.url} title={`Participation certificate for ${preview.name}`} />
          </div>
        </>
      )}
    </section>
  );
}
