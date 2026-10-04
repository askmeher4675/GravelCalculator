import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GuideArticle, DataTable, TableNote } from "@/components/content/GuideArticle";
import { InfoCallout } from "@/components/content/InfoCallout";
import { CUBIC_FT_PER_80LB_BAG } from "@/lib/calculators/concrete";
import { CUBIC_FT_PER_CUBIC_YD, rawVolume, withWaste } from "@/lib/calculators/volumeModel";
import type { FaqItem } from "@/lib/calculators/types";

const PATH = "/guides/concrete-walkway-path";
const TITLE = "How Much Concrete for a Walkway or Path? Sizes & Yards";
const DESCRIPTION =
  "Cubic yards and 80 lb bags of concrete for walkways and paths by length, width and thickness, plus joints, base, slope and a worked example.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: TITLE },
  description: DESCRIPTION,
  article: true,
});

const LENGTHS = [10, 20, 30, 50, 100];
const WIDTHS = [3, 4, 5];

const walkYd = (length: number, width: number, thicknessIn: number) =>
  withWaste(rawVolume(length * width, thicknessIn / 12).cubicYd, 10);
const walkBags = (length: number, width: number, thicknessIn: number) =>
  Math.ceil(withWaste(rawVolume(length * width, thicknessIn / 12).cubicFt, 10) / CUBIC_FT_PER_80LB_BAG);

// Worked example: a 30 ft path, 4 ft wide, 4 in thick, on a 4 in gravel base, 10% waste.
const EX_L = 30;
const EX_W = 4;
const EX_AREA = EX_L * EX_W;
const EX_CONCRETE_YD = walkYd(EX_L, EX_W, 4);
const EX_BAGS = walkBags(EX_L, EX_W, 4);
const EX_GRAVEL_YD = withWaste(rawVolume(EX_AREA, 4 / 12).cubicYd, 10);
const EX_PRICE = 150;

const FAQS: FaqItem[] = [
  {
    question: "How much concrete do I need for a 4 ft wide walkway?",
    answer: `Every 10 ft of a 4 ft wide walkway at 4 in thick needs about ${walkYd(10, 4, 4).toFixed(2)} yd³ with 10% waste. A 30 ft walkway needs ${walkYd(30, 4, 4).toFixed(2)} yd³, or about ${walkBags(30, 4, 4)} bags of 80 lb mix.`,
  },
  {
    question: "How thick should a concrete walkway be?",
    answer:
      "Four inches is the standard for foot traffic. Use 5 to 6 in where a vehicle may cross, such as a path that meets a driveway apron, and add a gravel base under any thickness.",
  },
  {
    question: "How wide should a concrete path be?",
    answer:
      "At least 36 in for one person, which is also the usual minimum for accessible routes. Four feet is more comfortable and lets two people pass, and 5 ft allows people to walk side by side.",
  },
  {
    question: "How far apart should the control joints be?",
    answer:
      "Keep panels roughly square, so joints about every 4 to 5 ft on a walkway that wide, and never more than about 10 to 12 ft apart for a 4 in slab. Cut them to about one-quarter of the slab depth, and add an isolation joint where the path meets a house, step, or driveway.",
  },
  {
    question: "Is it cheaper to use bags or ready-mix for a path?",
    answer:
      "For a short path under about a cubic yard, bags are simpler, though a 30 ft path already takes dozens. Beyond that, ready-mix delivery is easier and usually costs less than the same volume in bags. Check the supplier's minimum order and short-load fee first.",
  },
];

