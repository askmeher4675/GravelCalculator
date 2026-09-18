import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { GuideCard } from "@/components/content/GuideCard";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical reference guides for planning home projects: gravel driveway depth, concrete slab thickness, and mulch depth.",
};

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
