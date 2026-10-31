import { Suspense } from "react";
import designContent from "../design-content";
import CertificatePreviewClient from "./preview-client";

const headerMarkup = designContent.match(/<header\b[\s\S]*?<\/header>/i)?.[0] || "";
const footerMarkup = designContent.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] || "";

function pageLinks(markup) {
  return markup.replace(/href="#/g, 'href="/#');
}

async function CertificatePreviewTransfer({ searchParams }) {
  const params = await searchParams;
  const channelId = typeof params?.channel === "string" && /^[a-zA-Z0-9-]{1,80}$/.test(params.channel)
    ? params.channel
    : "";

  return <CertificatePreviewClient channelId={channelId} />;
}

function PreviewLoading() {
  return <p className="certificate-tab-message" role="status">प्रमाणपत्र लोड करत आहोत…</p>;
}

export default function CertificatePreviewPage({ searchParams }) {
  return (
    <>
      <div className="certificate-page-header hero" dangerouslySetInnerHTML={{ __html: pageLinks(headerMarkup) }} />
      <main className="certificate-page-main">
        <div className="certificate-page-title">
          <p className="kick">शिवबा प्रतिष्ठान ट्रस्ट</p>
          <h1>Certificate Preview</h1>
          <p>तुमचे सहभाग प्रमाणपत्र</p>
        </div>
        <Suspense fallback={<PreviewLoading />}>
          <CertificatePreviewTransfer searchParams={searchParams} />
        </Suspense>
      </main>
      <div className="certificate-page-footer" dangerouslySetInnerHTML={{ __html: pageLinks(footerMarkup) }} />
    </>
  );
}
