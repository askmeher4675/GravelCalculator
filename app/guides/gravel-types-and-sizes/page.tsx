import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { GuideArticle, DataTable } from "@/components/content/GuideArticle";

const PATH = "/guides/gravel-types-and-sizes";
const TITLE = "Types of Gravel and Sizes: Which Should You Use?";
const DESCRIPTION =
  "Compare crushed stone, pea gravel, crusher run, river rock and decomposed granite: typical sizes, best uses, and how to choose for a driveway, path or drainage.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: TITLE },
  description: DESCRIPTION,
  article: true,
});

const ROWS = [
  ["Crushed stone (#57)", "About 3/4 in", "Driveways, drainage, base layers", "Angular, locks together when compacted"],
  ["Crusher run", "3/4 in minus, with fines", "Driveway and patio base", "Packs very firm; drains poorly compared with clean stone"],
  ["Pea gravel", "About 3/8 in, rounded", "Paths, play areas, decorative beds", "Smooth and comfortable, but shifts underfoot"],
  ["River rock", "1–3 in and larger", "Decorative beds, dry creek beds", "Rounded and attractive, not for driving on"],
  ["Decomposed granite", "1/4 in and smaller", "Garden paths, patios", "Compacts to a firm surface, can wash away in heavy rain"],
];

export default function GravelTypesGuidePage() {
  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Gravel Types and Sizes"
      intro="Gravel names vary by region and supplier, but a few materials cover most projects. Choosing the right one affects how well the surface holds up, how it drains, and how much you pay."
    >
      <section className="mt-10">
        <h2>Common gravel types at a glance</h2>
        <DataTable headers={["Type", "Typical size", "Best for", "Notes"]} rows={ROWS} />
        <p className="mt-3 text-[14px] text-text-muted">
          Sizes are approximate. Grading names and stone sizes differ between suppliers, so confirm what
          you are buying.
        </p>
      </section>

      <section className="mt-10">
        <h2>How to choose</h2>
        <ul className="mt-4 space-y-2 text-[16px] text-text-secondary">
          <li>
            <strong>Driveways:</strong> angular crushed stone compacts and interlocks, which is why it
            is the standard choice. A common build is a coarser base topped with a finer layer.
          </li>
          <li>
            <strong>Drainage:</strong> clean, washed crushed stone has open gaps between pieces so water
            passes through. Material with lots of fines holds water.
          </li>
          <li>
            <strong>Walkways and patios:</strong> smaller, finer stone is more comfortable to walk on
            and sets more evenly.
          </li>
          <li>
            <strong>Decoration:</strong> rounded stone such as river rock or pea gravel looks best in
            beds but moves easily, so it suits low-traffic areas.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2>Size affects weight and coverage</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Different stone weighs different amounts per cubic yard, typically between 2,600 and 2,800
          pounds. That changes how many tons you order for the same volume. See the{" "}
          <Link href="/guides/gravel-coverage-chart" className="text-primary hover:underline">
            gravel coverage chart
          </Link>{" "}
          for the numbers, then use the{" "}
          <Link href="/calculators/gravel-calculator" className="font-semibold text-primary hover:underline">
            Gravel Calculator
          </Link>{" "}
          to price your chosen type. For prices, read{" "}
          <Link href="/guides/gravel-cost-per-ton" className="text-primary hover:underline">
            how much gravel costs
          </Link>
          .
        </p>
      </section>
    </GuideArticle>
  );
}
