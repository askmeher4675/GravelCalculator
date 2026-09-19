import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { InfoCallout } from "@/components/content/InfoCallout";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { RelatedCalculators } from "@/components/content/RelatedCalculators";
import { calculators } from "@/lib/calculators";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return Object.keys(calculators).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = calculators[slug];
  if (!config) return {};
  const path = `/calculators/${slug}`;
  return {
    // The gravel calculator is the flagship page: skip the site-name suffix (it would repeat "Gravel").
    title:
      slug === "gravel-calculator"
        ? { absolute: "Gravel Calculator: Cost, Tons & Cubic Yards" }
        : `${config.title} - Free Online Estimator`,
    description: config.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: config.title,
      description: config.metaDescription,
      images: ["/opengraph-image"],
    },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = calculators[slug];
  if (!config) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.title,
    url: `${SITE_URL}/calculators/${slug}`,
    description: config.metaDescription,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <JsonLd data={appJsonLd} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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

            {config.relatedGuides && config.relatedGuides.length > 0 && (
              <section className="mt-12">
                <h2>Related guides</h2>
                <ul className="mt-4 space-y-2">
                  {config.relatedGuides.map((guide) => (
                    <li key={guide.href}>
                      <Link href={guide.href} className="text-[16px] font-medium text-primary hover:underline">
                        {guide.title} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

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