export default function ConcreteWalkwayPathPage() {
  const sizeRows = LENGTHS.map((l) => [
    `${l} ft long`,
    ...WIDTHS.map((w) => `${walkYd(l, w, 4).toFixed(2)} yd³ (${walkBags(l, w, 4)} bags)`),
  ]);
  const thicknessRows = [3, 4, 5, 6].map((t) => [
    `${t} in`,
    `${walkYd(30, 4, t).toFixed(2)} yd³`,
    String(walkBags(30, 4, t)),
  ]);

  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Concrete Walkway or Path"
      intro="A concrete walkway is a thin, long slab, so the volume is small per foot but adds up fast over a long path. This guide gives the concrete you need by length, width and thickness, how wide and thick a path should be, where the joints go, and what to put under it."
      related={[
        { href: "/calculators/concrete-calculator", label: "Concrete Calculator" },
        { href: "/guides/concrete-slab-thickness", label: "Concrete slab thickness guide" },
        { href: "/guides/gravel-under-concrete-slab", label: "How much gravel under a concrete slab" },
        { href: "/calculators/gravel-calculator", label: "Gravel Calculator (for the base)" },
        { href: "/calculators/paver-calculator", label: "Paver Calculator (a paver path instead)" },
      ]}
      faqs={FAQS}
    >
      <div className="mt-6">
        <InfoCallout>
          <strong>Quick answer:</strong> a 4 ft wide, 4 in thick walkway takes about {walkYd(10, 4, 4).toFixed(2)} yd³
          of concrete per 10 ft of length, including 10% extra. A 30 ft path takes {walkYd(30, 4, 4).toFixed(2)} yd³,
          which is about {walkBags(30, 4, 4)} bags of 80 lb mix.
        </InfoCallout>
      </div>

      <section className="mt-10">
        <h2>Concrete for common walkway sizes</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Volume is length × width × thickness. The table uses a 4 in slab, adds 10% for uneven forms and spillage, and
          shows the equivalent in 80 lb bags (about {CUBIC_FT_PER_80LB_BAG} ft³ each, so {Math.ceil(CUBIC_FT_PER_CUBIC_YD / CUBIC_FT_PER_80LB_BAG)} per
          cubic yard).
        </p>
        <DataTable headers={["Length", "3 ft wide", "4 ft wide", "5 ft wide"]} rows={sizeRows} />
        <TableNote>
          Volumes include 10% waste. Orders for ready-mix are usually rounded up to the nearest quarter yard.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>How thickness changes the amount</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Every extra inch of thickness adds a quarter of the volume of a 4 in slab. The table shows a 30 ft × 4 ft
          path at each thickness.
        </p>
        <DataTable headers={["Thickness", "Concrete (with 10% waste)", "80 lb bags"]} rows={thicknessRows} />
        <p className="mt-4 text-[16px] text-text-secondary">
          Four inches is standard for foot traffic. Use 5 to 6 in where a car or heavy cart might cross, such as where
          the path meets a driveway.
        </p>
      </section>

      <section className="mt-10">
        <h2>How wide should a walkway be?</h2>
        <DataTable
          headers={["Width", "Use"]}
          rows={[
            ["3 ft (36 in)", "Minimum comfortable width for one person and the usual accessibility minimum"],
            ["4 ft", "A good general-purpose width; two people can pass"],
            ["5 ft", "Two people walk side by side; good for a main entry path"],
            ["6 ft or more", "Wide entry walks and paths shared with equipment"],
          ]}
        />
        <p className="mt-4 text-[16px] text-text-secondary">
          Wider is more comfortable but costs proportionally more, so decide the width before you order.
        </p>
      </section>

      <section className="mt-10">
        <h2>Worked example: a 30 ft path, 4 ft wide</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[16px] text-text-secondary">
          <li>
            <strong>Area:</strong> {EX_L} × {EX_W} = {EX_AREA} ft².
          </li>
          <li>
            <strong>Concrete:</strong> {EX_AREA} × (4 ÷ 12) = {(EX_AREA / 3).toFixed(1)} ft³, or{" "}
            {rawVolume(EX_AREA, 4 / 12).cubicYd.toFixed(2)} yd³. With 10% waste that is {EX_CONCRETE_YD.toFixed(2)} yd³,
            or {EX_BAGS} bags of 80 lb mix.
          </li>
          <li>
            <strong>Cost:</strong> at an example price of ${EX_PRICE} per cubic yard, the concrete is about $
            {Math.round(EX_CONCRETE_YD * EX_PRICE)} before delivery fees.
          </li>
          <li>
            <strong>Gravel base:</strong> a 4 in base takes the same raw volume, so about {EX_GRAVEL_YD.toFixed(2)} yd³
            with 10% waste. Use the{" "}
            <Link href="/calculators/gravel-calculator" className="text-primary hover:underline">
              Gravel Calculator
            </Link>{" "}
            for tons and cost.
          </li>
        </ol>
        <p className="mt-4 text-[16px] text-text-secondary">
          Enter the same numbers in the{" "}
          <Link href="/calculators/concrete-calculator" className="font-semibold text-primary hover:underline">
            Concrete Calculator
          </Link>{" "}
          with your supplier&apos;s price per yard to get the cost directly. For a curved path, choose the circular
          ring or trapezoid shape, or split the path into straight sections and add them.
        </p>
      </section>

      <section className="mt-10">
        <h2>Base, forms, and slope</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Gravel base.</strong> Put 3 to 4 in of compacted gravel under the path for drainage and even
            support. See{" "}
            <Link href="/guides/gravel-under-concrete-slab" className="text-primary hover:underline">
              how much gravel goes under a slab
            </Link>
            .
          </li>
          <li>
            <strong>Forms.</strong> Use 2×4s on edge for a 4 in slab, staked every 2 to 3 ft and set level. For curves,
            use flexible forms or thin hardboard.
          </li>
          <li>
            <strong>Slope.</strong> Pitch the path about 1/4 in per foot across its width so water runs off the side.
            On a 4 ft wide path, that is a 1 in drop from one edge to the other.
          </li>
          <li>
            <strong>Reinforcement.</strong> A walkway on firm ground often needs only the joints. Wire mesh or rebar
            holds cracks tight where soil is soft or the path crosses a tree root zone.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2>Joints and finishing</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Control joints.</strong> Cut or tool them about every 4 to 5 ft on a path that width, keeping the
            panels close to square, and to about one-quarter of the slab depth.
          </li>
          <li>
            <strong>Isolation joints.</strong> Place a strip of expansion material where the path meets a house wall,
            steps, or a driveway, so each can move on its own.
          </li>
          <li>
            <strong>Finish.</strong> Screed level, float, edge the sides, and finish with a broom for traction. A
            smooth trowel finish gets slippery when wet.
          </li>
          <li>
            <strong>Curing.</strong> Keep the surface damp or covered for about seven days, and avoid pouring in
            freezing or very hot weather without precautions.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2>Bags or ready-mix?</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          A 10 ft path takes {walkBags(10, 4, 4)} bags and a 30 ft path takes {EX_BAGS}, which is a lot of mixing, and
          every batch needs to be placed and finished before the first one sets. Under about a cubic yard, bags can
          work for a short path. Beyond that, ready-mix delivered by truck is usually easier and cheaper once you count
          your time. Ask the supplier about their minimum load and short-load fee, and have forms, wheelbarrows, and
          helpers ready before the truck arrives.
        </p>
      </section>
    </GuideArticle>
  );
}
