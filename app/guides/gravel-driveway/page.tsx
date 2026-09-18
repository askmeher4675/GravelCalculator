import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { InfoCallout } from "@/components/content/InfoCallout";

export const metadata: Metadata = {
  title: "How Much Gravel for a Driveway",
  description:
    "How deep and how much gravel a driveway needs, by size and traffic type, plus how to estimate total cost.",
};

export default function GravelDrivewayGuidePage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: "Gravel Driveway" }]}
            />
            <h1>How Much Gravel for a Driveway</h1>
            <p className="mt-3 text-[16px] text-text-secondary">
              Gravel driveways are typically built in two layers — a compacted base for structure and a
              finer top layer for a smooth driving surface. How much gravel you need depends on the
              driveway&apos;s size, the depth of each layer, and how much traffic it will carry.
            </p>

            <section className="mt-10">
              <h2>Recommended depth by use</h2>
              <ul className="mt-4 space-y-2 text-[16px] text-text-secondary">
                <li><strong>Light foot traffic / garden path:</strong> 2–3 in of gravel is usually enough.</li>
                <li><strong>Standard car driveway:</strong> 4–6 in total, often a 4 in compacted base plus a 2 in surface layer.</li>
                <li><strong>Heavy vehicles or soft/clay soil:</strong> 8–12 in across a base and surface layer, sometimes with a geotextile fabric underneath.</li>
              </ul>
            </section>

            <section className="mt-10">
              <h2>Estimating the amount</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Multiply the driveway&apos;s length by its width to get the area, then multiply by the depth
                (converted to feet) to get volume. A 50 ft × 12 ft driveway at 6 in deep needs about 11.1 yd³
                of gravel before waste. Add 10% for compaction and uneven sub-grade to get the waste-adjusted
                volume (about 12.2 yd³), then round that up to the nearest 0.1 yd³ for your supplier order.
              </p>
              <div className="mt-4">
                <InfoCallout>
                  For a single top layer, use the{" "}
                  <Link href="/calculators/gravel-calculator" className="font-semibold text-primary hover:underline">
                    Gravel Calculator
                  </Link>
                  . For a driveway with a separate base and surface layer, use the{" "}
                  <Link href="/calculators/driveway-calculator" className="font-semibold text-primary hover:underline">
                    Driveway Calculator
                  </Link>
                  , which totals both layers and shows each one in the breakdown.
                </InfoCallout>
              </div>
            </section>

            <section className="mt-10">
              <h2>Choosing a gravel type</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Crushed stone (like #57 stone) is the most common base and surface material for driveways —
                it locks together well when compacted. Pea gravel looks nicer but shifts more underfoot and
                is better suited to light-traffic paths than daily vehicle use. The{" "}
                <Link href="/calculators/gravel-calculator" className="text-primary hover:underline">
                  Gravel Calculator
                </Link>{" "}
                lets you pick a gravel type and price per ton to estimate total cost alongside volume.
              </p>
            </section>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
