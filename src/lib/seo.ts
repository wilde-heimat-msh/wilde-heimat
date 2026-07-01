import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { siteShareImage } from "@/data/photos";
import { getSiteUrl } from "@/lib/siteUrl";

const DEFAULT_OG_IMAGE = siteShareImage;
const DEFAULT_OG_WIDTH = 1200;
const DEFAULT_OG_HEIGHT = 630;

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
  publishedTime?: string;
  modifiedTime?: string;
};

export function absoluteUrl(path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized === "/" ? "" : normalized}`;
}

/** Favicon & App-Icons – auf jeder Seite im Tab sichtbar */
export const siteIcons: NonNullable<Metadata["icons"]> = {
  icon: [
    { url: "/favicon.ico", sizes: "32x32" },
    { url: "/icon.png", type: "image/png", sizes: "192x192" },
    { url: "/icon.png", type: "image/png", sizes: "512x512" },
  ],
  apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  shortcut: "/favicon.ico",
};

export function adminMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
    icons: siteIcons,
  };
}

export function createMetadata({
  title,
  description,
  path = "",
  keywords = [],
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = "Wilde Heimat – Logo",
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
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
    icons: siteIcons,
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
      ...(type === "article" && publishedTime
        ? { publishedTime, modifiedTime: modifiedTime ?? publishedTime }
        : {}),
      images: [
        {
          url: imageUrl,
          width: ogImage === DEFAULT_OG_IMAGE ? DEFAULT_OG_WIDTH : 1200,
          height: ogImage === DEFAULT_OG_IMAGE ? DEFAULT_OG_HEIGHT : 630,
          alt: ogImageAlt,
          type: imageUrl.endsWith(".png") ? "image/png" : undefined,
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
  icons: siteIcons,
  openGraph: {
    siteName: siteConfig.name,
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: absoluteUrl(siteShareImage),
        width: DEFAULT_OG_WIDTH,
        height: DEFAULT_OG_HEIGHT,
        alt: "Wilde Heimat – Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [absoluteUrl(siteShareImage)],
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION || "QfuhirGa1T8RJZGzCYvdmgLPtt2DqrVFmReuG1SCOgY"
    ? {
        verification: {
          google:
            process.env.GOOGLE_SITE_VERIFICATION ??
            "QfuhirGa1T8RJZGzCYvdmgLPtt2DqrVFmReuG1SCOgY",
        },
      }
    : {}),
};
