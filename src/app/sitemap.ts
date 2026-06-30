import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { waschbaeren } from "@/data/waschbaeren";
import { ratgeberArtikel } from "@/data/ratgeber";

type SitemapEntry = MetadataRoute.Sitemap[number];

function entry(
  path: string,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"] = "monthly"
): SitemapEntry {
  return {
    url: `${getSiteUrl()}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry("/", 1),
    entry("/hilfe", 0.95, "weekly"),
    entry("/ratgeber", 0.95, "weekly"),
    entry("/patenschaften", 0.9),
    entry("/paten", 0.75),
    entry("/waschbaeren", 0.9),
    entry("/unterstuetzen", 0.85),
    entry("/ueber-uns", 0.8),
    entry("/kontakt", 0.75),
    entry("/impressum", 0.3, "yearly"),
    entry("/datenschutz", 0.3, "yearly"),
    ...ratgeberArtikel.map((a) => entry(`/ratgeber/${a.slug}`, 0.85, "monthly")),
    ...waschbaeren.map((w) => entry(`/waschbaeren/${w.slug}`, 0.75)),
  ];
}
