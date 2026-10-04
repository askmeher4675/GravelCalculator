import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LastUpdated } from "@/components/content/LastUpdated";
import { InfoCallout } from "@/components/content/InfoCallout";
import { DataTable, TableNote } from "@/components/content/GuideArticle";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { calculators, calculatorTaglines } from "@/lib/calculators";
import {
  CUBIC_FT_PER_BAG as GRAVEL_BAG_CUBIC_FT,
  GRAVEL_TYPES,
  ORDER_INCREMENT_YD as BULK_ORDER_INCREMENT_YD,
  gravelCalculator,
} from "@/lib/calculators/gravel";
import { LBS_PER_CUBIC_YD_AGGREGATE } from "@/lib/calculators/driveway";
import {
  CUBIC_FT_PER_80LB_BAG,
  LBS_PER_CUBIC_YD_CONCRETE,
  ORDER_INCREMENT_YD as READY_MIX_ORDER_INCREMENT_YD,
} from "@/lib/calculators/concrete";
import { LBS_PER_CUBIC_YD_TOPSOIL } from "@/lib/calculators/topsoil";
import { CUBIC_FT_PER_BAG as MULCH_BAG_CUBIC_FT, LBS_PER_CUBIC_YD_MULCH } from "@/lib/calculators/mulch";
import { SQ_FT_PER_PALLET, SQ_FT_PER_ROLL } from "@/lib/calculators/sod";
import { SQ_FT_PER_GALLON } from "@/lib/calculators/paint";
import { BOARD_LENGTH_FT, JOIST_SPACING_IN } from "@/lib/calculators/deck";
import { CUBIC_FT_PER_CUBIC_YD } from "@/lib/calculators/volumeModel";

const PATH = "/methodology";
const TITLE = "Methodology: How Our Calculators Work";
const DESCRIPTION =
  "The formulas, material weights, waste allowances, and rounding rules behind every calculator on this site, what the estimates leave out, how we test them, and a log of changes.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  article: true,
});

// Worked example: rendered straight from the Gravel Calculator, so it always matches the tool.
const EXAMPLE_INPUTS = { shape: 1, length: 20, width: 10, depth: 4, gravelType: 1, pricePerTon: 55 };
const EXAMPLE_WASTE_PERCENT = 10;

const lb = (n: number) => `${n.toLocaleString("en-US")} lb`;
// Exact (1.325, 2.025) rather than toFixed(2), which would show 4,050 ÷ 2,000 as "2.02".
const tonsPerYd = (lbPerYd: number) => String(lbPerYd / 2000);

const SHAPE_ROWS = [
  ["Rectangle or square", "length × width", "Length and width"],
  ["Circle", "π × radius², where radius = diameter ÷ 2", "Diameter at the widest point"],
  ["Triangle", "½ × base × height", "Base, and the perpendicular height from it"],
  ["Circular ring", "π × (outer radius² − inner radius²)", "Outer and inner diameters, e.g. a path around a bed"],
  ["Trapezoid", "½ × (side A + side B) × width", "Both parallel sides and the distance between them"],
];

const CONVERSION_ROWS = [
  ["Inches of depth to feet", "÷ 12"],
  ["Cubic feet to cubic yards", `÷ ${CUBIC_FT_PER_CUBIC_YD}`],
  ["Cubic yards to cubic meters", "× 0.7646"],
  ["Square yards to square feet", "× 9"],
  ["Square feet to square inches", "× 144"],
  ["US tons to pounds", "× 2,000"],
  ["Pounds to kilograms", "× 0.4536"],
  ["Metric tonnes to US tons", "× 1.1023"],
];

