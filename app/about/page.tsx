import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LastUpdated } from "@/components/content/LastUpdated";
import { calculators, calculatorTaglines } from "@/lib/calculators";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About",
  description:
    "Who Gravel Cost Calculator is for, how every estimate is calculated and tested, where the numbers come from, how corrections are handled, and how the site is funded.",
});

const GUIDES = [
  { href: "/guides/gravel-driveway", label: "How much gravel for a driveway" },
  { href: "/guides/gravel-cost-per-ton", label: "How much does gravel cost?" },
  { href: "/guides/gravel-coverage-chart", label: "Gravel coverage chart" },
  { href: "/guides/gravel-types-and-sizes", label: "Types of gravel and sizes" },
  { href: "/guides/concrete-slab-thickness", label: "Concrete slab thickness" },
  { href: "/guides/mulch-depth", label: "Mulch depth by plant type" },
];

export default function AboutPage() {
  const calculatorList = Object.values(calculators);

  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
            <h1>About Gravel Cost Calculator</h1>
            <LastUpdated path="/about" />
            <p className="mt-3 text-[16px] text-text-secondary">
              Gravel Cost Calculator is a free set of tools and guides for estimating the materials and cost of
              common home improvement and landscaping projects. It started with gravel: working out how many
              cubic yards, tons, and dollars a driveway, path, or drainage bed really needs. It has since grown
              to cover concrete, mulch, topsoil, pavers, sod, fencing, paint, and decking.
            </p>

            <section className="mt-10">
              <h2>Why this site exists</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Material suppliers sell by the ton, the cubic yard, the bag, the pallet, or the roll, and a
                homeowner usually measures in feet and inches. Converting between all of those, adding a sensible
                allowance for waste, and rounding to something a supplier will actually deliver is where people
                tend to order too little (and pay for a second delivery) or too much (and pay for stone nobody
                uses). The goal here is to do that conversion for you and to show every step, so you can judge the
                answer rather than just trust it.
              </p>
            </section>

            <section className="mt-10">
              <h2>Who it is for</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] text-text-secondary">
                <li>
                  Homeowners planning a driveway, patio, garden bed, lawn, fence, deck, or paint job who want a
                  realistic quantity before they call a supplier.
                </li>
                <li>
                  DIYers comparing bagged and bulk materials, or checking a quote against a rough estimate of what
                  the job should take.
                </li>
                <li>
                  Small contractors and landscapers who want a quick cross-check on a takeoff, with the formula in
                  front of them.
                </li>
              </ul>
            </section>

            <section className="mt-10">
              <h2>What you will find here</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                There are {calculatorList.length} calculators. Each one has a results breakdown, a plain-language
                explanation of its formula, a worked example, reference tables, and answers to common questions
                for that kind of project.
              </p>
              <ul className="mt-4 space-y-3">
                {calculatorList.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/calculators/${c.slug}`}
                      className="text-[16px] font-medium text-primary hover:underline"
                    >
                      {c.title}
                    </Link>
                    <p className="text-[15px] text-text-secondary">{calculatorTaglines[c.slug] ?? c.intro}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[16px] text-text-secondary">
                The guides go deeper on the questions that come before the calculation, such as how deep to lay
                gravel, what it costs, and which stone to choose:
              </p>
              <ul className="mt-4 space-y-2">
                {GUIDES.map((g) => (
                  <li key={g.href}>
                    <Link href={g.href} className="text-[16px] font-medium text-primary hover:underline">
                      {g.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10">
              <h2>How the calculators are built and checked</h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-[16px] text-text-secondary">
                <li>
                  <strong>Every number is shown with its working.</strong> Each result comes with a step-by-step
                  breakdown: area, volume, waste allowance, weight, and the suggested order, so you can see where
                  the answer came from and change any assumption.
                </li>
                <li>
                  <strong>One source of truth.</strong> Weight, bag counts, and cost are all derived from the same
                  waste-adjusted volume, never from the rounded order quantity. The tables in the guides and on
                  the calculator pages are generated from the same constants the calculators use, so they cannot
                  quote a different density or bag size.
                </li>
                <li>
                  <strong>Automated tests.</strong> The formulas, unit conversions, and rounding rules are covered
                  by automated tests. They include the edge cases where
                  computer arithmetic could otherwise push an exact figure up by a step.
                </li>
                <li>
                  <strong>Documented assumptions.</strong> The{" "}
                  <Link href="/methodology" className="text-primary hover:underline">
                    methodology page
                  </Link>{" "}
                  lists the area formulas, material weights, bag sizes, waste allowances, and rounding rules, and
                  says what each estimate leaves out.
                </li>
                <li>
                  <strong>Your inputs stay in your browser.</strong> The calculators run on your device. The
                  measurements you type in are not sent to a server, and the{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    privacy policy
                  </Link>{" "}
                  explains what the site does collect.
                </li>
              </ul>
            </section>

            <section className="mt-10">
              <h2>Where the figures come from</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                The math is standard geometry: area times depth, with 27 cubic feet to a cubic yard and 2,000
                pounds to a ton. The material properties, such as how much a cubic yard of gravel weighs or how
                far a gallon of paint goes, are not fixed laws. They are typical values of the kind published by
                suppliers, manufacturers, building codes, and university extension services. Where a figure varies
                a lot from one region, brand, or product to another, we present it as a typical range and say so,
                rather than a single exact number. Prices on the site are typical ranges or worked examples that show
                the arithmetic, not quotes, because real prices depend on where you live and who you buy from.
              </p>
            </section>

            <section className="mt-10">
              <h2>Limits you should know about</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                These are planning estimates, not engineered designs or final order quantities. Material density,
                moisture, supplier minimums, site conditions, and local building rules all change what you will
                actually need. Footings, structural concrete, deck framing, drainage for a building, and anything
                that carries load or affects safety should be confirmed with your supplier, your local building
                department, or a qualified professional. Our{" "}
                <Link href="/disclaimer" className="text-primary hover:underline">
                  disclaimer
                </Link>{" "}
                has the full wording.
              </p>
            </section>

            <section className="mt-10">
              <h2>Corrections and updates</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Pages show a last-updated date. When we find a mistake in how a calculator works, we fix it and
                record the change in the{" "}
                <Link href="/methodology" className="text-primary hover:underline">
                  change log
                </Link>
                , newest first. If a result looks wrong for your project, start with the breakdown and the
                &quot;How this is calculated&quot; section on that calculator&apos;s page, and see the{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact page
                </Link>{" "}
                for how to get in touch.
              </p>
            </section>

            <section className="mt-10">
              <h2>How the site is funded</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                The calculators and guides are free to use, with no account or sign-up. The site is supported by
                advertising through Google AdSense. Ads are separate from the content: the site does not run
                sponsored placements or affiliate links, and the estimates do not favor any brand. The{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  privacy policy
                </Link>{" "}
                describes the cookies advertising partners use and how to opt out of personalized ads.
              </p>
            </section>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
