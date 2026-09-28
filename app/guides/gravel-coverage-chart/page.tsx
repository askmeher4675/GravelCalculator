import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GuideArticle, DataTable, TableNote } from "@/components/content/GuideArticle";
import { InfoCallout } from "@/components/content/InfoCallout";
import { CUBIC_FT_PER_BAG, GRAVEL_TYPES } from "@/lib/calculators/gravel";
import { CUBIC_FT_PER_CUBIC_YD } from "@/lib/calculators/volumeModel";
import type { FaqItem } from "@/lib/calculators/types";

const PATH = "/guides/gravel-coverage-chart";
const TITLE = "Gravel Coverage Chart: Square Feet per Ton & Cubic Yard";
const DESCRIPTION =
  "How many square feet a cubic yard, a ton, or a bag of gravel covers at each depth, plus weight by gravel type, metric coverage, and worked examples.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: TITLE },
  description: DESCRIPTION,
  article: true,
});

const SQFT_PER_YD3_AT_1IN = CUBIC_FT_PER_CUBIC_YD * 12; // 27 ft³ spread 1/12 ft deep = 324 ft²
const DEPTHS = [1, 2, 3, 4, 6, 8, 12];
const AREAS = [100, 200, 300, 500, 1000];
const GRID_DEPTHS = [2, 3, 4, 6];
const BAG_DEPTHS = [1, 2, 3, 4];
const METRIC_DEPTHS_CM = [5, 7.5, 10, 15];
const KG_PER_LB = 0.45359237;
const CUBIC_M_PER_CUBIC_YD = 0.764554858;

const CRUSHED_LB_PER_YD = GRAVEL_TYPES.find((t) => t.label === "Crushed Stone (#57)")!.lbPerCubicYd;

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

const PROJECT_DEPTH_ROWS = [
  ["Decorative beds", "2–3 in"],
  ["Walkways and garden paths", "2–3 in"],
  ["Loose-gravel patio", "3–4 in over a compacted base"],
  ["Driveway on firm soil", "4–6 in, in two layers"],
  ["Driveway on clay or wet soil", "8–12 in, over geotextile fabric"],
  ["Base under pavers", "4–6 in for patios, 6–8 in or more for driveways"],
  ["Base under a concrete slab", "4 in, compacted"],
  ["French drain", "2–3 in under the pipe, then around and over it"],
];

const FAQS: FaqItem[] = [
  {
    question: "Is a cubic yard of gravel the same as a ton?",
    answer:
      "No. A cubic yard measures volume (27 ft³) and a ton measures weight (2,000 lb). A cubic yard of most gravel weighs about 1.3–1.4 tons, so a ton of gravel is only about three-quarters of a cubic yard.",
  },
  {
    question: "How do I measure an irregular area?",
    answer:
      "Split it into rectangles, circles, and triangles, work out each area, and add them together. For a curved bed or path, measure the length along the middle and average several widths. The Gravel Calculator also handles circles, rings, triangles, and tapered shapes directly.",
  },
  {
    question: "Should I plan for the depth before or after compaction?",
    answer:
      "Plan for the finished, compacted depth you want. Loose stone settles when it's compacted or driven on; the 10% waste allowance covers typical settling on firm ground, and 15% is safer on soft or uneven ground.",
  },
];

