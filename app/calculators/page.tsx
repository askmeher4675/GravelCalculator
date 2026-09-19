import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { calculators } from "@/lib/calculators";

export const metadata: Metadata = pageMetadata({
  path: "/calculators",
  title: "All Calculators",
  description: "Browse every material calculator: gravel, concrete, mulch, topsoil, pavers, sod, fencing, paint, decking, and driveways.",
});

export default function CalculatorsIndexPage() {
  const byCategory = new Map<string, typeof calculators[string][]>();
  for (const config of Object.values(calculators)) {
    const list = byCategory.get(config.category) ?? [];
    list.push(config);
    byCategory.set(config.category, list);
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calculators" }]} />
            <h1>All Calculators</h1>
            <p className="mt-3 text-[16px] text-text-secondary">
              Every calculator estimates material quantities from your project&apos;s measurements, with a full
              breakdown of the math behind each result.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-[680px] space-y-10">
            {Array.from(byCategory.entries()).map(([category, items]) => (
              <section key={category}>
                <h2>{category}</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {items.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/calculators/${c.slug}`}
                      className="block rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-md)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <p className="text-[17px] font-semibold text-text-primary">{c.title}</p>
                      <p className="mt-1 text-[15px] text-text-secondary">{c.intro}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
