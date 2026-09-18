import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { InfoCallout } from "@/components/content/InfoCallout";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { RelatedCalculators } from "@/components/content/RelatedCalculators";
import { calculators } from "@/lib/calculators";

export function generateStaticParams() {
  return Object.keys(calculators).map((slug) => ({ slug }));
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = calculators[slug];
  if (!config) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Calculators", href: "/calculators" },
                { label: config.category, href: "/calculators" },
                { label: config.title },
              ]}
            />
            <h1>{config.title}</h1>
            <p className="mt-3 text-[16px] text-text-secondary">{config.intro}</p>

            <div className="mt-8">
              <CalculatorShell slug={config.slug} />
            </div>

            <section className="mt-16">
              <h2>How this is calculated</h2>
              <p className="mt-3 text-[16px] text-text-secondary">{config.methodology}</p>
            </section>

            <section className="mt-12">
              <h2>Example calculation</h2>
              <div className="mt-3">
                <InfoCallout>{config.example}</InfoCallout>
              </div>
            </section>

            <section className="mt-12">
              <h2>Related calculators</h2>
              <div className="mt-4">
                <RelatedCalculators items={config.related} />
              </div>
            </section>

            <section className="mt-12">
              <h2>Frequently asked questions</h2>
              <div className="mt-4">
                <FAQAccordion items={config.faqs} />
              </div>
            </section>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
