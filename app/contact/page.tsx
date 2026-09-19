import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact",
  description: "Questions about how a calculator works? Start with the FAQ and methodology pages.",
});

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
            <h1>Contact</h1>
            <p className="mt-3 text-[16px] text-text-secondary">
              Gravel Cost Calculator is a free, self-service tool without a live support line. Most
              questions about how a specific number was reached are answered on that calculator&apos;s own
              page.
            </p>
            <ul className="mt-4 space-y-2 text-[16px] text-text-secondary">
              <li>
                Each calculator&apos;s <strong>FAQ</strong> section answers the most common questions about
                that project type.
              </li>
              <li>
                The <Link href="/methodology" className="text-primary hover:underline">methodology page</Link>{" "}
                explains the formulas and density assumptions behind every result.
              </li>
              <li>
                If a number looks wrong for your project, the &quot;How this is calculated&quot; and
                &quot;Breakdown&quot; sections on each calculator show every step of the math.
              </li>
            </ul>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
