import { JsonLd } from "./JsonLd";
import { SITE_URL, pageDates } from "@/lib/site";

export function ArticleJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const { published, modified } = pageDates(path);
  const url = `${SITE_URL}${path}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image: `${SITE_URL}/opengraph-image`,
        datePublished: published,
        dateModified: modified,
        inLanguage: "en-US",
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      }}
    />
  );
}
