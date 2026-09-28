import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GuideArticle, DataTable, TableNote } from "@/components/content/GuideArticle";
import { InfoCallout } from "@/components/content/InfoCallout";
import { LayerDiagram } from "@/components/content/LayerDiagram";
import { LBS_PER_CUBIC_YD_AGGREGATE } from "@/lib/calculators/driveway";
import { rawVolume, withWaste } from "@/lib/calculators/volumeModel";
import type { FaqItem } from "@/lib/calculators/types";

const PATH = "/guides/gravel-driveway";
const TITLE = "How Much Gravel for a Driveway";
const DESCRIPTION =
  "How deep a gravel driveway should be, how the base and surface layers work, how many tons common driveway sizes need, and how to build one step by step.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: "How Much Gravel for a Driveway? Depth, Layers & Tons" },
  description: DESCRIPTION,
  article: true,
});

// The standard two-layer build used throughout this guide (matches the Driveway Calculator's placeholders).
const BASE_IN = 4;
const SURFACE_IN = 2;
const WASTE_PERCENT = 10;

// [width, length] in feet.
const SIZES: [number, number][] = [
  [10, 20],
  [12, 50],
  [12, 100],
  [20, 20],
  [20, 40],
  [12, 200],
];

const DEPTH_ROWS = [
  ["Walkway or garden path", "2–3 in", "One layer of pea gravel, #8 chips, or decomposed granite over compacted soil"],
  ["Car driveway on firm soil", "4–6 in", "4 in compacted base + 2 in surface layer"],
  ["Car driveway on clay or wet soil", "8–12 in", "6–10 in base over woven geotextile + 2 in surface layer"],
  ["RVs, trucks, or equipment", "8–12 in or more", "Thicker base in compacted lifts over fabric + 2–3 in surface layer"],
];

const FAQS: FaqItem[] = [
  {
    question: "Can I put gravel directly on dirt?",
    answer:
      "On firm, well-drained ground, yes, but remove the sod and topsoil first and compact the soil underneath. Gravel spread over grass or topsoil sinks as the organic material breaks down. On clay or wet soil, add woven geotextile fabric between the soil and the stone.",
  },
  {
    question: "How many tons of gravel do I need for a 100 ft driveway?",
    answer:
      "For a driveway 12 ft wide and 100 ft long with a 4 in base and a 2 in surface layer, about 24.4 yd³ including 10% waste, or roughly 34 tons. A 10 ft wide driveway of the same length needs about 20.4 yd³, or roughly 28.5 tons.",
  },
  {
    question: "Do I need landscape fabric under a gravel driveway?",
    answer:
      "Not always. On firm, sandy, or gravelly soil, a well-compacted base works without it. On clay, silt, or ground that stays wet, woven geotextile is worth the cost because it keeps the base stone from being pushed into the soil. Use woven (stabilization) fabric under driveways; non-woven fabric is meant for drainage and filtration.",
  },
  {
    question: "How long does a gravel driveway last?",
    answer:
      "With a solid base and good drainage, the driveway itself can last for decades. What wears out is the surface: expect to fill potholes and regrade from time to time, and to add a fresh top layer every 2–4 years.",
  },
  {
    question: "What's the cheapest way to build a gravel driveway?",
    answer:
      "Use crusher run or recycled crushed concrete for the base, since they're usually among the cheapest aggregates, and order full truckloads so you don't pay for extra deliveries. Don't save money by skipping excavation, compaction, or drainage: rebuilding a failed driveway costs more than building it right.",
  },
];

