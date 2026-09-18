import type { MetadataRoute } from "next";
import { calculators } from "@/lib/calculators";

const SITE_URL = "https://gravelcostcalculator.com";

const STATIC_ROUTES = [
  "",
  "/calculators",
  "/guides",
  "/guides/gravel-driveway",
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
    priority: route === "" ? 1 : 0.7,
  }));

  const calculatorEntries = Object.keys(calculators).map((slug) => ({
    url: `${SITE_URL}/calculators/${slug}`,
    priority: slug === "gravel-calculator" ? 0.9 : 0.8,
  }));

  return [...staticEntries, ...calculatorEntries];
}
