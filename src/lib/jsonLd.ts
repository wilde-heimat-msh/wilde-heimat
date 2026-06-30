import { siteConfig } from "@/data/site";
import { absoluteUrl } from "@/lib/seo";
import { getSiteUrl } from "@/lib/siteUrl";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type ArticleSchemaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

type FaqItem = {
  question: string;
  answer: string;
};

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${getSiteUrl()}/#organization`,
    name: siteConfig.name,
    url: getSiteUrl(),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.svg"),
    },
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.street,
      postalCode: siteConfig.contact.postalCode,
      addressLocality: siteConfig.contact.city,
      addressCountry: "DE",
    },
    email: siteConfig.email,
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: siteConfig.operatingArea,
        containedInPlace: {
          "@type": "State",
          name: siteConfig.state,
        },
      },
      {
        "@type": "Country",
        name: "Deutschland",
      },
    ],
    knowsAbout: [
      "Waschbärhilfe",
      "Waschbärbaby gefunden",
      "Waschbär Patenschaft",
      "Wildtieraufklärung",
    ],
    sameAs: [siteConfig.instagram, siteConfig.tiktok, siteConfig.gofundme].filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    name: siteConfig.name,
    url: getSiteUrl(),
    description: siteConfig.description,
    inLanguage: "de-DE",
    publisher: { "@id": `${getSiteUrl()}/#organization` },
  };
}

export function webPageSchema({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    isPartOf: { "@id": `${getSiteUrl()}/#website` },
    about: { "@id": `${getSiteUrl()}/#organization` },
    inLanguage: "de-DE",
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema({ title, description, path, keywords = [] }: ArticleSchemaInput) {
  return {
    "@type": "Article",
    "@id": `${absoluteUrl(path)}#article`,
    headline: title,
    description,
    url: absoluteUrl(path),
    inLanguage: "de-DE",
    keywords: keywords.join(", "),
    author: { "@id": `${getSiteUrl()}/#organization` },
    publisher: { "@id": `${getSiteUrl()}/#organization` },
    mainEntityOfPage: { "@id": `${absoluteUrl(path)}#webpage` },
    isPartOf: { "@id": `${getSiteUrl()}/#website` },
  };
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function itemListSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function jsonLdGraph(schemas: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}
