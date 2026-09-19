import { JsonLd } from "./JsonLd";
import { CONTENT_UPDATED, SITE_NAME, SITE_URL } from "@/lib/site";

export function ArticleJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        mainEntityOfPage: `${SITE_URL}${path}`,
        dateModified: CONTENT_UPDATED,
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      }}
    />
  );
}
