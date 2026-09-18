import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "About",
  description: "About the Gravel Cost Calculator — free, ad-free material calculators for home projects.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
            <h1>About Gravel Cost Calculator</h1>
            <p className="mt-3 text-[16px] text-text-secondary">
              Gravel Cost Calculator is a free set of tools for estimating the materials and cost of common
              home improvement projects. It started with gravel — figuring out how many yards, tons, and
              dollars a driveway or walkway really needs — and grew to cover concrete, mulch, topsoil,
              pavers, sod, fencing, paint, and decking.
            </p>
            <p className="mt-4 text-[16px] text-text-secondary">
              Every calculator shows its full math in a breakdown, not just a final number, so you can see
              exactly how the estimate was reached and adjust it for your own project. See the{" "}
              <Link href="/methodology" className="text-primary hover:underline">
                methodology page
              </Link>{" "}
              for the formulas and assumptions behind each calculator.
            </p>
            <p className="mt-4 text-[16px] text-text-secondary">
              These tools produce planning estimates, not final order quantities. Material density, supplier
              minimums, and site conditions vary — always confirm exact quantities with your supplier before
              ordering.
            </p>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
