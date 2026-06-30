import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/data/site";
import { jsonLdGraph, organizationSchema, websiteSchema } from "@/lib/jsonLd";
import { createMetadata, rootMetadata } from "@/lib/seo";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2a3326",
};

export const metadata: Metadata = {
  ...rootMetadata,
  ...createMetadata({
    title: siteConfig.name,
    description:
      "Waschbärhilfe, Patenschaften und Ratgeber von Wilde Heimat – private Initiative von Juja in Mansfeld-Südharz (Sachsen-Anhalt). Waschbär gefunden? Fund melden, Patenschaft übernehmen, Aufklärung statt Vorurteile.",
    path: "/",
    keywords: ["Waschbärhilfe Mansfeld-Südharz", "Waschbär Patenschaft Sachsen-Anhalt"],
  }),
};

const rootStructuredData = jsonLdGraph([organizationSchema(), websiteSchema()]);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={rootStructuredData} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
