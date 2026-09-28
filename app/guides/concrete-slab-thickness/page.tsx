import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GuideArticle, DataTable, TableNote } from "@/components/content/GuideArticle";
import { InfoCallout } from "@/components/content/InfoCallout";
import { LayerDiagram } from "@/components/content/LayerDiagram";
import { CUBIC_FT_PER_80LB_BAG, ORDER_INCREMENT_YD } from "@/lib/calculators/concrete";
import { CUBIC_FT_PER_CUBIC_YD, rawVolume, roundUpToIncrement, withWaste } from "@/lib/calculators/volumeModel";
import type { FaqItem } from "@/lib/calculators/types";

const PATH = "/guides/concrete-slab-thickness";
const TITLE = "Concrete Slab Thickness Guide";
const DESCRIPTION =
  "How thick a concrete slab should be for patios, walkways, driveways, garages and sheds, plus the base, reinforcement, control joints, and how much concrete to order.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: "Concrete Slab Thickness: Patios, Driveways, Garages & Sheds" },
  description: DESCRIPTION,
  article: true,
});

const WASTE_PERCENT = 10;
const CUBIC_FT_PER_LB_OF_MIX = CUBIC_FT_PER_80LB_BAG / 80; // bagged mix yields in proportion to weight
const BAG_SIZES_LB = [40, 60, 80];
const JOINT_THICKNESSES_IN = [4, 5, 6];

const SLABS = [
  { label: "4 × 4 ft pad", width: 4, length: 4, thicknessIn: 4 },
  { label: "10 × 10 ft patio", width: 10, length: 10, thicknessIn: 4 },
  { label: "12 × 16 ft shed floor", width: 12, length: 16, thicknessIn: 4 },
  { label: "20 × 20 ft garage", width: 20, length: 20, thicknessIn: 4 },
  { label: "12 × 40 ft driveway", width: 12, length: 40, thicknessIn: 5 },
  { label: "24 × 24 ft garage", width: 24, length: 24, thicknessIn: 5 },
];

const THICKNESS_ROWS = [
  ["Walkway, patio, shed floor", "4 in", "Optional: wire mesh or fibers"],
  ["Garage floor", "4–5 in", "Wire mesh or rebar"],
  ["Driveway (cars)", "5–6 in", "Rebar or wire mesh"],
  ["Driveway or pad for RVs and trucks", "6–8 in", "Rebar, with thickened edges"],
  ["Footings", "Set by local code", "Rebar as the code requires"],
];

const FAQS: FaqItem[] = [
  {
    question: "Is 4 inches of concrete enough for a driveway?",
    answer:
      "It can work for passenger cars on firm, well-compacted soil, but 5–6 in is the safer choice. The extra inch adds about 25% more concrete and makes the slab much stronger, which matters when a delivery truck, heavy pickup, or RV uses the driveway.",
  },
  {
    question: "How thick should a shed slab be?",
    answer:
      "4 in is standard for most garden sheds, on a 4 in compacted gravel base. Larger or heavier buildings, such as a workshop with vehicles or machinery, may need 5–6 in and thickened edges. Check local rules, since some areas require footings for bigger sheds.",
  },
  {
    question: "Do I need a vapor barrier under a patio or driveway?",
    answer:
      "No. Vapor retarders go under slabs inside homes and heated spaces, where moisture rising through the concrete could damage flooring. Driveways, patios, and walkways don't need one.",
  },
  {
    question: "What strength concrete should I order?",
    answer:
      "For driveways and patios in areas with freezing winters, ask for air-entrained concrete of around 3,500–4,000 psi. In mild climates, 3,000 psi is common for patios and walkways. Garage floors often have specific code requirements, so check locally.",
  },
];