export default function GravelDrivewayGuidePage() {
  const sizeRows = SIZES.map(([width, length]) => {
    const area = width * length;
    const needed = rawVolume(area, (BASE_IN + SURFACE_IN) / 12).cubicYd;
    const withExtra = withWaste(needed, WASTE_PERCENT);
    const tons = (withExtra * LBS_PER_CUBIC_YD_AGGREGATE) / 2000;
    return [
      `${width} × ${length} ft`,
      `${area.toLocaleString("en-US")} ft²`,
      needed.toFixed(1),
      withExtra.toFixed(1),
      tons.toFixed(1),
    ];
  });

  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Gravel Driveway"
      intro="Gravel driveways are built in layers: a compacted base that carries the weight, and a finer surface layer that you drive on. How much gravel you need depends on the driveway's size, the depth of each layer, and how firm the ground underneath is. This guide covers all three, with tonnage for common driveway sizes and a step-by-step build."
      related={[
        { href: "/calculators/driveway-calculator", label: "Driveway Calculator" },
        { href: "/calculators/gravel-calculator", label: "Gravel Calculator" },
        { href: "/guides/gravel-types-and-sizes", label: "Types of gravel and sizes" },
        { href: "/guides/gravel-cost-per-ton", label: "How much does gravel cost?" },
        { href: "/guides/gravel-coverage-chart", label: "Gravel coverage chart" },
      ]}
      faqs={FAQS}
    >
      <div className="mt-6">
        <InfoCallout>
          <strong>Quick answer:</strong> a typical single-lane driveway, 12 ft wide and 50 ft long with a 4 in
          base and a 2 in surface layer, needs about 11.1 yd³ of gravel. With 10% extra for compaction and
          spillage, order about 12.2 yd³, or roughly 17 tons.
        </InfoCallout>
      </div>

      <section className="mt-10">
        <h2>How deep should a gravel driveway be?</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Depth comes down to two things: what drives on the driveway, and what&apos;s underneath it. Firm,
          well-drained soil, such as sandy or gravelly ground, supports a thinner build. Clay, silt, or ground
          that stays wet needs a thicker base, and usually a layer of geotextile fabric, because soft soil lets
          the stone sink and mix with mud.
        </p>
        <DataTable headers={["Use", "Total depth", "Typical build"]} rows={DEPTH_ROWS} />
        <TableNote>
          Depths are after compaction. Loose gravel settles when it&apos;s compacted and driven on, which is
          one reason to order about 10% more than the calculated volume.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>How the layers work</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Each layer does a different job, so each uses a different stone. A standard two-layer driveway looks
          like this in cross-section:
        </p>
        <LayerDiagram
          layers={[
            {
              name: "Surface layer",
              depth: "2–3 in",
              detail: "Crusher run, #411, or 3/4 in minus, whose fines pack into a firm, smooth surface. Clean #57 drains faster but stays looser.",
              tone: "fine",
              inches: 2.5,
            },
            {
              name: "Base layer",
              depth: "4–6 in",
              detail: "Large angular stone such as #3 or #4, or crusher run, compacted in lifts. Use 6–10 in on soft soil.",
              tone: "coarse",
              inches: 5,
            },
            {
              name: "Geotextile fabric",
              depth: "Optional",
              detail: "Woven fabric that stops the base from being pushed into clay or wet soil.",
              tone: "membrane",
            },
            {
              name: "Subgrade",
              depth: "Compacted",
              detail: "Native soil with sod and topsoil removed, shaped so water runs off.",
              tone: "soil",
            },
          ]}
          caption="Cross-section of a two-layer gravel driveway. Depths are after compaction."
        />
        <ul className="mt-6 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Subgrade.</strong> This is the native soil after you strip the sod and topsoil. Organic
            soil compresses and holds water, so it has to go. The subgrade is shaped and compacted before any
            stone goes down, because the finished surface can only be as even as what&apos;s under it.
          </li>
          <li>
            <strong>Geotextile fabric.</strong> Woven stabilization fabric separates the stone from the soil.
            On firm, sandy ground you can skip it. On clay or wet ground it&apos;s one of the cheapest ways to
            make a driveway last, because it stops the base from being pushed down into the mud a little more
            every year.
          </li>
          <li>
            <strong>Base layer.</strong> Large, angular crushed stone (or crusher run) locks together when
            compacted and spreads each wheel load over a wider area of soil. This is where most of your tonnage
            goes.
          </li>
          <li>
            <strong>Surface layer.</strong> Smaller stone fills the top and gives you something smooth to drive
            on. Material with fines, such as crusher run or #411 (#57 stone mixed with stone dust), compacts
            into a hard crust. Clean #57 drains faster but stays loose and can rut.
          </li>
        </ul>
        <p className="mt-4 text-[16px] text-text-secondary">
          For new driveways on soft ground, many builders use three layers instead of two: about 4 in of #3
          stone at the bottom, 4 in of #57 in the middle, and a 2–3 in top layer of crusher run or #411. To
          estimate a three-layer build in the Driveway Calculator, enter the two lower layers together as the
          base depth, or run each layer through the Gravel Calculator if you&apos;ll order them separately.
        </p>
      </section>

      <section className="mt-10">
        <h2>How much gravel for common driveway sizes</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          This table uses a standard 6 in build (a 4 in base plus a 2 in surface layer) and the same
          assumptions as the{" "}
          <Link href="/calculators/driveway-calculator" className="font-semibold text-primary hover:underline">
            Driveway Calculator
          </Link>
          : compacted driveway stone at about 2,800 lb per cubic yard (1.4 tons), plus 10% extra for waste.
        </p>
        <DataTable
          headers={["Driveway", "Area", "Needed (yd³)", "With 10% waste (yd³)", "Weight (tons)"]}
          rows={sizeRows}
        />
        <TableNote>
          For an 8 in build, multiply by 1.33; for a 12 in build on soft soil, double the figures. For a
          tapered, curved, or circular driveway, use the calculator&apos;s trapezoid, circle, or ring shapes.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>How to calculate it yourself</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          The math is the same for any driveway. Here it is for a driveway 12 ft wide and 50 ft long:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[16px] text-text-secondary">
          <li>Multiply length by width to get the area: 50 × 12 = 600 ft².</li>
          <li>Convert each layer&apos;s depth to feet by dividing by 12: 4 in = 0.333 ft and 2 in = 0.167 ft.</li>
          <li>Multiply the area by each depth: 200 ft³ for the base and 100 ft³ for the surface.</li>
          <li>Add the layers and divide by 27 to get cubic yards: 300 ft³ ÷ 27 = 11.1 yd³.</li>
          <li>Add 10% for compaction, spillage, and dips in the subgrade: 11.1 × 1.1 = 12.2 yd³.</li>
          <li>If your supplier sells by the ton, multiply by the stone&apos;s weight per yard: 12.2 × 1.4 ≈ 17.1 tons.</li>
        </ol>
        <div className="mt-4">
          <InfoCallout>
            For a single layer of gravel, use the{" "}
            <Link href="/calculators/gravel-calculator" className="font-semibold text-primary hover:underline">
              Gravel Calculator
            </Link>
            . For a driveway with a separate base and surface layer, use the{" "}
            <Link href="/calculators/driveway-calculator" className="font-semibold text-primary hover:underline">
              Driveway Calculator
            </Link>
            , which totals both layers and shows each one in the breakdown.
          </InfoCallout>
        </div>
      </section>

      <section className="mt-10">
        <h2>Building a gravel driveway, step by step</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[16px] text-text-secondary">
          <li>
            <strong>Check for utilities and permits.</strong> In the US, call 811 a few days before you dig so
            buried lines are marked. Ask your town whether you need a permit, especially for the apron where
            the driveway meets the road or if it crosses a ditch.
          </li>
          <li>
            <strong>Mark the layout.</strong> Stake both edges and run string lines. Plan on 10–12 ft of width
            for a single lane and 20–24 ft for two cars side by side, and make curves generous: vehicles cut
            corners and will push gravel off a tight bend.
          </li>
          <li>
            <strong>Strip and excavate.</strong> Remove sod, topsoil, and roots down to firm subsoil, typically
            6–8 in for a standard build and more for a thicker one. Aim for a finished surface level with or
            slightly above the surrounding ground, so water drains away from the driveway rather than into it.
          </li>
          <li>
            <strong>Shape and compact the subgrade.</strong> Grade it with a crown, higher in the center than
            at the edges, or with a steady cross-slope on a hillside. Gravel road manuals recommend about 1/2
            in of fall per foot of width (roughly 4%). Compact it with a plate compactor or roller, and dig out
            any soft spots and refill them with stone.
          </li>
          <li>
            <strong>Lay fabric if you need it.</strong> On clay or wet soil, roll woven geotextile over the
            whole subgrade, overlapping the seams by a foot or more.
          </li>
          <li>
            <strong>Spread and compact the base.</strong> Place base stone in lifts of no more than about 4 in,
            compacting each one before adding the next. A thick layer compacted all at once stays loose at
            the bottom.
          </li>
          <li>
            <strong>Add the surface layer.</strong> Spread 2–3 in of surface stone, keep the crown, and compact
            it. A light spray of water helps crusher run and #411 bind into a hard surface.
          </li>
          <li>
            <strong>Finish the edges and drainage.</strong> Edging made of steel, timber, or stone keeps gravel
            out of the lawn. Where the driveway crosses a ditch or a natural drainage path, a culvert carries
            the water under it instead of across it.
          </li>
        </ol>
      </section>

      <section className="mt-10">
        <h2>Resurfacing an existing driveway</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          If the base is still sound, with no deep ruts or soft spots that pump up mud, you only need a new
          surface layer. Fill potholes with base stone and compact them first, so the new layer isn&apos;t just
          filling holes, then spread 1–2 in of surface gravel over the whole driveway. A 12 × 50 ft driveway at
          2 in takes about 4.1 yd³ including waste, or 5–6 tons depending on the stone.
        </p>
        <p className="mt-4 text-[16px] text-text-secondary">
          Most gravel driveways need a fresh top layer every 2–4 years, depending on traffic, snow plowing,
          and how much rain runs across them. Regrading once a year to restore the crown makes each top-up
          last longer.
        </p>
      </section>

      <section className="mt-10">
        <h2>Common mistakes</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Building on topsoil or sod.</strong> Organic material compresses and rots, and the gravel
            sinks with it.
          </li>
          <li>
            <strong>Skipping compaction.</strong> Loose stone shifts and settles unevenly under the first heavy
            loads, leaving ruts.
          </li>
          <li>
            <strong>Using rounded stone.</strong> Pea gravel and river rock roll against each other instead of
            locking together. They make a poor driving surface and a worse base.
          </li>
          <li>
            <strong>Ignoring drainage.</strong> Water is the main cause of potholes: it softens the base, and
            traffic does the rest. A crown and a clear path for runoff prevent most of them.
          </li>
          <li>
            <strong>Ordering the exact calculated volume.</strong> Compaction, spreading losses, and dips in the
            subgrade use up more stone than you&apos;d expect. Add 10%, or 15% on soft or uneven ground.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2>Choosing a gravel type</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Angular crushed stone is the standard for both layers because its fractured faces lock together.
          Pea gravel looks good but rolls underfoot and under tires, so save it for paths. See{" "}
          <Link href="/guides/gravel-types-and-sizes" className="text-primary hover:underline">
            types of gravel and sizes
          </Link>{" "}
          for a full comparison, and{" "}
          <Link href="/guides/gravel-cost-per-ton" className="text-primary hover:underline">
            how much gravel costs
          </Link>{" "}
          to budget the job.
        </p>
      </section>
    </GuideArticle>
  );
}
