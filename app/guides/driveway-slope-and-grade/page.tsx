import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GuideArticle, DataTable, TableNote } from "@/components/content/GuideArticle";
import { InfoCallout } from "@/components/content/InfoCallout";
import type { FaqItem } from "@/lib/calculators/types";

const PATH = "/guides/driveway-slope-and-grade";
const TITLE = "Driveway Slope: Grade, Percent & How to Calculate It";
const DESCRIPTION =
  "How to calculate driveway slope from rise and run, a conversion table for percent, degrees and ratio, how steep is too steep, and how much crown a gravel driveway needs.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: TITLE },
  description: DESCRIPTION,
  article: true,
});

const slopeDegrees = (percent: number) => (Math.atan(percent / 100) * 180) / Math.PI;
const PERCENTS = [1, 2, 4, 5, 8, 10, 12, 15, 20];

// Worked example: a 50 ft driveway that drops 4 ft from the garage to the street.
const EX_RISE = 4;
const EX_RUN = 50;
const EX_PERCENT = (EX_RISE / EX_RUN) * 100;

const FAQS: FaqItem[] = [
  {
    question: "How do I calculate the slope of my driveway?",
    answer:
      "Divide the rise (the change in height) by the run (the horizontal distance) and multiply by 100 to get a percentage. A driveway that drops 4 ft over 50 ft has a slope of 8%. Measure the run along level ground, not along the sloped surface.",
  },
  {
    question: "What is the maximum slope for a driveway?",
    answer:
      "It varies by locality. Many places cap residential driveways at roughly 12% to 15%, and some allow up to 20% or more. Check with your local building or public works department, because steeper limits may apply near the street or for fire access.",
  },
  {
    question: "What slope is best for a gravel driveway?",
    answer:
      "Gentle slopes work best. Keep gravel driveways well under about 10% where you can, because loose stone migrates downhill and rain can wash it out. Steeper runs need larger angular stone, more frequent regrading, and good drainage.",
  },
  {
    question: "How much slope does a driveway need for drainage?",
    answer:
      "A minimum of about 1% to 2% along the length, and a cross-slope or crown of about 1/4 to 1/2 in per foot of width, keeps water moving off the surface. Flat driveways hold water and soften the base.",
  },
  {
    question: "Does a sloped driveway need more gravel?",
    answer:
      "Only slightly. A sloped surface has a bit more area than its plan view, but the difference is under 1% at a 10% grade, which the standard 10% waste allowance easily covers. Steep driveways may need a deeper base for stability.",
  },
];

