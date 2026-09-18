import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { GuideCard } from "@/components/content/GuideCard";

const POPULAR = [
  { title: "Gravel Calculator", slug: "gravel-calculator" },
  { title: "Concrete Calculator", slug: "concrete-calculator" },
  { title: "Mulch Calculator", slug: "mulch-calculator" },
  { title: "Topsoil Calculator", slug: "topsoil-calculator" },
];

const CATEGORIES = [
  "Landscaping",
  "Concrete & Masonry",
  "Lawn & Garden",
  "Fencing",
  "Painting",
  "Decks & Outdoor Projects",
];

export default function Home() {
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
              <h1 style={{ color: "var(--color-on-primary)" }}>Home Project Calculators</h1>
              <p
                className="mt-3 text-[16px]"
                style={{ color: "color-mix(in srgb, var(--color-on-primary) 85%, transparent)" }}
              >
                Calculate the materials and quantities you need for your next home improvement project.
              </p>
              <div className="mt-6">
                <input
                  type="search"
                  placeholder="Search calculators (e.g. gravel, concrete, fence)"
                  className="h-12 w-full rounded-lg border-0 bg-surface px-4 text-[16px] text-text-primary shadow-[var(--shadow-lg)] outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                />
              </div>
            </div>
          </PageContainer>
        </div>
        <PageContainer>
          <section className="mt-12 md:mt-16">
            <h2>Popular calculators</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {POPULAR.map((c) => (
                <Link
                  key={c.slug}
                  href={`/calculators/${c.slug}`}
                  className="rounded-lg border border-border bg-surface p-5 text-[16px] font-semibold text-text-primary shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-[var(--shadow-md)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2>Calculator categories</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href="/calculators"
                  className="rounded-lg border border-border bg-surface p-5 text-[16px] font-medium text-text-secondary shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-[var(--shadow-md)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-16 mx-auto max-w-[680px]">
            <h2>How our calculators work</h2>
            <ol className="mt-4 space-y-4">
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[15px] font-bold text-on-primary">1</span>
                <p className="text-[16px] text-text-secondary">Enter your measurements in feet, inches, or yards — whatever fits the project.</p>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[15px] font-bold text-on-primary">2</span>
                <p className="text-[16px] text-text-secondary">Get an instant result with the material quantity you need.</p>
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
