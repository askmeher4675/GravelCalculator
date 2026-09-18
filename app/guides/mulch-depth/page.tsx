import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { InfoCallout } from "@/components/content/InfoCallout";

export const metadata: Metadata = {
  title: "Mulch Depth by Plant Type",
  description: "How deep to mulch garden beds, tree rings, and vegetable gardens for healthy plants.",
};

export default function MulchDepthGuidePage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: "Mulch Depth" }]}
            />
            <h1>Mulch Depth by Plant Type</h1>
            <p className="mt-3 text-[16px] text-text-secondary">
              The right mulch depth depends on what&apos;s planted. Too little mulch does little to suppress
              weeds or hold moisture; too much can suffocate roots and trap moisture against stems and trunks.
            </p>

            <section className="mt-10">
              <h2>Recommended depth by bed type</h2>
              <ul className="mt-4 space-y-2 text-[16px] text-text-secondary">
                <li><strong>Flower and perennial beds:</strong> 2–3 in is standard.</li>
                <li><strong>Vegetable gardens:</strong> 1–2 in of a finer mulch, so it breaks down and enriches the soil each season.</li>
                <li><strong>Shrub and tree rings:</strong> 2–4 in, kept a few inches clear of the trunk to prevent rot.</li>
                <li><strong>Pathways:</strong> 3–4 in of a coarser mulch or bark chips to hold up to foot traffic.</li>
              </ul>
            </section>

            <section className="mt-10">
              <h2>Estimating how much you need</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Multiply the bed&apos;s length × width to get area, then multiply by the depth (converted to
                feet) to get volume. A 15 ft × 8 ft bed at 3 in deep needs about 1.11 yd³ before waste. Add
                10% for settling and uneven ground to get the waste-adjusted volume (about 1.22 yd³), then
                round that up to the nearest 0.1 yd³ for bulk delivery, or convert to bags for smaller beds.
              </p>
              <div className="mt-4">
                <InfoCallout>
                  Use the{" "}
                  <Link href="/calculators/mulch-calculator" className="font-semibold text-primary hover:underline">
                    Mulch Calculator
                  </Link>{" "}
                  to get cubic yards for bulk delivery or a bag count for your exact bed size.
                </InfoCallout>
              </div>
            </section>

            <section className="mt-10">
              <h2>Refreshing mulch over time</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Organic mulch breaks down and typically needs topping off annually, with a full fresh layer
                every 2–3 years. If you&apos;re building new beds, see the{" "}
                <Link href="/calculators/topsoil-calculator" className="text-primary hover:underline">
                  Topsoil Calculator
                </Link>{" "}
                first to estimate soil for the bed itself.
              </p>
            </section>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