/** Changes to how the calculators compute their results, newest first. Add an entry whenever the math changes. */
const CHANGES = [
  {
    date: "2026-10-04",
    text: "Driveway and Concrete calculators: added an optional price field (price per ton for the driveway, price per cubic yard for concrete). When you enter a price, the headline result becomes the material cost, calculated from the waste-adjusted quantity and not the rounded order. With the price left blank, results are unchanged. Cost covers the material only; delivery, taxes, and short-load fees are not included. Automated tests were added for both paths.",
  },
  {
    date: "2026-09-28",
    text: "Driveway Calculator FAQ: corrected the recommended crown from 1 in per foot (about 8%) to 1/2 in per foot (about 4%), in line with gravel road maintenance manuals. The gravel cost guide's example now prices the waste-adjusted volume, as the calculator does, and guide tables are generated from the calculators' own constants.",
  },
  {
    date: "2026-09-18",
    text: "Weight, bags, and cost now all come from the waste-adjusted volume, never from the rounded order. Previously the Gravel Calculator took weight and cost from a rounded whole-yard order, and the Topsoil Calculator took weight from its rounded order. Bulk orders now round up to the nearest 0.1 yd³ instead of whole yards; concrete keeps quarter-yard rounding. Automated tests were added for these rules.",
  },
  {
    date: "2026-09-18",
    text: "Corrected two worked examples that didn't match their calculators: the Driveway Calculator's (it said 3.33 yd³ where the formula gives 11.11 yd³) and the Paint Calculator's rounding wording.",
  },
  {
    date: "2026-09-18",
    text: "Added circle, triangle, circular ring, and trapezoid shapes to the gravel, driveway, concrete, mulch, topsoil, paver, and sod calculators.",
  },
  {
    date: "2026-09-18",
    text: "Gravel Calculator: added a gravel type setting with per-type weights of 2,600–2,800 lb per cubic yard, replacing a single 2,800 lb figure, and a price per ton so it can estimate total cost.",
  },
];

