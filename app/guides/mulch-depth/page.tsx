import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GuideArticle, DataTable, TableNote } from "@/components/content/GuideArticle";
import { InfoCallout } from "@/components/content/InfoCallout";
import { CUBIC_FT_PER_BAG } from "@/lib/calculators/mulch";
import { CUBIC_FT_PER_CUBIC_YD, rawVolume, withWaste } from "@/lib/calculators/volumeModel";
import type { FaqItem } from "@/lib/calculators/types";

const PATH = "/guides/mulch-depth";
const TITLE = "Mulch Depth by Plant Type";
const DESCRIPTION =
  "How deep to mulch flower beds, shrubs, trees, vegetable gardens and paths, how far a bag or cubic yard of mulch goes, which mulch to choose, and mistakes to avoid.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: "Mulch Depth Guide: How Deep to Mulch Beds, Trees & Gardens" },
  description: DESCRIPTION,
  article: true,
});

const WASTE_PERCENT = 10;
const LARGE_BAG_CUBIC_FT = 3;
const COVERAGE_DEPTHS = [1, 2, 3, 4];

const BEDS = [
  { label: "Tree ring, 6 ft across", areaSqFt: Math.PI * 3 ** 2, depthIn: 3 },
  { label: "Raised vegetable bed, 4 × 8 ft", areaSqFt: 4 * 8, depthIn: 2 },
  { label: "Garden bed, 15 × 8 ft", areaSqFt: 15 * 8, depthIn: 3 },
  { label: "Fence border, 50 × 3 ft", areaSqFt: 50 * 3, depthIn: 3 },
  { label: "Large bed, 20 × 10 ft", areaSqFt: 20 * 10, depthIn: 3 },
  { label: "Wood-chip path, 30 × 3 ft", areaSqFt: 30 * 3, depthIn: 4 },
];

const DEPTH_ROWS = [
  ["Flower and perennial beds", "2–3 in", "Keep it an inch or two back from stems and crowns"],
  ["Shrub beds", "2–3 in", "Up to 4 in around large, established shrubs"],
  ["Trees", "2–4 in", "Spread a wide, flat ring and keep it a few inches from the trunk"],
  ["Vegetable gardens", "1–2 in", "Compost or shredded leaves; loose straw can go 3–4 in, since it settles"],
  ["Paths", "3–4 in", "Coarse wood chips or bark hold up best to foot traffic"],
  ["Slopes", "2–3 in", "Shredded bark or pine straw knit together and stay put"],
];

const TYPE_ROWS = [
  ["Shredded hardwood", "Moderately", "Beds, shrubs, slopes", "Mats down over time; fluff it when you top up"],
  ["Pine bark nuggets", "Slowly", "Beds and borders on level ground", "Floats and washes away in heavy rain and on slopes"],
  ["Pine straw", "Quickly", "Slopes and large beds", "Light and interlocking, but needs replacing about yearly"],
  ["Wood chips", "Moderately", "Trees, paths, large beds", "Often free from tree services; sizes vary"],
  ["Compost or leaf mold", "Quickly", "Vegetable gardens, perennials", "Feeds the soil, but weed seeds can sprout in it"],
  ["Straw", "Quickly", "Vegetable gardens", "Use seed-free straw, not hay"],
  ["Gravel or stone", "Doesn't", "Succulents, dry gardens, next to the house", "Holds heat and adds nothing to the soil"],
  ["Rubber mulch", "Doesn't", "Play areas", "Adds nothing to the soil and is hard to remove later"],
];

