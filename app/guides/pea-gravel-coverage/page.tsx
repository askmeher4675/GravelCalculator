import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GuideArticle, DataTable, TableNote } from "@/components/content/GuideArticle";
import { InfoCallout } from "@/components/content/InfoCallout";
import { CUBIC_FT_PER_BAG, GRAVEL_TYPES } from "@/lib/calculators/gravel";
import { CUBIC_FT_PER_CUBIC_YD, rawVolume, withWaste } from "@/lib/calculators/volumeModel";
import type { FaqItem } from "@/lib/calculators/types";

const PATH = "/guides/pea-gravel-coverage";
const TITLE = "How Much Does a Ton of Pea Gravel Cover? Coverage Chart";
const DESCRIPTION =
  "How many square feet a ton, a cubic yard, or a bag of pea gravel covers at each depth, how many tons you need for common areas, and where pea gravel works best.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: TITLE },
  description: DESCRIPTION,
  article: true,
});

const PEA = GRAVEL_TYPES.find((t) => t.label === "Pea Gravel")!;
const CRUSHED = GRAVEL_TYPES.find((t) => t.label === "Crushed Stone (#57)")!;
const SQFT_PER_YD_AT_1IN = CUBIC_FT_PER_CUBIC_YD * 12;
const TONS_PER_YD = PEA.lbPerCubicYd / 2000;
const YD_PER_TON = 2000 / PEA.lbPerCubicYd;

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const peaTons = (areaSqFt: number, depthIn: number) => rawVolume(areaSqFt, depthIn / 12).cubicYd * TONS_PER_YD;

// Worked example: a 20 × 10 ft garden path, 3 in deep, 10% waste.
const EX_AREA = 20 * 10;
const EX_YD = withWaste(rawVolume(EX_AREA, 3 / 12).cubicYd, 10);
const EX_TONS = EX_YD * TONS_PER_YD;
const EX_BAGS = Math.ceil(withWaste(rawVolume(EX_AREA, 3 / 12).cubicFt, 10) / CUBIC_FT_PER_BAG);

const FAQS: FaqItem[] = [
  {
    question: "How many square feet does a ton of pea gravel cover?",
    answer: `At 2 in deep, a ton of pea gravel covers about ${fmt((SQFT_PER_YD_AT_1IN / 2) * YD_PER_TON)} sq ft. At 3 in it covers about ${fmt((SQFT_PER_YD_AT_1IN / 3) * YD_PER_TON)} sq ft, and at 4 in about ${fmt((SQFT_PER_YD_AT_1IN / 4) * YD_PER_TON)} sq ft.`,
  },
  {
    question: "How many cubic yards are in a ton of pea gravel?",
    answer: `About ${YD_PER_TON.toFixed(2)} cubic yards. Pea gravel weighs roughly ${PEA.lbPerCubicYd.toLocaleString("en-US")} lb per cubic yard, so a cubic yard is about ${TONS_PER_YD.toFixed(1)} tons.`,
  },
  {
    question: "How deep should pea gravel be?",
    answer:
      "Two to three inches is enough for paths and decorative beds, and 3 to 4 inches for areas that get more use, such as dog runs. Deeper layers of 6 in or more are used for drainage trenches and pipe bedding, where it's not a walking surface.",
  },
  {
    question: "Is pea gravel good for a driveway?",
    answer:
      "Not on its own. The stones are round, so they don't lock together and tend to shift and spread under tires. Crushed angular stone is the better driveway material, and pea gravel works if it's confined by edging in a small, low-traffic area.",
  },
  {
    question: "Do I need landscape fabric under pea gravel?",
    answer:
      "It helps. Fabric keeps weeds from coming up and stops the stones from sinking into soft soil, which extends the life of the layer. Edging is just as important, because loose round stone drifts out of the bed.",
  },
];