export default function GravelCoverageChartPage() {
  const tonFactor = 2000 / CRUSHED_LB_PER_YD; // share of a cubic yard in one ton of crushed stone
  const depthRows = DEPTHS.map((d) => {
    const yd = SQFT_PER_YD3_AT_1IN / d;
    return [`${d} in`, `${fmt(yd)} sq ft`, `${fmt(yd * tonFactor)} sq ft`];
  });
  const typeRows = [...GRAVEL_TYPES]
    .sort((a, b) => a.lbPerCubicYd - b.lbPerCubicYd)
    .map((t) => [
      t.label,
      `${fmt(t.lbPerCubicYd)} lb`,
      (t.lbPerCubicYd / 2000).toFixed(2),
      `${fmt((SQFT_PER_YD3_AT_1IN * (2000 / t.lbPerCubicYd)) / 3)} sq ft`,
    ]);
  const areaRows = AREAS.map((area) => [
    `${fmt(area)} sq ft`,
    ...GRID_DEPTHS.map((d) => ((area * (d / 12)) / CUBIC_FT_PER_CUBIC_YD).toFixed(2)),
  ]);
  const bagRows = BAG_DEPTHS.map((d) => {
    const perBag = CUBIC_FT_PER_BAG / (d / 12);
    return [`${d} in`, `${perBag.toFixed(1)} sq ft`, String(Math.ceil(100 / perBag))];
  });
  const kgPerCubicM = (CRUSHED_LB_PER_YD * KG_PER_LB) / CUBIC_M_PER_CUBIC_YD;
  const metricRows = METRIC_DEPTHS_CM.map((cm) => {
    const perCubicM = 1 / (cm / 100);
    return [`${cm} cm`, `${perCubicM.toFixed(1)} m²`, `${((1000 / kgPerCubicM) * perCubicM).toFixed(1)} m²`];
  });

  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Gravel Coverage Chart"
      intro="Suppliers sell gravel by the cubic yard or by the ton, but your project is measured in square feet and inches. These charts convert between them, for bulk loads, bags, and metric units, so you can sanity-check any quote or estimate."
      related={[
        { href: "/calculators/gravel-calculator", label: "Gravel Calculator" },
        { href: "/guides/gravel-cost-per-ton", label: "How much does gravel cost?" },
        { href: "/guides/gravel-types-and-sizes", label: "Gravel types and sizes explained" },
        { href: "/guides/gravel-driveway", label: "How much gravel for a driveway" },
      ]}
      faqs={FAQS}
    >
      <div className="mt-6">
        <InfoCallout>
          <strong>Quick answer:</strong> one cubic yard of gravel covers 324 sq ft at 1 in deep, 162 sq ft at
          2 in, 108 sq ft at 3 in, and 81 sq ft at 4 in. A ton of crushed stone covers about 77% as much:
          roughly 83 sq ft at 3 in.
        </InfoCallout>
      </div>

      <section className="mt-10">
        <h2>Coverage by depth</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          One cubic yard is 27 cubic feet, so it covers 324 square feet at 1 inch deep, and coverage falls in
          proportion as depth increases. The per-ton column uses crushed stone (#57) at about 2,600 lb per
          cubic yard, so a ton covers roughly 77% as much area as a cubic yard.
        </p>
        <DataTable headers={["Depth", "1 cubic yard covers", "1 ton covers (crushed stone)"]} rows={depthRows} />
        <TableNote>
          Figures are for loose material placed at the stated depth, before any allowance for compaction or
          waste.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>How much gravel for common areas</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Find your area and depth to read off the cubic yards you need before waste. Multiply by 1.1 to add
          10% extra, then by 1.3 (crushed stone) or 1.4 (pea gravel) to convert to tons.
        </p>
        <DataTable headers={["Area", "2 in", "3 in", "4 in", "6 in"]} rows={areaRows} />
        <TableNote>Cubic yards, before waste. For areas in between, add rows together: 700 sq ft is the 200 and 500 rows combined.</TableNote>
      </section>

      <section className="mt-10">
        <h2>Weight by gravel type</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Gravel is heavier or lighter per yard depending on the stone, its size, and how much fine material
          is mixed in. These are the typical values the{" "}
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
        <h2>Coverage per bag</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Bagged gravel is usually sold in 0.5 ft³ bags, and 54 of them make a cubic yard. Bags are handy for
          small areas, but the count climbs quickly: a 10 × 10 ft area at 3 in deep takes 50 bags, or 55 with
          10% extra.
        </p>
        <DataTable headers={["Depth", "One 0.5 ft³ bag covers", "Bags per 100 sq ft"]} rows={bagRows} />
        <TableNote>Bag counts are before waste and rounded up to whole bags.</TableNote>
      </section>

      <section className="mt-10">
        <h2>Metric coverage</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          One cubic meter of gravel covers 20 m² at 5 cm deep. Note that a US ton (2,000 lb, about 907 kg) is
          lighter than a metric tonne (1,000 kg), so a tonne covers about 10% more ground than a ton.
        </p>
        <DataTable headers={["Depth", "1 m³ covers", "1 tonne covers (crushed stone)"]} rows={metricRows} />
      </section>

      <section className="mt-10">
        <h2>How to use the chart</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[16px] text-text-secondary">
          <li>Measure the area in square feet (length × width).</li>
          <li>Pick your depth from the chart, then divide your area by the coverage figure.</li>
          <li>Add about 10% for settling, compaction and an uneven sub-grade.</li>
          <li>Round up to the increment your supplier sells.</li>
        </ol>
        <div className="mt-4 space-y-3">
          <InfoCallout>
            Example: a 20 ft × 10 ft path is 200 sq ft. At 3 in deep, one cubic yard covers 108 sq ft, so you
            need about 1.85 yd³. With 10% waste that is roughly 2.04 yd³, or about 2.7 tons of crushed stone.
          </InfoCallout>
          <InfoCallout>
            Working backward from a quote: one ton of crushed stone covers about 62 sq ft at 4 in deep, so a
            5-ton load covers roughly 310 sq ft before waste.
          </InfoCallout>
        </div>
      </section>

      <section className="mt-10">
        <h2>Why real coverage comes up short</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Compaction.</strong> Loose stone settles when it&apos;s compacted or driven on, so a 4 in
            loose layer finishes thinner. Stone with fines, such as crusher run, settles the most.
          </li>
          <li>
            <strong>Uneven ground.</strong> Every dip in the subgrade has to be filled before the surface is
            level.
          </li>
          <li>
            <strong>Soft soil.</strong> On clay or wet ground, some stone is pushed down into the soil,
            especially without geotextile fabric.
          </li>
          <li>
            <strong>Edges and handling.</strong> Stone spills past the edging, sticks in the truck bed, and gets
            tracked away.
          </li>
        </ul>
        <p className="mt-4 text-[16px] text-text-secondary">
          That&apos;s why our calculators add 10% by default. Use 15% on soft or uneven ground.
        </p>
      </section>

      <section className="mt-10">
        <h2>Typical depths by project</h2>
        <DataTable headers={["Project", "Typical gravel depth"]} rows={PROJECT_DEPTH_ROWS} />
        <TableNote>
          See{" "}
          <Link href="/guides/gravel-driveway" className="text-primary hover:underline">
            how much gravel for a driveway
          </Link>{" "}
          for layer-by-layer driveway builds, and{" "}
          <Link href="/guides/gravel-types-and-sizes" className="text-primary hover:underline">
            types of gravel and sizes
          </Link>{" "}
          for which stone suits each project.
        </TableNote>
      </section>
    </GuideArticle>
  );
}
