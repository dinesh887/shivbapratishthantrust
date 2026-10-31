import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "शिवबा प्रतिष्ठान – गडकोट बांधणी स्पर्धा",
  description: "शिवबा प्रतिष्ठान गडकोट बांधणी स्पर्धा",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mr">
      <head>
        <link rel="stylesheet" href="/design.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;800&family=Yatra+One&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}


