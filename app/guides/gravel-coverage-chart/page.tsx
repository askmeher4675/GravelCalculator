import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { GuideArticle, DataTable } from "@/components/content/GuideArticle";
import { InfoCallout } from "@/components/content/InfoCallout";

const PATH = "/guides/gravel-coverage-chart";
const TITLE = "Gravel Coverage Chart: Square Feet per Ton & Cubic Yard";
const DESCRIPTION =
  "How many square feet a cubic yard or ton of gravel covers at each depth, plus weight per cubic yard by gravel type. Includes worked examples.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: TITLE },
  description: DESCRIPTION,
  article: true,
});

const SQFT_PER_YD3_AT_1IN = 324; // 27 ft³ / (1/12 ft)
const DEPTHS = [1, 2, 3, 4, 6, 8, 12];

// Same approximate densities the calculator uses (lb per cubic yard).
const TYPES = [
  { label: "Crushed stone (#57)", lb: 2600 },
  { label: "River rock", lb: 2650 },
  { label: "Crushed limestone", lb: 2700 },
  { label: "Pea gravel", lb: 2800 },
  { label: "Decomposed granite", lb: 2800 },
];

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export default function GravelCoverageChartPage() {
  const depthRows = DEPTHS.map((d) => {
    const yd = SQFT_PER_YD3_AT_1IN / d;
    const perTon = yd * (2000 / 2600);
    return [`${d} in`, `${fmt(yd)} sq ft`, `${fmt(perTon)} sq ft`];
  });
  const typeRows = TYPES.map((t) => [
    t.label,
    `${fmt(t.lb)} lb`,
    (t.lb / 2000).toFixed(2),
    `${fmt(SQFT_PER_YD3_AT_1IN * (2000 / t.lb) / 3)} sq ft`,
  ]);

  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Gravel Coverage Chart"
      intro="Suppliers sell gravel by the cubic yard or by the ton, but your project is measured in square feet and inches. This chart converts between them so you can sanity-check any quote or estimate."
    >
      <section className="mt-10">
        <h2>Coverage by depth</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          One cubic yard is 27 cubic feet, so it covers 324 square feet at 1 inch deep, and coverage
          falls in proportion as depth increases. The per-ton column uses crushed stone (#57) at about
          2,600 lb per cubic yard, so a ton covers roughly 77% as much area as a cubic yard.
        </p>
        <DataTable headers={["Depth", "1 cubic yard covers", "1 ton covers (crushed stone)"]} rows={depthRows} />
        <p className="mt-3 text-[14px] text-text-muted">
          Figures are for loose material placed at the stated depth, before any allowance for compaction or waste.
        </p>
      </section>

      <section className="mt-10">
        <h2>Weight by gravel type</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Gravel is heavier or lighter per yard depending on the stone, its size, and how much fine
          material is mixed in. These are the typical values the{" "}
          <Link href="/calculators/gravel-calculator" className="font-semibold text-primary hover:underline">
            Gravel Calculator
          </Link>{" "}
          uses. Your supplier&apos;s actual weight can differ, especially for wet or freshly screened stock.
        </p>
        <DataTable
          headers={["Gravel type", "Weight per cubic yard", "Tons per cubic yard", "1 ton covers at 3 in"]}
          rows={typeRows}
        />
      </section>

      <section className="mt-10">
        <h2>How to use the chart</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[16px] text-text-secondary">
          <li>Measure the area in square feet (length × width).</li>
          <li>Pick your depth from the chart, then divide your area by the coverage figure.</li>
          <li>Add about 10% for settling, compaction and an uneven sub-grade.</li>
          <li>Round up to the increment your supplier sells.</li>
        </ol>
        <div className="mt-4">
          <InfoCallout>
            Example: a 20 ft × 10 ft path is 200 sq ft. At 3 in deep, one cubic yard covers 108 sq ft, so
            you need about 1.85 yd³. With 10% waste that is roughly 2.04 yd³, or about 2.7 tons of
            crushed stone.
          </InfoCallout>
        </div>
      </section>

      <section className="mt-10">
        <h2>Related</h2>
        <ul className="mt-4 space-y-2 text-[16px]">
          <li>
            <Link href="/guides/gravel-cost-per-ton" className="font-medium text-primary hover:underline">
              How much does gravel cost? →
            </Link>
          </li>
          <li>
            <Link href="/guides/gravel-types-and-sizes" className="font-medium text-primary hover:underline">
              Gravel types and sizes explained →
            </Link>
          </li>
          <li>
            <Link href="/guides/gravel-driveway" className="font-medium text-primary hover:underline">
              How much gravel for a driveway →
            </Link>
          </li>
        </ul>
      </section>
    </GuideArticle>
  );
}
