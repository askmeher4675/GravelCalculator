import type { Metadata } from "next";
import { SITE_NAME, pageDates } from "@/lib/site";

type PageTitle = string | { absolute: string };

/** Metadata with a self-canonical and complete Open Graph tags (og:url, og:title, siteName, image). */
export function pageMetadata({
  path,
  title,
  description,
  article = false,
}: {
  path: string;
  title: PageTitle;
  description: string;
  article?: boolean;
}): Metadata {
  const ogTitle = typeof title === "string" ? `${title} | ${SITE_NAME}` : title.absolute;
  const dates = pageDates(path);
  return {
    title,
    description,
    alternates: { canonical: path || "/" },
    openGraph: {
      type: article ? "article" : "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path || "/",
      title: ogTitle,
      description,
      images: ["/opengraph-image"],
      ...(article ? { publishedTime: dates.published, modifiedTime: dates.modified } : {}),
    },
  };
}
