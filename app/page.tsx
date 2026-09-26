import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { GuideCard } from "@/components/content/GuideCard";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { InfoCallout } from "@/components/content/InfoCallout";
import { calculators, calculatorTaglines } from "@/lib/calculators";
import {
  CalcIcon,
  BoltIcon,
  TagIcon,
  LeafIcon,
  ShieldIcon,
  TargetIcon,
  UsersIcon,
  ArrowRightIcon,
} from "@/components/icons/Icons";

export const metadata: Metadata = pageMetadata({
  path: "",
  title: { absolute: "Gravel Calculator - Estimate Gravel Cost, Tons & Yards" },
  description: "Free gravel cost calculator: enter your area, gravel type, and price per ton to estimate cubic yards, tons, and total cost for your driveway or landscaping project.",
});

const POPULAR_SLUGS = [
  "gravel-calculator",
  "driveway-calculator",
  "concrete-calculator",
  "mulch-calculator",
  "paver-calculator",
  "topsoil-calculator",
];

const CALCULATOR_IMAGES: Record<string, string> = {
  "gravel-calculator": "/calc-gravel.webp",
  "driveway-calculator": "/calc-driveway.webp",
  "concrete-calculator": "/calc-concrete.webp",
  "mulch-calculator": "/calc-mulch.webp",
  "paver-calculator": "/calc-paver.webp",
  "topsoil-calculator": "/calc-topsoil.webp",
};

const HERO_BADGES = [
  { icon: CalcIcon, label: "Accurate Calculations" },
  { icon: BoltIcon, label: "Multiple Shapes & Materials" },
  { icon: TagIcon, label: "Cost Estimation" },
  { icon: LeafIcon, label: "Free & Easy to Use" },
];

const HOW_IT_WORKS = [
  {
    title: "Enter your measurements",
    description: "Length, width, and depth, plus your gravel type and price per ton.",
  },
  {
    title: "Get an instant estimate",
    description: "Cubic yards, tons, and total cost, calculated as you go.",
  },
  {
    title: "See the full breakdown",
    description: "Every step of the math, so the number is never a black box.",
  },
  {
    title: "Plan with confidence",
    description: "Buy the right amount the first time, with no guesswork.",
  },
];

const TRUST_ITEMS = [
  {
    icon: ShieldIcon,
    title: "Trusted Calculations",
    description: "Based on real-world data and industry standards.",
  },
  {
    icon: TargetIcon,
    title: "Multiple Materials",
    description: "Gravel, mulch, concrete, topsoil, and more.",
  },
  {
    icon: UsersIcon,
    title: "Free to Use",
    description: "No signup. No limits.",
  },
  {
    icon: LeafIcon,
    title: "Built for Real Projects",
    description: "Plan better. Buy smarter. Save money.",
  },
];

