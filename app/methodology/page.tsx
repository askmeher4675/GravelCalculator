import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { calculators } from "@/lib/calculators";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How each calculator works: the formulas, density assumptions, and waste factors behind every material estimate.",
};

export default function MethodologyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Methodology" }]} />
            <h1>Methodology</h1>
            <p className="mt-3 text-[16px] text-text-secondary">
              Every calculator on this site follows the same core approach: convert your measurements into a
              volume or count, add a waste percentage for real-world conditions, then round to how suppliers
              actually sell the material. The specifics — density, waste factors, unit conversions — vary by
              material, so each calculator's page shows its own breakdown alongside the result.
            </p>
            <p className="mt-4 text-[16px] text-text-secondary">
              Material weights (used to convert volume to tons) are typical industry averages. Actual density
              varies with moisture, compaction, and exact material grade, so weight and cost figures are
              estimates — confirm with your supplier before ordering.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-[680px] space-y-8">
            {Object.values(calculators).map((c) => (
              <section key={c.slug} className="border-t border-border pt-8">
                <h2>
                  <Link href={`/calculators/${c.slug}`} className="hover:text-primary">
                    {c.title}
                  </Link>
                </h2>
                <p className="mt-3 text-[16px] text-text-secondary">{c.methodology}</p>
              </section>
            ))}
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
