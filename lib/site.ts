export const SITE_URL = "https://gravelcostcalculator.com";
export const SITE_NAME = "Gravel Cost Calculator";
export const SITE_DESCRIPTION =
  "Free calculators and guides for estimating gravel, concrete, mulch, topsoil, pavers, sod, fencing, paint, and decking: volume, weight, and cost.";

/** Date content was last meaningfully updated site-wide; fallback for pages without their own entry. */
export const CONTENT_UPDATED = "2026-09-19";

/** Per-page publish/modify dates (ISO). Update `modified` when a page's content meaningfully changes. */
export const PAGE_DATES: Record<string, { published: string; modified: string }> = {
  "": { published: "2026-09-17", modified: "2026-09-19" },
  "/calculators": { published: "2026-09-18", modified: "2026-09-19" },
  "/guides": { published: "2026-09-18", modified: "2026-09-19" },
  "/guides/gravel-driveway": { published: "2026-09-18", modified: "2026-09-19" },
  "/guides/gravel-cost-per-ton": { published: "2026-09-19", modified: "2026-09-19" },
  "/guides/gravel-coverage-chart": { published: "2026-09-19", modified: "2026-09-19" },
  "/guides/gravel-types-and-sizes": { published: "2026-09-19", modified: "2026-09-19" },
  "/guides/concrete-slab-thickness": { published: "2026-09-18", modified: "2026-09-19" },
  "/guides/mulch-depth": { published: "2026-09-18", modified: "2026-09-19" },
  "/methodology": { published: "2026-09-18", modified: "2026-09-19" },
  "/about": { published: "2026-09-18", modified: "2026-09-19" },
  "/contact": { published: "2026-09-18", modified: "2026-09-19" },
  "/privacy": { published: "2026-09-18", modified: "2026-09-19" },
  "/terms": { published: "2026-09-18", modified: "2026-09-19" },
  "/disclaimer": { published: "2026-09-18", modified: "2026-09-19" },
};

export function pageDates(path: string) {
  return PAGE_DATES[path] ?? { published: CONTENT_UPDATED, modified: CONTENT_UPDATED };
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
