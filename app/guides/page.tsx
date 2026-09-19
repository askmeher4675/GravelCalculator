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
                description="A quick reference for depth and coverage by driveway size."
                href="/guides/gravel-driveway"
              />
              <GuideCard
                title="How much does gravel cost?"
                description="Price per ton and per cubic yard, plus delivery and other costs."
                href="/guides/gravel-cost-per-ton"
              />
              <GuideCard
                title="Gravel coverage chart"
                description="Square feet covered per ton and cubic yard at every depth."
                href="/guides/gravel-coverage-chart"
              />
              <GuideCard
                title="Types of gravel and sizes"
                description="Crushed stone, pea gravel, crusher run and more, and when to use each."
                href="/guides/gravel-types-and-sizes"
              />
              <GuideCard
                title="Concrete slab thickness guide"
                description="Choosing the right thickness for patios, walkways, and driveways."
                href="/guides/concrete-slab-thickness"
              />
              <GuideCard
                title="Mulch depth by plant type"
                description="How much mulch depth different garden beds actually need."
                href="/guides/mulch-depth"
              />
            </div>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
