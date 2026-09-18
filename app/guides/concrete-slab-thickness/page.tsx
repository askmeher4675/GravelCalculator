import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { InfoCallout } from "@/components/content/InfoCallout";

export const metadata: Metadata = {
  title: "Concrete Slab Thickness Guide",
  description: "How thick a concrete slab should be for patios, walkways, driveways, and footings.",
};

export default function ConcreteSlabThicknessGuidePage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: "Concrete Slab Thickness" }]}
            />
            <h1>Concrete Slab Thickness Guide</h1>
            <p className="mt-3 text-[16px] text-text-secondary">
              Slab thickness depends on what will sit or drive on it. A thicker slab costs more but resists
              cracking under load — going thinner than recommended is the most common reason residential
              slabs fail early.
            </p>

            <section className="mt-10">
              <h2>Recommended thickness by use</h2>
              <ul className="mt-4 space-y-2 text-[16px] text-text-secondary">
                <li><strong>Walkways and patios (foot traffic only):</strong> 4 in is standard.</li>
                <li><strong>Driveways (passenger vehicles):</strong> 5–6 in, often with wire mesh or rebar reinforcement.</li>
                <li><strong>Driveways carrying trucks or RVs:</strong> 6–8 in with reinforcement, on a well-compacted base.</li>
                <li><strong>Footings:</strong> Sized by local building code based on load and frost depth — check with your building department rather than using a flat rule.</li>
              </ul>
            </section>

            <section className="mt-10">
              <h2>Estimating volume</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Multiply length × width × thickness (in feet) to get cubic feet, then divide by 27 to get
                cubic yards. A 10 ft × 10 ft patio at 4 in thick needs about 1.23 yd³ before waste. Ready-mix
                trucks are typically ordered in quarter-yard increments, so round up accordingly and add
                10% waste for spillage and uneven forms.
              </p>
              <div className="mt-4">
                <InfoCallout>
                  Use the{" "}
                  <Link href="/calculators/concrete-calculator" className="font-semibold text-primary hover:underline">
                    Concrete Calculator
                  </Link>{" "}
                  to get cubic yards, a quarter-yard order size, and an equivalent bag count for your exact
                  dimensions.
                </InfoCallout>
              </div>
            </section>

            <section className="mt-10">
              <h2>Base and reinforcement</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                A compacted gravel base under the slab improves drainage and reduces cracking from freeze-thaw
                movement — see the{" "}
                <Link href="/guides/gravel-driveway" className="text-primary hover:underline">
                  gravel driveway guide
                </Link>{" "}
                for base depth guidance. Reinforcement (wire mesh or rebar) is sized separately based on the
                slab&apos;s span and expected load.
              </p>
            </section>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
