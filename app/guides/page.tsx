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
  description: "Practical reference guides for planning home projects: gravel driveway depth and slope, gravel cost, coverage and types, gravel under a concrete slab, concrete slab and walkway sizing, deck costs, and mulch depth.",
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
              <GuideCard
                title="Gravel under a concrete slab"
                description="Base depth, which stone to use, and the yards and tons for common slab sizes."
                href="/guides/gravel-under-concrete-slab"
                image="/calc-concrete.webp"
              />
              <GuideCard
                title="Concrete walkway or path"
                description="Concrete by length, width and thickness, plus joints, base, slope and a worked example."
                href="/guides/concrete-walkway-path"
                image="/calc-concrete.webp"
              />
              <GuideCard
                title="Driveway slope and grade"
                description="Calculate slope from rise and run, how steep is too steep, and crown for drainage."
                href="/guides/driveway-slope-and-grade"
                image="/calc-driveway.webp"
              />
              <GuideCard
                title="Pea gravel coverage"
                description="What a ton, yard or bag covers at each depth, tons for common areas, and best uses."
                href="/guides/pea-gravel-coverage"
                image="/calc-gravel.webp"
              />
              <GuideCard
                title="Deck cost breakdown"
                description="Every line item in a deck estimate, a worked 16 × 12 ft example, and where to save."
                href="/guides/deck-cost-breakdown"
                image="/calc-paver.webp"
              />
            </div>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