const FAQS: FaqItem[] = [
  {
    question: "Should I remove old mulch before adding new?",
    answer:
      "Usually not. Old mulch that has broken down is improving the soil. Rake it to break up any matted layer, and remove some only if adding fresh mulch would push the total past 3–4 in.",
  },
  {
    question: "Does mulch attract termites?",
    answer:
      "Mulch doesn't draw termites in from elsewhere, but damp mulch against the house can give them cover. Keep a mulch-free strip along the foundation, and never let mulch pile up against siding or cover the top of the foundation.",
  },
  {
    question: "Can I use grass clippings or leaves as mulch?",
    answer:
      "Yes. Shredded leaves make an excellent free mulch. Grass clippings work in thin layers, an inch or less at a time, so they don't mat and turn slimy. Skip clippings from lawns treated with weed killer.",
  },
  {
    question: "Is stone or wood mulch better?",
    answer:
      "Wood mulch cools the soil, holds moisture, and breaks down into organic matter, so it's better for most plants. Stone lasts for years and won't blow or float away, which suits dry gardens and areas next to the house, but it gets hot in the sun and is hard to remove later.",
  },
];

export default function MulchDepthGuidePage() {
  const coverageRows = COVERAGE_DEPTHS.map((d) => {
    const depthFt = d / 12;
    return [
      `${d} in`,
      `${Math.round(CUBIC_FT_PER_CUBIC_YD / depthFt)} ft²`,
      `${Math.round(CUBIC_FT_PER_BAG / depthFt)} ft²`,
      `${Math.round(LARGE_BAG_CUBIC_FT / depthFt)} ft²`,
    ];
  });
  const bedRows = BEDS.map((bed) => {
    const { cubicFt, cubicYd } = rawVolume(bed.areaSqFt, bed.depthIn / 12);
    return [
      bed.label,
      `${bed.depthIn} in`,
      withWaste(cubicYd, WASTE_PERCENT).toFixed(2),
      String(Math.ceil(withWaste(cubicFt, WASTE_PERCENT) / CUBIC_FT_PER_BAG)),
    ];
  });

  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Mulch Depth"
      intro="The right mulch depth depends on what's planted. Too little mulch does little to suppress weeds or hold moisture; too much can suffocate roots and trap moisture against stems and trunks. Here's how deep to go in each part of the garden, how far a bag or cubic yard goes, and how to choose and apply mulch."
      related={[
        { href: "/calculators/mulch-calculator", label: "Mulch Calculator" },
        { href: "/calculators/topsoil-calculator", label: "Topsoil Calculator" },
        { href: "/calculators/gravel-calculator", label: "Gravel Calculator (for stone mulch)" },
        { href: "/guides/gravel-types-and-sizes", label: "Types of gravel and sizes" },
      ]}
      faqs={FAQS}
    >
      <div className="mt-6">
        <InfoCallout>
          <strong>Quick answer:</strong> spread 2–3 in in flower beds and around shrubs, 2–4 in around trees
          (kept clear of the trunk), 1–2 in in vegetable gardens, and 3–4 in on paths. A cubic yard of mulch
          covers about 108 ft² at 3 in deep, and a 2 ft³ bag covers 8 ft².
        </InfoCallout>
      </div>

      <section className="mt-10">
        <h2>Recommended depth by bed type</h2>
        <DataTable headers={["Where", "Depth", "Notes"]} rows={DEPTH_ROWS} />
      </section>

      <section className="mt-10">
        <h2>Why depth matters</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Under 2 in:</strong> light still reaches weed seeds, and the soil underneath dries out
            quickly.
          </li>
          <li>
            <strong>2–3 in:</strong> enough to block most weed seedlings, hold moisture, and keep the soil
            temperature even. This is the target for most beds.
          </li>
          <li>
            <strong>Over 4 in:</strong> water and air struggle to reach the soil, roots may grow up into the
            mulch instead of down, and wet mulch against bark invites rot and pests.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2>How far mulch goes</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Mulch is sold by the cubic yard in bulk, or in bags, most often 2 ft³ and sometimes 3 ft³. It takes
          13.5 bags of 2 ft³, or 9 bags of 3 ft³, to make one cubic yard.
        </p>
        <DataTable headers={["Depth", "1 cubic yard covers", "2 ft³ bag covers", "3 ft³ bag covers"]} rows={coverageRows} />
        <TableNote>Coverage before waste. Add about 10% for settling and uneven ground.</TableNote>
      </section>

      <section className="mt-10">
        <h2>How much mulch for common beds</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          These figures use the same assumptions as the{" "}
          <Link href="/calculators/mulch-calculator" className="font-semibold text-primary hover:underline">
            Mulch Calculator
          </Link>
          : 10% extra for waste and standard 2 ft³ bags.
        </p>
        <DataTable headers={["Bed", "Depth", "Mulch incl. 10% waste (yd³)", "2 ft³ bags"]} rows={bedRows} />
        <TableNote>
          For a ring around a tree with a bare circle at the trunk, the calculator&apos;s circular ring shape
          subtracts the unmulched center.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>Choosing a mulch</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Organic mulches such as bark, wood chips, straw, and compost break down and improve the soil, which
          is why they need topping up. Inorganic mulches such as stone and rubber last for years but don&apos;t
          feed the soil. Gravel suits succulents and dry gardens, and the{" "}
          <Link href="/calculators/gravel-calculator" className="text-primary hover:underline">
            Gravel Calculator
          </Link>{" "}
          estimates it the same way.
        </p>
        <DataTable headers={["Mulch", "Breaks down", "Best for", "Watch out for"]} rows={TYPE_ROWS} />
      </section>

      <section className="mt-10">
        <h2>How to mulch a bed</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[16px] text-text-secondary">
          <li>
            <strong>Weed first.</strong> Mulch smothers seedlings, but established weeds will push through it.
          </li>
          <li>
            <strong>Edge the bed</strong> so the mulch has a clean boundary and stays put.
          </li>
          <li>
            <strong>Water dry soil</strong> before mulching. Mulch holds in moisture that&apos;s already there,
            and a thick layer can stop light rain from reaching dry ground.
          </li>
          <li>
            <strong>Check what&apos;s already there.</strong> Dig in with a trowel and measure. Old mulch counts
            toward the total, so top up only to the target depth, and rake matted mulch to loosen it first.
          </li>
          <li>
            <strong>Spread evenly, then pull it back</strong> from stems and trunks. Around a tree, you want a
            flat ring like a donut, never a mound piled up against the bark.
          </li>
          <li>
            <strong>Time it well.</strong> Mid to late spring, once the soil has warmed, is the classic time.
            Mulching in fall helps protect roots through the winter.
          </li>
        </ol>
      </section>

      <section className="mt-10">
        <h2>Mistakes to avoid</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Volcano mulching.</strong> Mulch heaped against a trunk keeps the bark wet, invites rot,
            insects, and rodents, and can encourage roots to circle the trunk.
          </li>
          <li>
            <strong>Piling on a new layer every year.</strong> Adding 3 in annually on top of old mulch soon
            builds a layer 6 in or more deep. Top up to the target depth instead.
          </li>
          <li>
            <strong>Fabric under organic mulch.</strong> The mulch breaks down into soil on top of the fabric,
            weeds root in it anyway, and the fabric keeps that organic matter from reaching the soil below.
          </li>
          <li>
            <strong>Digging fresh wood chips into the soil.</strong> Mixed in, they tie up nitrogen while they
            decompose. Left on the surface, the effect is limited to a thin layer, so leave them on top.
          </li>
          <li>
            <strong>Mulching cold, wet soil too early.</strong> Mulch insulates, so soil covered in early
            spring stays cold longer.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2>Refreshing mulch over time</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Organic mulch breaks down and typically needs topping off annually, with a full fresh layer every 2–3
          years. If you&apos;re building new beds, see the{" "}
          <Link href="/calculators/topsoil-calculator" className="text-primary hover:underline">
            Topsoil Calculator
          </Link>{" "}
          first to estimate soil for the bed itself.
        </p>
      </section>
    </GuideArticle>
  );
}
