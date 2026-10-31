import { Suspense } from "react";
import Footer from "@/src/components/layout/Footer";
import Header from "@/src/components/layout/Header";
import CertificatePreviewSection from "@/src/components/sections/CertificatePreviewSection";
import CertificatePreviewLoading from "@/src/components/sections/CertificatePreviewLoading";

type CertificatePreviewPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function PreviewRouteContent({ searchParams }: CertificatePreviewPageProps) {
  const params = await searchParams;
  const channelId = typeof params.channel === "string" && /^[a-zA-Z0-9-]{1,80}$/.test(params.channel)
    ? params.channel
    : "";

  return <CertificatePreviewSection channelId={channelId} />;
}

export default function CertificatePreviewPage({ searchParams }: CertificatePreviewPageProps) {
  return (
    <>
      <Header className="certificate-page-header hero" homeLinks />
      <Suspense fallback={<CertificatePreviewLoading />}>
        <PreviewRouteContent searchParams={searchParams} />
      </Suspense>
      <Footer className="certificate-page-footer" />
    </>
  );
}