export default function Home() {
  const gravel = calculators["gravel-calculator"];
  const popular = POPULAR_SLUGS.map((slug) => calculators[slug]).filter(Boolean);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden pb-28 pt-12 md:pb-36 md:pt-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-driveway.webp"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 z-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(11,61,58,0.82) 0%, rgba(11,61,58,0.55) 35%, rgba(15,107,96,0.28) 60%, rgba(15,107,96,0.15) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10">
          <PageContainer>
            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <div style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}>
                <p
                  className="text-[13px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: "color-mix(in srgb, var(--color-on-primary) 80%, transparent)" }}
                >
                  Plan &middot; Calculate &middot; Build with Confidence
                </p>
                <h1 className="mt-3" style={{ color: "var(--color-on-primary)" }}>
                  Gravel Calculator
                </h1>
                <p
                  className="mt-3 max-w-[560px] text-[16px]"
                  style={{ color: "color-mix(in srgb, var(--color-on-primary) 88%, transparent)" }}
                >
                  {gravel.intro}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {HERO_BADGES.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: "rgba(255,255,255,0.15)", color: "var(--color-on-primary)" }}
                        aria-hidden="true"
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span
                        className="text-[13px] font-medium leading-tight"
                        style={{ color: "color-mix(in srgb, var(--color-on-primary) 92%, transparent)" }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="hidden max-w-[260px] rounded-xl border p-4 lg:block"
                style={{
                  background: "rgba(11,61,58,0.55)",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                <p className="text-[15px] font-bold leading-snug" style={{ color: "var(--color-on-primary)" }}>
                  Turn your project plans into reality
                </p>
                <div className="mt-2 space-y-0.5 text-[13px]" style={{ color: "color-mix(in srgb, var(--color-on-primary) 90%, transparent)" }}>
                  <p>Right quantity.</p>
                  <p>Right cost. No guesswork.</p>
                </div>
                <div className="mt-3 h-[3px] w-8 rounded-full" style={{ background: "var(--color-secondary)" }} aria-hidden="true" />
              </div>
            </div>
          </PageContainer>
          </div>
        </div>

        {/* Calculator card, overlapping the hero */}
        <PageContainer>
          <section className="relative z-10 -mt-20 md:-mt-24">
            <div className="mx-auto max-w-[860px] rounded-2xl border border-border bg-surface p-1 shadow-[var(--shadow-lg)]">
              <div className="p-5 md:p-6">
                <h2>Calculate Your Gravel Needs</h2>
              </div>
              <div className="px-5 pb-5 md:px-6 md:pb-6">
                <CalculatorShell slug="gravel-calculator" />
                <div className="mt-4">
                  <InfoCallout>{gravel.example}</InfoCallout>
                </div>
              </div>
            </div>
          </section>

          {/* Popular calculators */}
          <section className="mt-20">
            <div className="flex items-end justify-between gap-4">
              <h2>Popular Calculators</h2>
              <Link href="/calculators" className="hidden shrink-0 items-center gap-1 text-[14px] font-medium text-primary hover:underline sm:inline-flex">
                View All Calculators
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popular.map((c) => {
                const isActive = c.slug === "gravel-calculator";
                return (
                  <Link
                    key={c.slug}
                    href={`/calculators/${c.slug}`}
                    className={`group relative block h-64 overflow-hidden rounded-xl shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                      isActive ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={CALCULATOR_IMAGES[c.slug]}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(180deg, rgba(8,28,26,0) 5%, rgba(8,28,26,0.55) 45%, rgba(8,28,26,0.95) 100%)" }}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
                      <p className="text-[17px] font-bold text-white">{c.title}</p>
                      <p className="mt-1 text-[14px] font-medium text-white/95">
                        {calculatorTaglines[c.slug] ?? c.intro}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 text-[14px] font-semibold text-white">
                        Use Calculator
                        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 sm:hidden">
              <Link href="/calculators" className="text-[15px] font-medium text-primary hover:underline">
                View all calculators →
              </Link>
            </div>
          </section>

          {/* How it works */}
          <section className="mt-20">
            <h2>How the gravel calculator works</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map(({ title, description }, i) => (
                <div key={title}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-mono text-[15px] font-bold text-on-primary">
                    {i + 1}
                  </span>
                  <p className="mt-3 text-[15px] font-semibold text-text-primary">{title}</p>
                  <p className="mt-1 text-[14px] text-text-secondary">{description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Guides */}
          <section className="mt-20">
            <div className="flex items-end justify-between gap-4">
              <h2>Helpful Guides</h2>
              <Link href="/guides" className="hidden shrink-0 items-center gap-1 text-[14px] font-medium text-primary hover:underline sm:inline-flex">
                View All Guides
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <GuideCard
                title="How Much Gravel for a Driveway?"
                description="Depth guidelines, examples and cost estimates."
                href="/guides/gravel-driveway"
                image="/calc-driveway.webp"
              />
              <GuideCard
                title="Concrete Slab Thickness Guide"
                description="Find the right thickness for your project."
                href="/guides/concrete-slab-thickness"
                image="/calc-concrete.webp"
              />
              <GuideCard
                title="Mulch Depth by Plant Type"
                description="Recommended depths for different plants."
                href="/guides/mulch-depth"
                image="/calc-mulch.webp"
              />
            </div>
            <div className="mt-4 sm:hidden">
              <Link href="/guides" className="text-[15px] font-medium text-primary hover:underline">
                View all guides →
              </Link>
            </div>
          </section>

          {/* Trust strip */}
          <section className="mt-20 mb-4 rounded-2xl bg-bg p-8 md:p-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex flex-col items-start gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[16px] font-semibold text-text-primary">{title}</p>
                    <p className="mt-1 text-[14px] text-text-secondary">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
