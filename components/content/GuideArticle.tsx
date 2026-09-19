import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";

export function GuideArticle({
  title,
  description,
  path,
  breadcrumb,
  intro,
  children,
}: {
  title: string;
  description: string;
  path: string;
  breadcrumb: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <ArticleJsonLd title={title} description={description} path={path} />
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: breadcrumb }]}
            />
            <h1>{title}</h1>
            <p className="mt-3 text-[16px] text-text-secondary">{intro}</p>
            {children}
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
