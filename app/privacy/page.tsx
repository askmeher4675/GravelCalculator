import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy Policy",
  description: "How Gravel Cost Calculator handles data — we don't collect the numbers you enter into any calculator.",
});

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
            <h1>Privacy Policy</h1>
            <p className="mt-3 text-[16px] text-text-secondary">
              Last updated: 2026. This policy covers what happens to your data when you use Gravel Cost
              Calculator.
            </p>

            <section className="mt-10">
              <h2>Calculator inputs</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Every calculation on this site runs entirely in your browser. The measurements, prices, and
                other values you enter are never sent to or stored on our servers — closing or refreshing the
                page clears them.
              </p>
            </section>

            <section className="mt-10">
              <h2>Analytics and cookies</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                We may use privacy-focused, aggregated analytics to understand which pages are useful and to
                fix broken links or errors. This does not include the specific numbers you type into a
                calculator. If analytics or advertising cookies are added in the future, this page will be
                updated to describe them.
              </p>
            </section>

            <section className="mt-10">
              <h2>Third-party links</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Pages on this site may link to outside resources (like supplier or reference sites). We
                aren&apos;t responsible for the privacy practices of those external sites — check their own
                policies before sharing information with them.
              </p>
            </section>

            <section className="mt-10">
              <h2>Contact</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Questions about this policy can be sent through the{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
