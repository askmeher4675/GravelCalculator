import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { GuideCard } from "@/components/content/GuideCard";

export const metadata: Metadata = pageMetadata({
  path: "/guides",
  title: "Guides",
  description: "Practical reference guides for planning home projects: gravel driveway depth, gravel cost, coverage and types, concrete slab thickness, and mulch depth.",
});

export default function GuidesIndexPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
            <h1>Guides</h1>
            <p className="mt-3 text-[16px] text-text-secondary">
              Quick reference guides for planning your project before you calculate materials.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <GuideCard
                title="How much gravel for a driveway"
                description="Depth by use, how the layers work, tons for common sizes, and a step-by-step build."
                href="/guides/gravel-driveway"
                image="/calc-driveway.webp"
              />
              <GuideCard
                title="How much does gravel cost?"
                description="Price per ton and yard, delivery and hidden costs, bulk vs bags, and a sample budget."
                href="/guides/gravel-cost-per-ton"
                image="/calc-gravel.webp"
              />
              <GuideCard
                title="Gravel coverage chart"
                description="Coverage per cubic yard, ton, and bag at every depth, plus metric figures."
                href="/guides/gravel-coverage-chart"
                image="/calc-gravel.webp"
              />
              <GuideCard
                title="Types of gravel and sizes"
                description="Stone numbers explained, and the right gravel for driveways, drainage, pavers and paths."
                href="/guides/gravel-types-and-sizes"
                image="/calc-gravel.webp"
              />
              <GuideCard
                title="Concrete slab thickness guide"
                description="Thickness by use, the base, reinforcement, control joints, and how much to order."
                href="/guides/concrete-slab-thickness"
                image="/calc-concrete.webp"
              />
              <GuideCard
                title="Mulch depth by plant type"
                description="Depth for beds, trees and gardens, coverage per bag and yard, and mulch types."
                href="/guides/mulch-depth"
                image="/calc-mulch.webp"
              />
            </div>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