export default function DrivewaySlopeAndGradePage() {
  const conversionRows = PERCENTS.map((p) => [
    `${p}%`,
    `1 : ${Number((100 / p).toFixed(1))}`,
    `${slopeDegrees(p).toFixed(1)}°`,
    `${((p / 100) * 10 * 12).toFixed(1)} in`,
    `${((p / 100) * 50).toFixed(1)} ft`,
  ]);
  const areaRows = [5, 10, 15, 20, 30].map((p) => {
    const factor = Math.sqrt(1 + (p / 100) ** 2);
    return [`${p}%`, factor.toFixed(3), `${((factor - 1) * 100).toFixed(1)}%`];
  });
  const crownRows = [
    [`1/4 in per ft`, "2.1%", `${(12 / 2) * 0.25} in`, `${12 * 0.25} in`],
    [`3/8 in per ft`, "3.1%", `${(12 / 2) * 0.375} in`, `${12 * 0.375} in`],
    [`1/2 in per ft`, "4.2%", `${(12 / 2) * 0.5} in`, `${12 * 0.5} in`],
  ];

  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Driveway Slope and Grade"
      intro="Slope decides whether a driveway drains, whether cars scrape and slip, and how much maintenance a gravel surface needs. This guide shows how to calculate your driveway's slope from two measurements, converts between percent, degrees and ratio, explains how steep is too steep, and covers the crown that keeps water off the surface."
      related={[
        { href: "/calculators/driveway-calculator", label: "Driveway Gravel Calculator" },
        { href: "/guides/gravel-driveway", label: "How much gravel for a driveway" },
        { href: "/guides/gravel-types-and-sizes", label: "Gravel types and sizes explained" },
        { href: "/guides/gravel-cost-per-ton", label: "How much does gravel cost?" },
      ]}
      faqs={FAQS}
    >
      <div className="mt-6">
        <InfoCallout>
          <strong>Quick answer:</strong> slope in percent is rise divided by run, times 100. A driveway that drops{" "}
          {EX_RISE} ft over {EX_RUN} ft is {EX_PERCENT}% (about {slopeDegrees(EX_PERCENT).toFixed(1)}°). Aim for at
          least 1–2% so water drains, and keep gravel driveways well under about 10% where you can.
        </InfoCallout>
      </div>

      <section className="mt-10">
        <h2>How to calculate driveway slope</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          You need two numbers: the <strong>rise</strong>, which is how much the ground drops (or climbs) between the
          top and bottom of the driveway, and the <strong>run</strong>, which is the horizontal distance between those
          two points.
        </p>
        <p className="mt-4 rounded-lg bg-surface px-4 py-3 text-center font-mono text-[16px] text-text-primary">
          slope % = (rise ÷ run) × 100
        </p>
        <p className="mt-4 text-[16px] text-text-secondary">
          For example, a driveway that falls {EX_RISE} ft from the garage slab to the street over {EX_RUN} ft of
          horizontal distance has a slope of ({EX_RISE} ÷ {EX_RUN}) × 100 = {EX_PERCENT}%. As a ratio that is 1 foot
          of drop for every {(EX_RUN / EX_RISE).toFixed(1)} feet of length, and as an angle it is about{" "}
          {slopeDegrees(EX_PERCENT).toFixed(1)}°. To find the angle yourself, take the arctangent of rise divided by
          run.
        </p>
      </section>

      <section className="mt-10">
        <h2>How to measure rise and run</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[16px] text-text-secondary">
          <li>
            <strong>String and line level.</strong> Drive a stake at the top and another at the bottom. Tie a string
            to the top stake at ground level and stretch it level toward the bottom stake using a line level or a
            torpedo level. Measure straight down from the string to the ground at the bottom stake: that is the rise.
            Measure the string length: that is the run.
          </li>
          <li>
            <strong>Level and tape.</strong> For a short run, lay a straight 2×4 on the ground, level it, and measure
            the gap between the board end and the ground. Then divide by the board length.
          </li>
          <li>
            <strong>Phone or digital level.</strong> Lay a straight board on the driveway and read the angle or
            percent from the level. Check it in a few places, since driveways often change grade along their length.
          </li>
          <li>
            <strong>Survey or grade stakes.</strong> For a long or complicated driveway, a surveyor or contractor can
            mark elevations, which is also the best way to plan drainage.
          </li>
        </ol>
        <p className="mt-4 text-[16px] text-text-secondary">
          Measure the run horizontally, not along the surface. If the grade changes partway, measure each section
          separately and note where it steepens, since the steepest stretch is the one that matters for traction and
          washout.
        </p>
      </section>

      <section className="mt-10">
        <h2>Slope conversion chart</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Slopes are quoted several ways: as a percent, a ratio, or degrees. This table converts between them and
          shows the drop over 10 ft and over 50 ft.
        </p>
        <DataTable
          headers={["Slope", "Ratio (rise : run)", "Angle", "Drop per 10 ft", "Drop per 50 ft"]}
          rows={conversionRows}
        />
        <TableNote>
          A 100% slope is 45°, so driveway slopes are small angles. Even 20% is only about{" "}
          {slopeDegrees(20).toFixed(0)}°.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>How steep is too steep?</h2>
        <DataTable
          headers={["Slope", "What to expect"]}
          rows={[
            ["Under 1%", "Nearly flat; water pools and softens the base"],
            ["1–2%", "Minimum for drainage on a hard surface"],
            ["2–8%", "Comfortable for most driveways, easy to build and maintain"],
            ["8–12%", "Fine for most cars; gravel starts to need more upkeep"],
            ["12–15%", "Common upper limit in many places; watch traction in ice and snow"],
            ["Over 15%", "May exceed local limits; scraping, braking, and washout become real problems"],
          ]}
        />
        <TableNote>
          These are general guidelines. Local codes set the actual limit and often regulate the portion near the
          street and any fire-access requirements, so check with your building or public works department.
        </TableNote>
        <p className="mt-4 text-[16px] text-text-secondary">
          Steepness isn&apos;t the only issue. Abrupt changes in grade, such as where the driveway meets the street or
          the garage apron, make low-slung cars scrape. Ease the transitions with a gradual curve rather than an
          angle.
        </p>
      </section>

      <section className="mt-10">
        <h2>Crown and cross-slope</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Slope along the length moves water down the driveway. Slope across the width moves water off the sides. A
          crown, where the center is higher than both edges, or a single cross-slope tilting to one side, is what
          keeps rain from pooling on the surface. A common target is about 1/4 to 1/2 in of fall per foot of width.
        </p>
        <DataTable
          headers={["Cross-slope", "Percent", "Crown rise (12 ft wide)", "One-sided drop (12 ft wide)"]}
          rows={crownRows}
        />
        <TableNote>
          A crown rises to the middle, so the rise is half the width times the slope. One-sided slopes drop across the
          full width.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>Gravel driveways on a slope</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Use angular crushed stone.</strong> Rounded gravel rolls downhill. Stone with fines compacts into a
            surface that stays in place better. See{" "}
            <Link href="/guides/gravel-types-and-sizes" className="text-primary hover:underline">
              gravel types and sizes
            </Link>
            .
          </li>
          <li>
            <strong>Build a stronger base.</strong> Slopes load the base unevenly, so 6 in or more of compacted stone
            under a thinner top layer holds better than one thick layer of loose gravel.
          </li>
          <li>
            <strong>Control the water.</strong> Water running down the surface is what carves ruts. Use a crown, side
            ditches or swales, and cross drains (water bars) on long runs to send it off the driveway.
          </li>
          <li>
            <strong>Expect more maintenance.</strong> Rake stone back from the low end each season, and refill ruts
            before they deepen.
          </li>
          <li>
            <strong>Consider paving the steep section.</strong> Some owners gravel the gentle parts and pave only the
            steepest stretch or the apron where the driveway meets the road.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2>Does slope change how much gravel you need?</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Slightly. A sloped surface is a little bigger than its plan view: the true area equals the plan area times
          the square root of one plus the slope squared. At the slopes driveways are built, the difference is small.
        </p>
        <DataTable headers={["Slope", "Area multiplier", "Extra area"]} rows={areaRows} />
        <p className="mt-4 text-[16px] text-text-secondary">
          Because the extra is under 1% at a 10% grade, the standard 10% waste allowance in the{" "}
          <Link href="/calculators/driveway-calculator" className="font-semibold text-primary hover:underline">
            Driveway Gravel Calculator
          </Link>{" "}
          covers it. Measure the driveway length along the ground if you want to be precise, and consider a deeper
          base on steep runs for stability rather than for extra volume.
        </p>
      </section>

      <section className="mt-10">
        <h2>Drainage checklist</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] text-text-secondary">
          <li>Slope the ground away from the garage and house, not toward them.</li>
          <li>Give the surface a crown or cross-slope so water leaves the sides.</li>
          <li>Provide a place for water to go: a ditch, swale, or culvert along the low side.</li>
          <li>Keep runoff from a sloped driveway off the street and off your neighbor&apos;s property where rules require it.</li>
          <li>Install a drain across the bottom of a steep driveway that slopes toward the garage.</li>
        </ul>
      </section>
    </GuideArticle>
  );
}