export default function MethodologyPage() {
  const example = gravelCalculator.calculate(EXAMPLE_INPUTS, EXAMPLE_WASTE_PERCENT);
  const exampleRows = example.breakdown.map((row) => [row.label, row.value]);

  const materialRows = [
    ...[...GRAVEL_TYPES]
      .sort((a, b) => a.lbPerCubicYd - b.lbPerCubicYd)
      .map((t) => [`Gravel: ${t.label}`, lb(t.lbPerCubicYd), tonsPerYd(t.lbPerCubicYd), `${GRAVEL_BAG_CUBIC_FT} ft³`]),
    ["Driveway base and surface stone", lb(LBS_PER_CUBIC_YD_AGGREGATE), tonsPerYd(LBS_PER_CUBIC_YD_AGGREGATE), "—"],
    [
      "Concrete",
      `${lb(LBS_PER_CUBIC_YD_CONCRETE)} (${LBS_PER_CUBIC_YD_CONCRETE / CUBIC_FT_PER_CUBIC_YD} lb/ft³)`,
      tonsPerYd(LBS_PER_CUBIC_YD_CONCRETE),
      `80 lb bag makes ${CUBIC_FT_PER_80LB_BAG} ft³`,
    ],
    ["Topsoil (moist, screened)", lb(LBS_PER_CUBIC_YD_TOPSOIL), tonsPerYd(LBS_PER_CUBIC_YD_TOPSOIL), "—"],
    ["Mulch (shredded bark)", lb(LBS_PER_CUBIC_YD_MULCH), tonsPerYd(LBS_PER_CUBIC_YD_MULCH), `${MULCH_BAG_CUBIC_FT} ft³`],
  ];

  const wasteRows = Object.values(calculators).map((c) => [
    c.title,
    (c.wastePercentOptions ?? []).map((p) => `${p}%`).join(", "),
    `${c.wastePercentDefault ?? 0}%`,
    c.wasteHelperText ?? "",
  ]);

  const roundingRows = [
    ["Bulk orders: gravel, driveway, mulch, topsoil", `Up to the nearest ${BULK_ORDER_INCREMENT_YD} yd³`, "Many suppliers sell partial yards; some sell only half or whole yards, so check"],
    ["Ready-mix concrete orders", `Up to the nearest ${READY_MIX_ORDER_INCREMENT_YD} yd³`, "Ready-mix is batched and billed in quarter-yard steps"],
    ["Bags of gravel, concrete, or mulch", "Up to a whole bag", "You can't buy part of a bag"],
    ["Pavers, sod, fence rails, deck boards", "Up to a whole unit", "The waste allowance, not rounding, covers cuts"],
    ["Paint", "Up to the nearest quart (0.25 gal)", "Paint is sold by the quart and the gallon"],
    ["Fence sections", "Up to a whole section", "The built fence may run slightly past your measured length"],
  ];

  const countRows = [
    ["Pavers", "Area ÷ the face area of one paver, plus waste, rounded up", "Ignores the narrow sand joints, so counts lean slightly high; no border course"],
    [
      "Sod",
      `Area plus waste, ÷ ${SQ_FT_PER_ROLL} ft² per roll or ${SQ_FT_PER_PALLET} ft² per pallet, rounded up`,
      "Roll and pallet sizes vary by sod farm",
    ],
    [
      "Fence",
      "Sections = length ÷ post spacing, rounded up; posts = sections + 1; rails = sections × rails per section, plus waste",
      "Pickets aren't estimated, since their width and spacing vary by style",
    ],
    [
      "Paint",
      `Wall length × height × coats, plus waste, ÷ ${SQ_FT_PER_GALLON} ft² per gallon, rounded up to a quart`,
      "Doors and windows aren't subtracted; take off about 20 ft² per door and 15 ft² per window",
    ],
    [
      "Deck",
      `Area ÷ board width = linear feet, plus waste, in ${BOARD_LENGTH_FT} ft boards; joists every ${JOIST_SPACING_IN} in across the width, plus one`,
      "Ignores gaps between boards; check framing against span tables",
    ],
  ];

  return (
    <>
      <ArticleJsonLd title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <PageContainer>
          <div className="mx-auto max-w-[680px]">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Methodology" }]} />
            <h1>{TITLE}</h1>
            <LastUpdated path={PATH} />
            <p className="mt-3 text-[16px] text-text-secondary">
              Every calculator on this site shows its work: the breakdown under each result lists every step from
              your measurements to the final number. This page explains the rules behind those steps in one place:
              the formulas, the material weights and bag sizes we assume, how waste and rounding work, what the
              estimates leave out, and how we test them. It ends with a log of changes to the math.
            </p>
            <div className="mt-6">
              <InfoCallout>
                <strong>The short version:</strong> measure the area, multiply by the depth to get the volume, and
                add a waste allowance. Weight, bags, and cost all come from that waste-adjusted volume. Rounding to
                what suppliers sell happens last, and only on the order quantity.
              </InfoCallout>
            </div>

            <section className="mt-10">
              <h2>The five steps behind every bulk-material estimate</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                The gravel, driveway, concrete, mulch, and topsoil calculators share one volume model:
              </p>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-[16px] text-text-secondary">
                <li>
                  <strong>Area.</strong> Worked out from the shape you choose, using the formulas below.
                </li>
                <li>
                  <strong>Volume.</strong> Area × depth, with the depth converted from inches to feet (÷ 12).
                  Cubic feet ÷ {CUBIC_FT_PER_CUBIC_YD} = cubic yards.
                </li>
                <li>
                  <strong>Waste allowance.</strong> Volume × (1 + waste %). This waste-adjusted volume is the
                  amount you actually buy.
                </li>
                <li>
                  <strong>Weight, bags, and cost.</strong> All three come from the waste-adjusted volume: weight is
                  cubic yards × the material&apos;s weight per cubic yard, bags are cubic feet ÷ the bag size
                  (rounded up), and cost is tons × your price per ton (cubic yards × your price per cubic yard for
                  concrete). Cost appears on the gravel calculator, and on the driveway and concrete calculators when
                  you enter an optional price.
                </li>
                <li>
                  <strong>Suggested order.</strong> The waste-adjusted volume, rounded up to the increment suppliers
                  sell: {BULK_ORDER_INCREMENT_YD} yd³ for bulk material and {READY_MIX_ORDER_INCREMENT_YD} yd³ for
                  ready-mix concrete.
                </li>
              </ol>

              <h3 className="mt-8">Worked example</h3>
              <p className="mt-3 text-[16px] text-text-secondary">
                Here is the Gravel Calculator&apos;s own breakdown for a 20 × 10 ft area of crushed stone (#57), 4 in
                deep, with 10% waste at $55 per ton. These are the same rows you see under the result on the{" "}
                <Link href="/calculators/gravel-calculator" className="font-semibold text-primary hover:underline">
                  calculator
                </Link>
                :
              </p>
              <DataTable headers={["Step", "Result"]} rows={exampleRows} />

              <h3 className="mt-8">Why weight and cost ignore the rounded order</h3>
              <p className="mt-3 text-[16px] text-text-secondary">
                The suggested order is a purchasing figure, not a measurement. If weight and cost were calculated from
                it, the tons you pay for wouldn&apos;t match the volume and bag count for the same job, and a tiny
                change in your measurements could make the cost jump by a whole rounding step. Keeping every figure on
                the same waste-adjusted volume means the numbers always agree with each other. Early versions of the
                Gravel and Topsoil calculators mixed the two; see the change log below.
              </p>
            </section>

            <section className="mt-10">
              <h2>Area formulas</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                The gravel, driveway, concrete, mulch, topsoil, paver, and sod calculators accept five shapes, and the
                breakdown shows the formula used.
              </p>
              <DataTable headers={["Shape", "Formula", "What you measure"]} rows={SHAPE_ROWS} />
              <TableNote>
                For an irregular area, split it into these shapes and add the results. On a slope, measure along the
                ground rather than the level distance, since the material covers the sloped surface.
              </TableNote>
            </section>

            <section className="mt-10">
              <h2>Material weights and bag sizes</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Weight turns a volume into tons, which is how many suppliers price bulk material. These are the exact
                figures each calculator uses:
              </p>
              <DataTable
                headers={["Material", "Weight per cubic yard", "Tons per cubic yard", "Bag size"]}
                rows={materialRows}
              />
              <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
                <li>
                  <strong>Driveway stone is listed heavier than #57</strong> because base and surface layers usually
                  contain fines, as in crusher run or #411, which fill the gaps and pack denser.
                </li>
                <li>
                  <strong>Real weights vary</strong> with the stone, its grading, and especially moisture. If your
                  supplier quotes a different weight per yard, scale our tonnage by the ratio: at 2,900 lb per yard
                  instead of 2,600, multiply by 2,900 ÷ 2,600 ≈ 1.12.
                </li>
                <li>
                  <strong>Concrete</strong> uses {LBS_PER_CUBIC_YD_CONCRETE / CUBIC_FT_PER_CUBIC_YD} lb per cubic
                  foot, the usual figure for normal-weight concrete, and bag yields follow manufacturers&apos;
                  published figures.
                </li>
                <li>
                  <strong>Mulch and topsoil</strong> weights swing the most with moisture, so treat them as a guide for
                  hauling rather than an exact figure.
                </li>
              </ul>
            </section>

            <section className="mt-10">
              <h2>Waste allowances</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                A waste allowance covers what real projects lose: material that settles and compacts, dips in the
                ground, spills, and offcuts. Each calculator offers a range, with a default that suits typical jobs.
              </p>
              <DataTable headers={["Calculator", "Options", "Default", "What it covers"]} rows={wasteRows} />
              <p className="mt-4 text-[16px] text-text-secondary">
                Go higher on soft or uneven ground, on curved or angled layouts, and with patterns that need many cuts,
                such as herringbone pavers. Running short usually costs more than ordering a little extra: a second bulk
                delivery comes with its own fee, and a second batch of pavers or paint may not match the first.
              </p>
            </section>

            <section className="mt-10">
              <h2>Rounding rules</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Rounding always comes last, and it only affects the quantity to order. The unrounded, waste-adjusted
                figure drives everything else.
              </p>
              <DataTable headers={["What", "Rounded", "Why"]} rows={roundingRows} />
              <TableNote>
                The rounding code also guards against computer arithmetic errors, so an order of exactly 2.2 yd³ stays
                2.2 instead of creeping up to 2.3.
              </TableNote>
            </section>

            <section className="mt-10">
              <h2>Count-based calculators</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                The paver, sod, fence, paint, and deck calculators count units instead of volume, but follow the same
                order: measure, add waste, then round up to whole units.
              </p>
              <DataTable headers={["Calculator", "How the count works", "Assumptions"]} rows={countRows} />
            </section>

            <section className="mt-10">
              <h2>Unit conversions</h2>
              <DataTable headers={["Conversion", "Multiply or divide by"]} rows={CONVERSION_ROWS} />
              <TableNote>
                Tons are US short tons (2,000 lb). Metric results are shown alongside the imperial ones where a
                calculator supports them.
              </TableNote>
            </section>

            <section className="mt-10">
              <h2>What the estimates leave out</h2>
              <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
                <li>
                  <strong>Excavation.</strong> Digging out soil to make room for a base isn&apos;t included, and soil
                  takes up more room once it&apos;s dug out than it did in the ground.
                </li>
                <li>
                  <strong>Extra compaction.</strong> Very soft ground, or thick base layers compacted hard, can use more
                  material than the largest waste allowance.
                </li>
                <li>
                  <strong>Uneven depth.</strong> The calculators assume a uniform depth. Thickened slab edges, tapered
                  layers, or filling low spots need to be added separately.
                </li>
                <li>
                  <strong>Supplier specifics.</strong> Minimum orders, delivery fees, truck capacity, sales tax, and the
                  exact yield of the bags you buy.
                </li>
                <li>
                  <strong>Structural requirements.</strong> Slab reinforcement and footings, deck framing and spans, and
                  fence post depth depend on local codes and site conditions.
                </li>
              </ul>
              <p className="mt-4 text-[16px] text-text-secondary">
                See the{" "}
                <Link href="/disclaimer" className="text-primary hover:underline">
                  disclaimer
                </Link>{" "}
                for more on using these estimates, and confirm quantities with your supplier before ordering.
              </p>
            </section>

            <section className="mt-10">
              <h2>How we check the calculators</h2>
              <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
                <li>
                  <strong>Automated tests</strong> cover the shared volume model and every bulk-material calculator.
                  They check that cubic yards equal cubic feet ÷ {CUBIC_FT_PER_CUBIC_YD}, that the waste-adjusted
                  volume equals the volume × (1 + waste %), that the suggested order is never smaller than what you
                  need, and that weight, bags, and cost all come from the same waste-adjusted volume. The Gravel
                  Calculator&apos;s tests run across every area shape, gravel type, and waste setting.
                </li>
                <li>
                  <strong>Rounding has its own tests,</strong> including the edge cases where computer arithmetic could
                  push an exact figure up a step.
                </li>
                <li>
                  <strong>One set of numbers.</strong> The tables in our{" "}
                  <Link href="/guides" className="text-primary hover:underline">
                    guides
                  </Link>{" "}
                  and on this page are generated from the same constants the calculators use, so they can&apos;t
                  quote a different weight or bag size than the calculators do.
                </li>
                <li>
                  <strong>Corrections are logged.</strong> When we find a mistake, we fix it and record it in the
                  change log below.
                </li>
              </ul>
            </section>

            <section className="mt-10">
              <h2>Calculator-by-calculator details</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Each calculator explains its specific formula under &quot;How this is calculated&quot;:
              </p>
              <ul className="mt-4 space-y-3">
                {Object.values(calculators).map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/calculators/${c.slug}#how-its-calculated`}
                      className="text-[16px] font-medium text-primary hover:underline"
                    >
                      {c.title}
                    </Link>
                    <p className="text-[15px] text-text-secondary">{calculatorTaglines[c.slug] ?? c.intro}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10">
              <h2>Change log</h2>
              <p className="mt-3 text-[16px] text-text-secondary">
                Changes to how the calculators compute their results, newest first.
              </p>
              <ul className="mt-4 space-y-4 text-[16px] text-text-secondary">
                {CHANGES.map((change) => (
                  <li key={change.text} className="border-l-2 border-border pl-4">
                    <time dateTime={change.date} className="block text-[14px] font-semibold text-text-primary">
                      {formatDate(change.date)}
                    </time>
                    {change.text}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