export default function ConcreteSlabThicknessGuidePage() {
  const slabRows = SLABS.map((s) => {
    const { cubicFt, cubicYd } = rawVolume(s.width * s.length, s.thicknessIn / 12);
    const withExtraYd = withWaste(cubicYd, WASTE_PERCENT);
    const bags = Math.ceil(withWaste(cubicFt, WASTE_PERCENT) / CUBIC_FT_PER_80LB_BAG);
    return [
      s.label,
      `${s.thicknessIn} in`,
      withExtraYd.toFixed(2),
      roundUpToIncrement(withExtraYd, ORDER_INCREMENT_YD).toFixed(2),
      bags.toLocaleString("en-US"),
    ];
  });
  const bagRows = BAG_SIZES_LB.map((lb) => {
    const yieldCubicFt = lb * CUBIC_FT_PER_LB_OF_MIX;
    return [`${lb} lb`, `${yieldCubicFt.toFixed(2)} ft³`, String(Math.round(CUBIC_FT_PER_CUBIC_YD / yieldCubicFt))];
  });
  const jointRows = JOINT_THICKNESSES_IN.map((t) => [`${t} in`, `${t * 2}–${t * 3} ft`]);

  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Concrete Slab Thickness"
      intro="Slab thickness depends on what will sit or drive on it. A thicker slab costs more, but it carries more load before it cracks. Thickness is only part of the story, though: many slab failures trace back to a poor base, missing control joints, or too much water in the mix. This guide covers all of them, plus how much concrete to order."
      related={[
        { href: "/calculators/concrete-calculator", label: "Concrete Calculator" },
        { href: "/calculators/gravel-calculator", label: "Gravel Calculator (for the base)" },
        { href: "/guides/gravel-types-and-sizes", label: "Types of gravel and sizes" },
        { href: "/guides/gravel-driveway", label: "How much gravel for a driveway" },
      ]}
      faqs={FAQS}
    >
      <div className="mt-6">
        <InfoCallout>
          <strong>Quick answer:</strong> pour 4 in for patios, walkways, and shed floors, and 5–6 in for
          driveways. Garage floors are usually 4–5 in, and slabs that carry RVs or trucks need 6 in or more with
          rebar. Every slab needs a firm, compacted base, typically 4 in of gravel.
        </InfoCallout>
      </div>

      <section className="mt-10">
        <h2>Recommended thickness by use</h2>
        <DataTable headers={["Use", "Thickness", "Reinforcement"]} rows={THICKNESS_ROWS} />
        <p className="mt-4 text-[16px] text-text-secondary">
          Footings are different: their size depends on the load, the soil, and the local frost depth, so
          they&apos;re set by your building code. Check with your building department rather than using a
          flat rule. For floors inside homes, the International Residential Code (IRC) sets a minimum of 3.5 in
          for slabs on the ground, but most contractors pour 4 in to leave room for small variations in the
          base.
        </p>
      </section>

      <section className="mt-10">
        <h2>Why an extra inch matters</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          A slab&apos;s strength doesn&apos;t grow in a straight line with its thickness. Its resistance to
          bending grows with the square of the thickness, and its stiffness with the cube. Going from 4 in to 5
          in uses 25% more concrete but makes the slab more than 50% stronger in bending and nearly twice as
          stiff. That&apos;s why a heavier-use slab needs only an inch or two more, not double the concrete.
        </p>
        <p className="mt-4 text-[16px] text-text-secondary">
          It also means thin spots matter. A slab that&apos;s 4 in thick on paper can be 3 in over a high
          point in the base, and that&apos;s where it will crack first. Check the base with a string line and
          a tape measure before you pour.
        </p>
      </section>

      <section className="mt-10">
        <h2>What goes under the slab</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          A slab is only as good as what&apos;s under it. A typical slab on the ground is built like this:
        </p>
        <LayerDiagram
          layers={[
            {
              name: "Concrete slab",
              depth: "4–6 in",
              detail: "Rebar or wire mesh sits near mid-depth on supports, never flat on the ground.",
              tone: "concrete",
              inches: 5,
            },
            {
              name: "Vapor retarder",
              depth: "6-mil poly",
              detail: "Needed under slabs inside homes and heated spaces; skip it for driveways and patios.",
              tone: "membrane",
            },
            {
              name: "Gravel base",
              depth: "4 in",
              detail: "Compacted crushed stone or clean granular fill for firm, even support and drainage.",
              tone: "coarse",
              inches: 4,
            },
            {
              name: "Subgrade",
              depth: "Compacted",
              detail: "Native soil with topsoil, roots, and soft spots removed.",
              tone: "soil",
            },
          ]}
          caption="Typical slab-on-ground cross-section."
        />
        <p className="mt-6 text-[16px] text-text-secondary">
          The IRC calls for at least 4 in of clean sand, gravel, or crushed stone under slab-on-ground floors
          (unless the soil already drains well), plus a 6-mil polyethylene vapor retarder under slabs in living
          spaces. Driveways, patios, and garages don&apos;t need the vapor retarder, but they still need a
          firm, uniform base: soft spots under a slab turn into cracks.
        </p>
        <p className="mt-4 text-[16px] text-text-secondary">
          For a 10 × 10 ft patio, a 4 in gravel base takes about 1.36 yd³ including waste, or roughly 1.8 tons
          of crushed stone. The{" "}
          <Link href="/calculators/gravel-calculator" className="font-semibold text-primary hover:underline">
            Gravel Calculator
          </Link>{" "}
          works it out for any size, and{" "}
          <Link href="/guides/gravel-types-and-sizes" className="text-primary hover:underline">
            types of gravel and sizes
          </Link>{" "}
          explains which stone to use.
        </p>
      </section>

      <section className="mt-10">
        <h2>Reinforcement</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Reinforcement doesn&apos;t stop concrete from cracking. It holds cracks tight, so the pieces
          can&apos;t separate or shift out of level.
        </p>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Welded wire mesh</strong> is common in patios and garage floors. It has to sit inside the
            slab, on supports or pulled up during the pour; mesh left lying on the base does nothing.
          </li>
          <li>
            <strong>Rebar</strong>, typically #3 or #4 bars in a grid 18–24 in apart, is the usual choice for
            driveways and slabs that carry vehicles. Set it on chairs so it ends up near the middle of the slab.
          </li>
          <li>
            <strong>Fibers</strong> mixed into the concrete at the plant reduce early shrinkage cracking. They
            are a good addition to light-duty slabs, but they don&apos;t replace rebar where loads are heavy.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2>Control joints</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Concrete shrinks as it cures, and it will crack somewhere. Control joints decide where: grooves cut or
          tooled into the surface, about a quarter of the slab&apos;s depth, create weak lines so cracks form
          inside the joint instead of across the middle of a panel. A common rule is to space joints no more
          than 2–3 times the slab thickness in inches, measured in feet, and to keep panels close to square.
        </p>
        <DataTable headers={["Slab thickness", "Maximum joint spacing"]} rows={jointRows} />
        <TableNote>
          Cut joints as soon as the concrete is hard enough to saw without chipping, usually within the first
          day. Wait too long and the slab will crack on its own first.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>How much concrete to order</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Multiply length × width × thickness (in feet) to get cubic feet, then divide by 27 for cubic yards. A
          10 × 10 ft patio at 4 in thick needs about 1.23 yd³, or 1.36 yd³ with 10% extra for spillage and
          uneven forms. Ready-mix is usually ordered in quarter-yard steps, so that becomes a 1.50 yd³ order.
          The table uses the same assumptions as the Concrete Calculator.
        </p>
        <DataTable
          headers={["Slab", "Thickness", "With 10% waste (yd³)", "Ready-mix order (yd³)", "80 lb bags"]}
          rows={slabRows}
        />
        <TableNote>
          Many suppliers add a short-load fee for small orders, so for slabs under a couple of yards, compare
          the delivered ready-mix price with the cost of bags.
        </TableNote>
        <div className="mt-4">
          <InfoCallout>
            Use the{" "}
            <Link href="/calculators/concrete-calculator" className="font-semibold text-primary hover:underline">
              Concrete Calculator
            </Link>{" "}
            to get cubic yards, a quarter-yard order size, and an equivalent bag count for your exact
            dimensions and shape.
          </InfoCallout>
        </div>
      </section>

      <section className="mt-10">
        <h2>Bags or ready-mix?</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Bagged mix makes sense for small pours: post footings, a small pad, steps, or repairs. Past about a
          cubic yard it gets hard going. That&apos;s 45 bags of 80 lb mix, or 3,600 lb to lift and mix, and a
          slab mixed in batches can end up with weak cold joints where one batch set before the next was
          placed. For larger slabs, order ready-mix, or rent a towable mixer for mid-size jobs.
        </p>
        <DataTable headers={["Bag size", "Yield per bag", "Bags per cubic yard"]} rows={bagRows} />
      </section>

      <section className="mt-10">
        <h2>Pouring and curing tips</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Don&apos;t add water on site.</strong> Extra water makes concrete easier to place but weaker
            and more prone to shrinkage cracks. If the mix is too stiff, ask the supplier about a
            water-reducing admixture instead.
          </li>
          <li>
            <strong>Ask for air-entrained concrete</strong> for outdoor slabs in climates with freezing winters.
            The tiny air bubbles help it resist damage from freeze–thaw cycles and de-icing salts.
          </li>
          <li>
            <strong>Keep it moist.</strong> Cure the slab for about 7 days with a curing compound, wet burlap,
            or plastic sheeting, so the surface doesn&apos;t dry out too fast and weaken.
          </li>
          <li>
            <strong>Watch the weather.</strong> Don&apos;t pour on frozen ground, and protect fresh concrete
            from freezing for the first few days.
          </li>
          <li>
            <strong>Give it time.</strong> Foot traffic is usually fine after a day or two, and cars after about
            a week. Concrete reaches its design strength at around 28 days, so keep heavy trucks off until then.
          </li>
        </ul>
      </section>
    </GuideArticle>
  );
}
