import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { GuideCard } from "@/components/content/GuideCard";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { InfoCallout } from "@/components/content/InfoCallout";
import { calculators } from "@/lib/calculators";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Gravel Calculator - Estimate Gravel Cost, Tons & Yards",
  description:
    "Free gravel cost calculator: enter your area, gravel type, and price per ton to estimate cubic yards, tons, and total cost for your driveway or landscaping project.",
};

const OTHER_CALCULATORS = Object.values(calculators).filter((c) => c.slug !== "gravel-calculator");

export default function Home() {
  const gravel = calculators["gravel-calculator"];

  return (
    <>
      <Header />
      <main className="flex-1">
        <div
          className="py-12 md:py-16"
          style={{ background: "var(--gradient-hero)" }}
        >
          <PageContainer>
            <div className="mx-auto max-w-[680px] text-center">
              <h1 style={{ color: "var(--color-on-primary)" }}>Gravel Calculator — Tons, Cubic Yards &amp; Cost</h1>
              <p
                className="mt-3 text-[16px]"
                style={{ color: "color-mix(in srgb, var(--color-on-primary) 85%, transparent)" }}
              >
                {gravel.intro}
              </p>
            </div>
          </PageContainer>
        </div>

        <PageContainer>
          <section className="mt-8 md:mt-10 mx-auto max-w-[680px]">
            <CalculatorShell slug="gravel-calculator" />
            <div className="mt-4">
              <InfoCallout>{gravel.example}</InfoCallout>
            </div>
          </section>

          <section className="mt-16">
            <h2>Other project calculators</h2>
            <p className="mt-2 text-[16px] text-text-secondary">
              Need materials for a different project? These calculators use the same simple approach.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {OTHER_CALCULATORS.map((c) => (
                <Link
                  key={c.slug}
                  href={`/calculators/${c.slug}`}
                  className="rounded-lg border border-border bg-surface p-5 text-[16px] font-semibold text-text-primary shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-[var(--shadow-md)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  {c.title}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/calculators" className="text-[15px] font-medium text-primary hover:underline">
                View all calculators →
              </Link>
            </div>
          </section>

          <section className="mt-16 mx-auto max-w-[680px]">
            <h2>How the gravel calculator works</h2>
            <ol className="mt-4 space-y-4">
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[15px] font-bold text-on-primary">1</span>
                <p className="text-[16px] text-text-secondary">Enter your area&apos;s length, width, and depth, plus your gravel type and price per ton.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[15px] font-bold text-on-primary">2</span>
                <p className="text-[16px] text-text-secondary">Get an instant estimate of cubic yards, tons, and total cost.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[15px] font-bold text-on-primary">3</span>
                <p className="text-[16px] text-text-secondary">See the full breakdown of the math, so the number is never a black box.</p>
              </li>
            </ol>
          </section>

          <section className="mt-16">
            <h2>Helpful guides</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          </section>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
