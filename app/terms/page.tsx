import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using Gravel Cost Calculator's free material and cost calculators.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]} />
            <h1>Terms of Use</h1>
            <p className="mt-3 text-[16px] text-text-secondary">
              Last updated: 2026. By using Gravel Cost Calculator, you agree to these terms.
            </p>

            <section className="mt-10">
              <h2>Using this site</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Gravel Cost Calculator is free to use for personal and commercial project planning. You may
                not scrape, republish, or resell the site&apos;s content or calculators without permission.
              </p>
            </section>

            <section className="mt-10">
              <h2>Estimates only</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Every result on this site is a planning estimate based on standard material assumptions — see
                the{" "}
                <Link href="/methodology" className="text-primary hover:underline">
                  methodology page
                </Link>{" "}
                and the{" "}
                <Link href="/disclaimer" className="text-primary hover:underline">
                  disclaimer
                </Link>{" "}
                for details. Always confirm exact quantities, pricing, and requirements with a qualified
                supplier or contractor before ordering materials or starting work.
              </p>
            </section>

            <section className="mt-10">
              <h2>No warranty</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                This site is provided &quot;as is,&quot; without warranty of any kind. We work to keep the
                formulas accurate, but we don&apos;t guarantee the calculators are free of errors or that
                results are complete for your specific project.
              </p>
            </section>

            <section className="mt-10">
              <h2>Changes</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                These terms may be updated from time to time. Continued use of the site after changes means
                you accept the updated terms.
              </p>
            </section>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