export default function PeaGravelCoveragePage() {
  const depths = [1, 2, 3, 4, 6];
  const coverageRows = depths.map((d) => {
    const perYd = SQFT_PER_YD_AT_1IN / d;
    return [
      `${d} in`,
      `${fmt(perYd)} sq ft`,
      `${fmt(perYd * YD_PER_TON)} sq ft`,
      `${(CUBIC_FT_PER_BAG / (d / 12)).toFixed(1)} sq ft`,
    ];
  });
  const areas = [50, 100, 200, 500, 1000];
  const tonRows = areas.map((a) => [`${fmt(a)} sq ft`, ...[2, 3, 4].map((d) => peaTons(a, d).toFixed(2))]);

  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Pea Gravel Coverage"
      intro="Pea gravel is small, rounded stone that's popular for paths, patios, dog runs, and drainage. It's sold by the ton or the cubic yard, so the question is how far a ton goes. This chart answers that at every depth, shows how many tons common areas need, and covers where pea gravel works well and where it doesn't."
      related={[
        { href: "/calculators/gravel-calculator", label: "Gravel Calculator (select Pea Gravel)" },
        { href: "/guides/gravel-coverage-chart", label: "Gravel coverage chart" },
        { href: "/guides/gravel-types-and-sizes", label: "Gravel types and sizes explained" },
        { href: "/guides/gravel-cost-per-ton", label: "How much does gravel cost?" },
      ]}
      faqs={FAQS}
    >
      <div className="mt-6">
        <InfoCallout>
          <strong>Quick answer:</strong> a ton of pea gravel covers about {fmt((SQFT_PER_YD_AT_1IN / 2) * YD_PER_TON)}{" "}
          sq ft at 2 in deep, {fmt((SQFT_PER_YD_AT_1IN / 3) * YD_PER_TON)} sq ft at 3 in, and{" "}
          {fmt((SQFT_PER_YD_AT_1IN / 4) * YD_PER_TON)} sq ft at 4 in. A cubic yard weighs about{" "}
          {TONS_PER_YD.toFixed(1)} tons.
        </InfoCallout>
      </div>

      <section className="mt-10">
        <h2>Pea gravel coverage by depth</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          A cubic yard is {CUBIC_FT_PER_CUBIC_YD} cubic feet, so it covers {fmt(SQFT_PER_YD_AT_1IN)} sq ft at 1 in deep,
          and proportionally less as the layer gets thicker. The calculator uses about{" "}
          {PEA.lbPerCubicYd.toLocaleString("en-US")} lb per cubic yard for pea gravel, so a ton is about{" "}
          {YD_PER_TON.toFixed(2)} cubic yards.
        </p>
        <DataTable
          headers={["Depth", "1 cubic yard covers", "1 ton covers", "One 0.5 ft³ bag covers"]}
          rows={coverageRows}
        />
        <TableNote>
          Figures are for loose gravel at the stated depth, before any allowance for settling or waste.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>Tons of pea gravel for common areas</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Find your area and depth to read off the tons you need before waste. Add 10% for settling and an uneven
          base, and round up to the quantity your supplier sells.
        </p>
        <DataTable headers={["Area", "2 in deep", "3 in deep", "4 in deep"]} rows={tonRows} />
        <TableNote>Tons, before waste. For areas in between, add rows together.</TableNote>
      </section>

      <section className="mt-10">
        <h2>Worked example: a 20 × 10 ft path</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[16px] text-text-secondary">
          <li>
            <strong>Area:</strong> 20 × 10 = {EX_AREA} sq ft.
          </li>
          <li>
            <strong>Volume at 3 in:</strong> {EX_AREA} × 0.25 ft ÷ 27 = {rawVolume(EX_AREA, 3 / 12).cubicYd.toFixed(2)} yd³.
          </li>
          <li>
            <strong>With 10% waste:</strong> {EX_YD.toFixed(2)} yd³.
          </li>
          <li>
            <strong>Weight:</strong> {EX_YD.toFixed(2)} × {TONS_PER_YD.toFixed(1)} tons per yd³ ≈{" "}
            {EX_TONS.toFixed(1)} tons.
          </li>
          <li>
            <strong>Bags instead:</strong> that is about {EX_BAGS} bags of 0.5 ft³, which is why bulk delivery makes
            sense for anything this size.
          </li>
        </ol>
        <p className="mt-4 text-[16px] text-text-secondary">
          Enter the same dimensions in the{" "}
          <Link href="/calculators/gravel-calculator" className="font-semibold text-primary hover:underline">
            Gravel Calculator
          </Link>{" "}
          and choose Pea Gravel to get the tons and, with your price per ton, the total cost.
        </p>
      </section>

      <section className="mt-10">
        <h2>Pea gravel versus crushed stone</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Pea gravel weighs about {PEA.lbPerCubicYd.toLocaleString("en-US")} lb per cubic yard, a little more than
          crushed stone at about {CRUSHED.lbPerCubicYd.toLocaleString("en-US")} lb, so a ton of pea gravel covers about{" "}
          {Math.round((1 - CRUSHED.lbPerCubicYd / PEA.lbPerCubicYd) * 100)}% less ground. The bigger difference is
          how it behaves underfoot.
        </p>
        <DataTable
          headers={["", "Pea gravel", "Crushed stone"]}
          rows={[
            ["Shape", "Smooth, rounded", "Angular, with sharp edges"],
            ["Stability", "Shifts and rolls; stays loose", "Locks together when compacted"],
            ["Comfort", "Smooth and comfortable to walk on", "Can be rough on bare feet"],
            ["Drainage", "Excellent", "Excellent if clean, slower with fines"],
            ["Best uses", "Paths, dog runs, decorative areas, drainage", "Bases, driveways, heavy-use surfaces"],
            ["Typical size", "About 1/8 to 3/8 in", "Commonly 3/4 in or larger"],
          ]}
        />
      </section>

      <section className="mt-10">
        <h2>How deep to spread pea gravel</h2>
        <DataTable
          headers={["Project", "Typical depth", "Notes"]}
          rows={[
            ["Decorative beds", "2 in", "Over landscape fabric"],
            ["Walkways and garden paths", "2–3 in", "Use edging to hold the stones in"],
            ["Patios and seating areas", "3–4 in", "Over a compacted base for a firm surface"],
            ["Dog runs", "3–4 in", "Fabric below; hose it down to keep it clean"],
            ["Drainage trenches and pipe bedding", "6 in or more", "Wrapped in fabric, with the pipe surrounded by stone"],
          ]}
        />
        <p className="mt-4 text-[16px] text-text-secondary">
          For a patio or path that needs a firm surface, a compacted crushed-stone base under a thin pea gravel
          topping holds up better than pea gravel alone. See the{" "}
          <Link href="/guides/gravel-types-and-sizes" className="text-primary hover:underline">
            types and sizes guide
          </Link>{" "}
          for base options.
        </p>
      </section>

      <section className="mt-10">
        <h2>Installing pea gravel</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[16px] text-text-secondary">
          <li>
            <strong>Excavate and level.</strong> Remove sod and roots, then slope the ground slightly so water drains
            away from buildings.
          </li>
          <li>
            <strong>Add edging.</strong> Steel, plastic, stone, or timber keeps loose round stone in place. This is the
            step people skip and regret.
          </li>
          <li>
            <strong>Lay landscape fabric.</strong> Overlap the seams by about 6 in so weeds can&apos;t push through.
          </li>
          <li>
            <strong>Spread the gravel.</strong> Shovel and rake it level at the depth you planned, working from one
            end so you don&apos;t walk on the finished surface.
          </li>
          <li>
            <strong>Top up after a few weeks.</strong> The stones settle into the base, so expect to add a little more.
          </li>
        </ol>
      </section>

      <section className="mt-10">
        <h2>Pros and cons</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-[16px]">Pros</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-text-secondary">
              <li>Comfortable and attractive</li>
              <li>Drains freely</li>
              <li>Easy to spread by hand</li>
              <li>Low cost compared with pavers</li>
              <li>Available in several colors</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-[16px]">Cons</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-text-secondary">
              <li>Shifts underfoot and spreads</li>
              <li>Hard to push wheelchairs and wheelbarrows through</li>
              <li>Needs edging and occasional topping up</li>
              <li>Debris and leaves mix in, so it needs raking</li>
              <li>Not suited to slopes or heavy traffic</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2>Ordering tips</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Ask for the size.</strong> Pea gravel is graded by stone size, usually up to about 3/8 in. Confirm
            what the supplier means by the term.
          </li>
          <li>
            <strong>Convert prices.</strong> Quarries quote by the ton or the yard. At {TONS_PER_YD.toFixed(1)} tons per
            cubic yard, a price per ton is {TONS_PER_YD.toFixed(1)} times that per yard. The{" "}
            <Link href="/guides/gravel-cost-per-ton" className="text-primary hover:underline">
              gravel cost guide
            </Link>{" "}
            covers delivery and bulk pricing.
          </li>
          <li>
            <strong>Buy bulk for large areas.</strong> It takes {Math.ceil(CUBIC_FT_PER_CUBIC_YD / CUBIC_FT_PER_BAG)}{" "}
            half-cubic-foot bags to make one cubic yard, so bags are practical only for small areas.
          </li>
          <li>
            <strong>Plan the dump spot.</strong> Pick a hard surface or put down a tarp, and have a wheelbarrow ready
            for the move.
          </li>
        </ul>
      </section>
    </GuideArticle>
  );
}
