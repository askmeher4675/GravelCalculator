import type { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LastUpdated } from "@/components/content/LastUpdated";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageJsonLd } from "@/lib/seo";
import type { FaqItem } from "@/lib/calculators/types";

export interface GuideLink {
  href: string;
  label: string;
}

export function GuideArticle({
  title,
  description,
  path,
  breadcrumb,
  intro,
  related,
  faqs,
  children,
}: {
  title: string;
  description: string;
  path: string;
  breadcrumb: string;
  intro: string;
  /** Listed after the article body under "Related guides and calculators". */
  related?: GuideLink[];
  /** Rendered last as an FAQ section, with matching FAQPage structured data. */
  faqs?: FaqItem[];
  children: ReactNode;
}) {
  return (
    <>
      <ArticleJsonLd title={title} description={description} path={path} />
      {faqs && faqs.length > 0 && <JsonLd data={faqPageJsonLd(faqs)} />}
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: breadcrumb }]}
            />
            <h1>{title}</h1>
            <LastUpdated path={path} />
            <p className="mt-3 text-[16px] text-text-secondary">{intro}</p>
            {children}

            {related && related.length > 0 && (
              <section className="mt-12">
                <h2>Related guides and calculators</h2>
                <ul className="mt-4 space-y-2 text-[16px]">
                  {related.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="font-medium text-primary hover:underline">
                        {link.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {faqs && faqs.length > 0 && (
              <section className="mt-12">
                <h2>Frequently asked questions</h2>
                <div className="mt-4">
                  <FAQAccordion items={faqs} />
                </div>
              </section>
            )}
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}

export function DataTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-[15px]">
        <thead className="bg-surface text-text-primary">
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-text-secondary">
          {rows.map((row) => (
            <tr key={String(row[0])} className="border-t border-border">
              {row.map((cell, i) => (
                <td key={i} className="px-4 py-2.5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Small-print note under a table or figure. */
export function TableNote({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-[14px] text-text-muted">{children}</p>;
}
