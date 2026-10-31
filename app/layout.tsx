import type { Metadata } from "next";
import { content } from "@/src/data/content";
import { LanguageProvider } from "@/src/components/layout/LanguageProvider";
import "./globals.css";
import "./design.css";

export const metadata: Metadata = {
  title: content.mr.site.title,
  description: content.mr.site.description,
  icons: {
    icon: content.mr.site.favicon,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Mukta:wght@400;600;800&family=Yatra+One&display=swap" rel="stylesheet" />
      </head>
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}



