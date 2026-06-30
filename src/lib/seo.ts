import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { sitePhotos } from "@/data/photos";
import { getSiteUrl } from "@/lib/siteUrl";

const DEFAULT_OG_IMAGE = sitePhotos.hero;

export type PageSeo = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  /** Absoluter Pfad zum OG-Bild, z. B. /photos/site/hero-pexels.jpg */
  ogImage?: string;
  ogImageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function absoluteUrl(path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized === "/" ? "" : normalized}`;
}

export function createMetadata({
  title,
  description,
  path = "",
  keywords = [],
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = "Waschbär – Wilde Heimat, private Initiative für Waschbärhilfe",
  type = "website",
  noIndex = false,
}: PageSeo): Metadata {
  const canonicalPath = path || "/";
  const url = absoluteUrl(canonicalPath);
  const imageUrl = ogImage.startsWith("http") ? ogImage : absoluteUrl(ogImage);

  const isHome = canonicalPath === "/" && title === siteConfig.name;
  const pageTitle =
    isHome
      ? `${siteConfig.name} – Waschbärhilfe, Patenschaften & Ratgeber`
      : title;

  return {
    title: isHome ? { absolute: pageTitle } : pageTitle,
    description,
    keywords: [...new Set([...siteConfig.keywords, ...keywords])],
    authors: [{ name: "Julia Rothmann", url: absoluteUrl("/ueber-uns") }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "Tierschutz & Natur",
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: "de_DE",
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteConfig.name} – Waschbärhilfe, Patenschaften & Ratgeber`,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};
