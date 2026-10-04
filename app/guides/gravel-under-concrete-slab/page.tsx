import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GuideArticle, DataTable, TableNote } from "@/components/content/GuideArticle";
import { InfoCallout } from "@/components/content/InfoCallout";
import { GRAVEL_TYPES } from "@/lib/calculators/gravel";
import { CUBIC_FT_PER_CUBIC_YD, rawVolume, withWaste } from "@/lib/calculators/volumeModel";
import type { FaqItem } from "@/lib/calculators/types";

const PATH = "/guides/gravel-under-concrete-slab";
const TITLE = "How Much Gravel Under a Concrete Slab? Depth & Tons";
const DESCRIPTION =
  "How deep the gravel base under a concrete slab should be, which stone to use, and how many cubic yards and tons you need for common slab sizes, with a worked example.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: TITLE },
  description: DESCRIPTION,
  article: true,
});

const CRUSHED_LB_PER_YD = GRAVEL_TYPES.find((t) => t.label === "Crushed Stone (#57)")!.lbPerCubicYd;
const SLABS: [string, number, number][] = [
  ["Step landing", 4, 4],
  ["Small shed pad", 10, 10],
  ["Shed or hot tub pad", 12, 12],
  ["Patio", 16, 12],
  ["Large patio or garage bay", 20, 20],
  ["Two-car garage", 24, 24],
];

const yd = (areaSqFt: number, depthIn: number) => rawVolume(areaSqFt, depthIn / 12).cubicYd;
const tons = (cubicYd: number) => (cubicYd * CRUSHED_LB_PER_YD) / 2000;

// Worked example: a 16 × 12 ft patio slab, 4 in of concrete on a 4 in gravel base, 10% waste.
const EX_AREA = 16 * 12;
const EX_GRAVEL_YD = withWaste(yd(EX_AREA, 4), 10);
const EX_GRAVEL_TONS = tons(EX_GRAVEL_YD);
const EX_PRICE = 40;

const FAQS: FaqItem[] = [
  {
    question: "How much gravel do I need under a 10 × 10 concrete slab?",
    answer: `A 10 × 10 ft slab on a 4 in gravel base needs about ${yd(100, 4).toFixed(2)} yd³ of gravel, or ${withWaste(yd(100, 4), 10).toFixed(2)} yd³ with a 10% allowance. That is roughly ${tons(withWaste(yd(100, 4), 10)).toFixed(1)} tons of crushed stone.`,
  },
  {
    question: "Do I need gravel under a concrete slab?",
    answer:
      "In most cases, yes. A compacted gravel base gives the slab even support, lets water drain away, and reduces cracking from soft spots and frost. Many building codes call for at least 4 in of clean aggregate under garage and basement floors unless the soil already drains well. For a small walkway on firm, well-drained ground, some builders use less, so check your local requirements.",
  },
  {
    question: "Can I use pea gravel under a concrete slab?",
    answer:
      "It's not the best choice. Rounded pea gravel doesn't lock together when compacted, so it can shift under the weight of wet concrete. Crushed stone or a crusher-run mix packs into a firm, even layer and is the usual choice.",
  },
  {
    question: "Is the gravel base the same depth as the concrete?",
    answer:
      "Often it is: a 4 in slab on a 4 in base uses the same volume of gravel as concrete. That is a handy way to double-check your numbers, though thicker slabs or poor soil may call for a deeper base.",
  },
  {
    question: "Should I compact the gravel before pouring?",
    answer:
      "Yes. Compact the soil first, then spread the gravel in layers of about 2 to 4 in and compact each one with a plate compactor. An uncompacted base settles after the pour and leaves voids under the slab that lead to cracks.",
  },
];

