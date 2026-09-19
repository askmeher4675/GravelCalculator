import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  alternates: { canonical: "/disclaimer" },
  title: "Disclaimer",
  description: "Why Gravel Cost Calculator's results are planning estimates, not final order quantities or professional advice.",
};

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]} />
            <h1>Disclaimer</h1>
            <p className="mt-3 text-[16px] text-text-secondary">
              Gravel Cost Calculator&apos;s tools are for general planning purposes only.
            </p>

            <section className="mt-10">
              <h2>Estimates, not guarantees</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Every result is calculated from the measurements and assumptions you enter, plus typical
                industry averages for material density and coverage. Actual material needs vary with site
                conditions, compaction, moisture, and supplier-specific product density — see each
                calculator&apos;s{" "}
                <Link href="/methodology" className="text-primary hover:underline">
                  methodology
                </Link>{" "}
                for the exact assumptions used. Always confirm final quantities and pricing with your
                supplier or contractor before ordering.
              </p>
            </section>

            <section className="mt-10">
              <h2>Not professional advice</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                These calculators do not replace advice from a licensed contractor, engineer, or landscape
                professional. Structural elements (footings, slab thickness, drainage, fence post depth) should
                be confirmed against local building code before construction.
              </p>
            </section>

            <section className="mt-10">
              <h2>Limitation of liability</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                We are not liable for material shortages, overages, or costs resulting from reliance on these
                calculators. Use the results as a starting point for your project, not a final order
                quantity.
              </p>
            </section>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
