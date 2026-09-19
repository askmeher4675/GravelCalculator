import type { MetadataRoute } from "next";
import { calculators } from "@/lib/calculators";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/site";

const LAST_MODIFIED = new Date(CONTENT_UPDATED);

const STATIC_ROUTES = [
  "",
  "/calculators",
  "/guides",
  "/guides/gravel-driveway",
  "/guides/gravel-cost-per-ton",
  "/guides/gravel-coverage-chart",
  "/guides/gravel-types-and-sizes",
  "/guides/concrete-slab-thickness",
  "/guides/mulch-depth",
  "/methodology",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: LAST_MODIFIED,
    priority: route === "" ? 1 : 0.7,
  }));

  const calculatorEntries = Object.keys(calculators).map((slug) => ({
    url: `${SITE_URL}/calculators/${slug}`,
    lastModified: LAST_MODIFIED,
    priority: slug === "gravel-calculator" ? 0.9 : 0.8,
  }));

  return [...staticEntries, ...calculatorEntries];
}
