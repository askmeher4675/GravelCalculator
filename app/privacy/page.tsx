import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LastUpdated } from "@/components/content/LastUpdated";

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy Policy",
  description:
    "How Gravel Cost Calculator handles data: calculator inputs never leave your browser, and Google AdSense uses cookies to serve ads.",
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
            <LastUpdated path="/privacy" />
            <p className="mt-3 text-[16px] text-text-secondary">
              This policy covers what happens to your data when you use Gravel Cost Calculator.
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
              <h2>Advertising and cookies</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                This site uses Google AdSense to show ads, which is how we keep the calculators free.
                Third-party vendors, including Google, use cookies to serve ads based on your prior visits to
                this website or other websites. Google&apos;s use of advertising cookies enables it and its
                partners to serve ads to you based on your visits to this site and/or other sites on the
                internet.
              </p>
              <p className="mt-4 text-[16px] text-text-secondary">
                You can opt out of personalized advertising in{" "}
                <a href="https://www.google.com/settings/ads" className="text-primary hover:underline">
                  Google&apos;s Ads Settings
                </a>
                . You can also opt out of some third-party vendors&apos; use of cookies for personalized
                advertising at{" "}
                <a href="https://www.aboutads.info/choices/" className="text-primary hover:underline">
                  aboutads.info
                </a>
                . To learn how Google uses information from sites that show its ads, see{" "}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  className="text-primary hover:underline"
                >
                  How Google uses information from sites or apps that use our services
                </a>
                .
              </p>
            </section>

            <section className="mt-10">
              <h2>Analytics</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                We may use privacy-focused, aggregated analytics to understand which pages are useful and to
                fix broken links or errors. This does not include the specific numbers you type into a
                calculator.
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
