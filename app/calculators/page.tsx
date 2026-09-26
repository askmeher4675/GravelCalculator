import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { calculators, calculatorTaglines, calculatorsByCategory } from "@/lib/calculators";
import { CalculatorIcon } from "@/components/icons/Icons";

export const metadata: Metadata = pageMetadata({
  path: "/calculators",
  title: "All Calculators",
  description: "Browse every material calculator: gravel, concrete, mulch, topsoil, pavers, sod, fencing, paint, decking, and driveways.",
});

export default function CalculatorsIndexPage() {
  const groups = calculatorsByCategory();

  return (
    <>
      <Header />
      <main className="flex-1 py-6 md:py-10">
        <PageContainer>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calculators" }]} />
          <h1>All Calculators</h1>
          <p className="mt-2 max-w-[680px] text-[16px] text-text-secondary">
            {Object.keys(calculators).length} free calculators that estimate material quantities from your
            project&apos;s measurements, with a full breakdown of the math behind each result.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {groups.flatMap(([, items]) => items).map((c) => (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}`}
                className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-3 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-md)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:flex-col sm:items-start sm:gap-0 sm:p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary sm:h-10 sm:w-10">
                  <CalculatorIcon slug={c.slug} className="h-5 w-5" />
                </span>
                <p className="text-[14px] font-semibold leading-snug text-text-primary sm:mt-3 sm:text-[15px]">
                  {c.title.replace(/ Calculator$/, "")}
                  <span className="hidden sm:inline"> Calculator</span>
                </p>
                <p className="mt-1 hidden text-[13px] leading-snug text-text-secondary sm:block">
                  {calculatorTaglines[c.slug] ?? c.intro}
                </p>
                <p className="mt-auto hidden pt-2 text-[12px] font-medium uppercase tracking-wide text-text-muted sm:block">
                  {c.category}
                </p>
              </Link>
            ))}
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
