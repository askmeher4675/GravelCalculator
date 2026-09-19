import type { MetadataRoute } from "next";
import { calculators } from "@/lib/calculators";
import { pageDates, SITE_URL } from "@/lib/site";

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
    lastModified: new Date(pageDates(route).modified),
    priority: route === "" ? 1 : 0.7,
  }));

  const calculatorEntries = Object.keys(calculators).map((slug) => ({
    url: `${SITE_URL}/calculators/${slug}`,
    lastModified: new Date(pageDates(`/calculators/${slug}`).modified),
    priority: slug === "gravel-calculator" ? 0.9 : 0.8,
  }));

  return [...staticEntries, ...calculatorEntries];
}