export default function GravelUnderConcreteSlabPage() {
  const sizeRows = SLABS.map(([label, l, w]) => {
    const area = l * w;
    const y4 = withWaste(yd(area, 4), 10);
    const y6 = withWaste(yd(area, 6), 10);
    return [
      `${label} (${l} × ${w} ft)`,
      `${area} ft²`,
      `${y4.toFixed(2)} yd³`,
      `${tons(y4).toFixed(1)} tons`,
      `${y6.toFixed(2)} yd³`,
      `${tons(y6).toFixed(1)} tons`,
    ];
  });

  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Gravel Under a Concrete Slab"
      intro="Before you order concrete, you need to know how much gravel goes underneath it. The base decides how evenly the slab is supported, how well water drains away, and whether it cracks. This guide covers how deep the base should be, which stone to use, and how many yards and tons you need for common slab sizes."
      related={[
        { href: "/calculators/gravel-calculator", label: "Gravel Calculator" },
        { href: "/calculators/concrete-calculator", label: "Concrete Calculator" },
        { href: "/guides/concrete-slab-thickness", label: "Concrete slab thickness guide" },
        { href: "/guides/gravel-types-and-sizes", label: "Gravel types and sizes explained" },
        { href: "/guides/gravel-coverage-chart", label: "Gravel coverage chart" },
      ]}
      faqs={FAQS}
    >
      <div className="mt-6">
        <InfoCallout>
          <strong>Quick answer:</strong> most slabs sit on 4 in of compacted gravel. That takes about{" "}
          {yd(100, 4).toFixed(2)} yd³ of stone for every 100 ft² of slab before waste, which is roughly{" "}
          {tons(yd(100, 4)).toFixed(1)} tons of crushed stone. A 4 in slab on a 4 in base uses the same volume of
          gravel as concrete.
        </InfoCallout>
      </div>

      <section className="mt-10">
        <h2>Why a slab needs a gravel base</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Concrete is strong in compression but weak when the ground under it moves. A gravel base does three jobs.
          It spreads the load evenly so one soft spot doesn&apos;t become a crack. It lets water drain away from
          the underside of the slab instead of sitting against it. And it breaks the capillary path that draws
          moisture up from the soil, which also helps in freezing climates, where water trapped under a slab expands
          and lifts it.
        </p>
        <p className="mt-4 text-[16px] text-text-secondary">
          Many building codes require at least 4 in of clean aggregate under garage and basement floors unless the
          soil already drains well. Patios and walkways are often held to a lighter standard, but the same logic
          applies: a compacted base costs far less than fixing a cracked or settled slab.
        </p>
      </section>

      <section className="mt-10">
        <h2>How deep should the gravel be?</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Four inches of compacted stone is the standard answer, and it is the number the{" "}
          <Link href="/guides/concrete-slab-thickness" className="text-primary hover:underline">
            slab thickness guide
          </Link>{" "}
          uses. The right depth shifts with the load and the ground.
        </p>
        <DataTable
          headers={["Project", "Typical gravel base", "Notes"]}
          rows={[
            ["Walkway or step landing", "3–4 in", "Light loads; 4 in is easiest to keep consistent"],
            ["Patio or shed pad", "4 in", "Add more on soft or poorly drained soil"],
            ["Garage or basement floor", "4 in minimum", "Often paired with a vapor retarder; follow local code"],
            ["Driveway slab", "4–6 in", "Vehicle loads call for the deeper end"],
            ["Clay, silt, or wet soil", "6–8 in or more", "Consider geotextile fabric under the stone"],
            ["Freezing climates", "Deeper, as local practice requires", "Ask a local contractor or the building department"],
          ]}
          />
        <TableNote>
          These are typical ranges, not code requirements. Local conditions and building rules take priority.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>Gravel needed for common slab sizes</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Volume is area times base depth, converted to cubic yards by dividing by {CUBIC_FT_PER_CUBIC_YD}. The
          table adds 10% for settling and an uneven subgrade, and converts to tons using crushed stone at about{" "}
          {CRUSHED_LB_PER_YD.toLocaleString("en-US")} lb per cubic yard. Use the{" "}
          <Link href="/calculators/gravel-calculator" className="font-semibold text-primary hover:underline">
            Gravel Calculator
          </Link>{" "}
          for other sizes and stone types.
        </p>
        <DataTable
          headers={["Slab", "Area", "4 in base", "Weight", "6 in base", "Weight"]}
          rows={sizeRows}
        />
        <TableNote>Volumes include 10% extra. Weights are for crushed stone; denser mixes weigh more.</TableNote>
      </section>

      <section className="mt-10">
        <h2>Which stone to use</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          The goal is a base that compacts into a hard, uniform layer. Angular crushed stone does that because the
          pieces lock together. Round stone does not.
        </p>
        <DataTable
          headers={["Material", "Good for", "Caution"]}
          rows={[
            ["Crusher run (dense-graded, stone with fines)", "The most common slab base; compacts very firmly", "Drains slowly; fines hold some water"],
            ["Clean crushed stone (such as #57)", "Where drainage matters most, or under footings", "Compacts less tightly, so it may need a thin layer of finer stone on top"],
            ["Sand and gravel mix", "Light-duty patios and walks on stable ground", "Quality varies; confirm it is clean and graded"],
            ["Pea gravel or river rock", "Not recommended", "Rounded stone shifts and doesn't lock together"],
          ]}
        />
        <p className="mt-4 text-[16px] text-text-secondary">
          Stone names vary by region, so describe what you want to your supplier: a three-quarter-inch angular
          crushed stone, with or without fines. The{" "}
          <Link href="/guides/gravel-types-and-sizes" className="text-primary hover:underline">
            gravel types and sizes guide
          </Link>{" "}
          explains the common grades.
        </p>
      </section>

      <section className="mt-10">
        <h2>Worked example: a 16 × 12 ft patio slab</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          A 16 × 12 ft patio is {EX_AREA} ft². With a 4 in slab on a 4 in gravel base, the concrete and the gravel
          take the same raw volume of {yd(EX_AREA, 4).toFixed(2)} yd³ each.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[16px] text-text-secondary">
          <li>
            <strong>Dig depth:</strong> 4 in of base plus 4 in of concrete means excavating about 8 in below the
            finished surface.
          </li>
          <li>
            <strong>Gravel:</strong> {yd(EX_AREA, 4).toFixed(2)} yd³ plus 10% is {EX_GRAVEL_YD.toFixed(2)} yd³,
            or about {EX_GRAVEL_TONS.toFixed(1)} tons of crushed stone.
          </li>
          <li>
            <strong>Cost:</strong> at an example price of ${EX_PRICE} per ton, the stone comes to about $
            {Math.round(EX_GRAVEL_TONS * EX_PRICE)} before delivery.
          </li>
          <li>
            <strong>Concrete:</strong> {withWaste(yd(EX_AREA, 4), 10).toFixed(2)} yd³ with 10% waste. Enter the
            same dimensions in the{" "}
            <Link href="/calculators/concrete-calculator" className="text-primary hover:underline">
              Concrete Calculator
            </Link>{" "}
            to see the order and the cost.
          </li>
        </ol>
      </section>

      <section className="mt-10">
        <h2>Preparing and placing the base</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[16px] text-text-secondary">
          <li>
            <strong>Mark and excavate.</strong> Strip sod, topsoil, and roots down to firm soil, digging to the
            slab thickness plus the base depth. Extend the base a few inches beyond the forms on every side.
          </li>
          <li>
            <strong>Compact the subgrade.</strong> Tamp or use a plate compactor over the bare soil. Dig out and
            replace any soft or organic spots with gravel.
          </li>
          <li>
            <strong>Add the gravel in layers.</strong> Spread about 2 to 4 in at a time and compact each layer, so
            the density is even all the way down. Wet the stone lightly if it is dusty.
          </li>
          <li>
            <strong>Check the grade.</strong> Slope the surface about 1/8 to 1/4 in per foot away from buildings so
            water drains. The base should be flat and uniform, within about half an inch.
          </li>
          <li>
            <strong>Add the vapor retarder if needed.</strong> Slabs inside heated spaces usually get a 6-mil
            polyethylene sheet on top of the stone. Outdoor slabs don&apos;t need it.
          </li>
          <li>
            <strong>Set forms and reinforcement,</strong> then pour. Keep reinforcement lifted into the middle of
            the slab on supports, not lying on the gravel.
          </li>
        </ol>
      </section>

      <section className="mt-10">
        <h2>Common mistakes</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Skipping compaction.</strong> Loose stone settles after the pour, leaving voids that crack the
            slab.
          </li>
          <li>
            <strong>Building on topsoil or fill.</strong> Organic soil keeps compressing for years. Remove it, or
            bridge it with a deeper base.
          </li>
          <li>
            <strong>Using rounded stone.</strong> Pea gravel feels firm underfoot but shifts under a load.
          </li>
          <li>
            <strong>Uneven base depth.</strong> Variations change the slab thickness and send concrete into low
            spots. A level base also keeps your concrete order close to the calculation.
          </li>
          <li>
            <strong>Ignoring drainage.</strong> Without a grade away from the slab, water collects at the edge and
            undermines the base.
          </li>
        </ul>
      </section>
    </GuideArticle>
  );
}
