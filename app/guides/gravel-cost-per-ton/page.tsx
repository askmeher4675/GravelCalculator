import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GuideArticle, DataTable, TableNote } from "@/components/content/GuideArticle";
import { InfoCallout } from "@/components/content/InfoCallout";
import { GRAVEL_TYPES } from "@/lib/calculators/gravel";
import { rawVolume, withWaste } from "@/lib/calculators/volumeModel";
import type { FaqItem } from "@/lib/calculators/types";

const PATH = "/guides/gravel-cost-per-ton";
const TITLE = "How Much Does Gravel Cost? Per Ton and Per Cubic Yard";
const DESCRIPTION =
  "Typical gravel prices per ton and per cubic yard, what drives the price, delivery and other costs, bulk vs bagged gravel, and a worked driveway budget.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: TITLE },
  description: DESCRIPTION,
  article: true,
});

const TON_PRICES = [20, 30, 40, 50, 60, 75];
const WASTE_PERCENT = 10;
const money = (n: number) => `$${n.toFixed(0)}`;
const tonsPerYd = (label: string) => GRAVEL_TYPES.find((t) => t.label === label)!.lbPerCubicYd / 2000;
const CRUSHED_TONS_PER_YD = tonsPerYd("Crushed Stone (#57)");
const PEA_TONS_PER_YD = tonsPerYd("Pea Gravel");

// Worked budget: a 12 × 50 ft driveway, priced per layer with illustrative (not quoted) prices.
const BUDGET_AREA_SQ_FT = 12 * 50;
const BUDGET_LAYERS = [
  { label: "Base layer, 4 in", depthIn: 4, pricePerTon: 40 },
  { label: "Surface layer, 2 in", depthIn: 2, pricePerTon: 50 },
];
const DELIVERY_FEE = 100;

const MATERIAL_ROWS = [
  ["Recycled crushed concrete", "Lowest", "Made from demolished concrete; common near cities"],
  ["Crusher run / road base", "Low", "Unwashed, with the fines left in; minimal processing"],
  ["Crushed stone (#57, #67)", "Medium", "Screened to a single size, often washed"],
  ["Pea gravel", "Medium", "Naturally rounded stone, screened and washed"],
  ["Decomposed granite", "Medium to high", "Stabilized and resin-bound versions cost more"],
  ["River rock and decorative stone", "High", "Sorted by size and color, often trucked long distances"],
];

const FAQS: FaqItem[] = [
  {
    question: "Why does delivery add so much to the cost of gravel?",
    answer:
      "Stone is heavy and cheap for its weight, so on a small order the trucking can cost as much as the stone. A $100 delivery fee adds about $33 per ton to a 3-ton order, but under $7 per ton to a 15-ton order.",
  },
  {
    question: "What's the cheapest type of gravel?",
    answer:
      "Usually crusher run, recycled crushed concrete, or unwashed fill stone, since they need the least processing. They also make excellent base layers. Decorative stone such as river rock usually costs the most.",
  },
  {
    question: "How much does it cost to gravel a driveway?",
    answer:
      "For the stone alone, multiply the tons you need by your local price. A 12 × 50 ft driveway with a 6 in, two-layer build needs about 16 tons of crushed stone, or roughly $640–$950 at $40–$60 per ton, plus delivery. A contractor's price will be higher because it includes excavation, grading, and compaction.",
  },
  {
    question: "Is washed gravel worth the extra cost?",
    answer:
      "For drainage, yes: washing removes the fines that would otherwise clog the gaps water flows through. For a driveway base, unwashed stone is often better, because the fines help it compact hard, and it's cheaper.",
  },
];

export default function GravelCostGuidePage() {
  const conversionRows = TON_PRICES.map((p) => [
    `${money(p)}/ton`,
    `${money(p * CRUSHED_TONS_PER_YD)}/yd³`,
    `${money(p * PEA_TONS_PER_YD)}/yd³`,
  ]);

  const layerCosts = BUDGET_LAYERS.map((layer) => {
    const cubicYd = withWaste(rawVolume(BUDGET_AREA_SQ_FT, layer.depthIn / 12).cubicYd, WASTE_PERCENT);
    const tons = cubicYd * CRUSHED_TONS_PER_YD;
    return { ...layer, cubicYd, tons, cost: tons * layer.pricePerTon };
  });
  const deliveryTotal = DELIVERY_FEE * layerCosts.length;
  const budgetTotal = layerCosts.reduce((sum, l) => sum + l.cost, 0) + deliveryTotal;
  const budgetRows = [
    ...layerCosts.map((l) => [
      l.label,
      `${l.cubicYd.toFixed(2)} yd³ (${l.tons.toFixed(1)} tons at ${money(l.pricePerTon)}/ton)`,
      money(l.cost),
    ]),
    [`Delivery, ${layerCosts.length} loads`, `${layerCosts.length} × ${money(DELIVERY_FEE)}`, money(deliveryTotal)],
    ["Total before tax", "", money(budgetTotal)],
  ];

  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Gravel Cost"
      intro="Gravel is usually quoted at $15–$75 per ton, but the price per ton is only part of the bill. Delivery, the type of stone, and how much you order can change the total as much as the headline rate. Here's how to compare quotes, convert between tons and cubic yards, and budget the whole project."
      related={[
        { href: "/calculators/gravel-calculator", label: "Gravel Calculator" },
        { href: "/calculators/driveway-calculator", label: "Driveway Calculator" },
        { href: "/guides/gravel-coverage-chart", label: "Gravel coverage chart" },
        { href: "/guides/gravel-types-and-sizes", label: "Types of gravel and sizes" },
        { href: "/guides/gravel-driveway", label: "How much gravel for a driveway" },
      ]}
      faqs={FAQS}
    >
      <div className="mt-6">
        <InfoCallout>
          <strong>Quick answer:</strong> bulk gravel commonly costs $15–$75 per ton, which works out to roughly
          $20–$105 per cubic yard, because a cubic yard weighs about 1.3–1.4 tons. For example, a 20 × 10 ft
          area at 4 in deep takes about 3.5 tons of crushed stone: roughly $194 at $55 per ton, before
          delivery and tax.
        </InfoCallout>
      </div>

      <section className="mt-10">
        <h2>Typical price range</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Bulk gravel commonly falls between $15 and $75 per ton. Plain crushed stone and recycled aggregate
          sit at the low end. Washed, decorative, or specialty stone such as river rock and decomposed granite
          costs more. Prices vary widely by region and by how far the quarry is from your site, so treat any
          published range as a starting point and call two or three local suppliers.
        </p>
        <DataTable headers={["Material", "Relative price", "Why"]} rows={MATERIAL_ROWS} />
        <TableNote>
          Relative prices are typical, but local supply can reorder the list: stone quarried nearby is often
          cheaper than a &quot;cheap&quot; stone trucked in from far away.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>What drives the price</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Processing.</strong> Washing and screening stone to a single size costs more than selling
            it as it comes off the crusher.
          </li>
          <li>
            <strong>Distance.</strong> Stone is heavy and cheap for its weight, so trucking is a large share of
            the price. The same stone can cost far more 50 miles from the quarry than at the gate.
          </li>
          <li>
            <strong>Local geology.</strong> Areas with nearby limestone or granite quarries pay less than
            regions where all stone is shipped in.
          </li>
          <li>
            <strong>Order size.</strong> Larger orders often get a lower per-ton rate, while small orders may
            hit a minimum charge.
          </li>
          <li>
            <strong>Looks.</strong> Color-sorted and decorative stone is priced for appearance, not just weight.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2>Convert price per ton to price per cubic yard</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Suppliers may quote by weight or by volume. A cubic yard of crushed stone weighs about 1.3 tons, and
          denser stone such as pea gravel or decomposed granite about 1.4 tons, so multiply the ton price by
          that factor. To go the other way, divide: $65 per cubic yard of crushed stone is about $50 per ton.
        </p>
        <DataTable
          headers={["Price per ton", "Per yd³ (crushed stone, ~1.3 t)", "Per yd³ (pea gravel / DG, ~1.4 t)"]}
          rows={conversionRows}
        />
      </section>

      <section className="mt-10">
        <h2>Delivery and other costs</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Delivery:</strong> often a flat fee within a set radius plus a per-mile charge beyond it,
            and sometimes waived above a minimum order. Ask for it separately from the material price.
          </li>
          <li>
            <strong>Truck capacity:</strong> each truck has a maximum load. An order slightly over one
            truckload means a second trip and a second fee, so ask what the truck holds and size your order
            to fit.
          </li>
          <li>
            <strong>Minimum orders:</strong> some yards have a minimum load, which matters for small jobs.
            Bagged gravel costs more per ton but avoids minimums.
          </li>
          <li>
            <strong>Spreading:</strong> ask whether the driver can tailgate-spread, dumping the load in a strip
            while the truck rolls forward. It can save hours of wheelbarrow work.
          </li>
          <li>
            <strong>Surcharges and tax:</strong> fuel surcharges and sales tax may be added on top of the
            per-ton price.
          </li>
          <li>
            <strong>Waste and compaction:</strong> plan on ordering about 10% extra so you don&apos;t run short.
          </li>
          <li>
            <strong>Site prep:</strong> landscape fabric, edging, and equipment rental, such as a plate
            compactor, are not included in the material price.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2>Bulk vs bagged gravel</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Bagged gravel from home centers usually comes in 0.5 ft³ bags, so it takes 54 bags to make one cubic
          yard. At $5 a bag, that&apos;s $270 per cubic yard, or about $208 per ton of crushed stone: several
          times the typical bulk price.
        </p>
        <p className="mt-4 text-[16px] text-text-secondary">
          Bags still make sense for small jobs, for areas a truck can&apos;t reach, and when you&apos;d
          otherwise pay a delivery fee for a few wheelbarrow loads. The break-even depends on the delivery
          charge: with bags at $5, bulk stone at $50 per ton, and a $100 delivery fee, bulk becomes cheaper at
          around half a cubic yard.
        </p>
        <p className="mt-4 text-[16px] text-text-secondary">
          If you have a pickup, many yards will load it for you. Check the payload rating on the door-jamb
          sticker first: a cubic yard of gravel weighs 2,600–2,800 lb, so a typical half-ton pickup can carry
          only about half to three-quarters of a yard per trip.
        </p>
      </section>

      <section className="mt-10">
        <h2>Worked example: budgeting a gravel driveway</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Say you&apos;re building a 12 × 50 ft driveway with a 4 in base and a 2 in top layer. Using the
          Gravel Calculator&apos;s crushed stone (#57) setting and 10% waste, and assuming base stone at $40
          per ton, top-layer stone at $50 per ton, and $100 per delivery with one load of each material:
        </p>
        <DataTable headers={["Item", "Quantity", "Cost"]} rows={budgetRows} />
        <TableNote>
          Prices here are illustrative assumptions, not quotes. Not included: geotextile fabric, edging,
          equipment rental, and labor.
        </TableNote>
        <p className="mt-4 text-[16px] text-text-secondary">
          If you hire a contractor, the quote will usually be per square foot or a lump sum that includes
          excavation, grading, and compaction. Ask each contractor what depth and how many tons they&apos;re
          planning: a low bid often means a thinner base.
        </p>
      </section>

      <section className="mt-10">
        <h2>How to compare quotes</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[16px] text-text-secondary">
          <li>Put every quote in the same unit, converting per-yard prices to per-ton (or the reverse) with the factors above.</li>
          <li>Add delivery, surcharges, and tax to get a delivered price for the whole order.</li>
          <li>Confirm the exact material. Washed #57, unwashed #57, and crusher run are different products at different prices.</li>
          <li>Remember that stone is sold loose. Compacted stone takes up less space, which your 10% allowance covers.</li>
          <li>Ask for the scale ticket. Stone sold by the ton is weighed at the yard, and the ticket shows exactly what you paid for.</li>
        </ol>
      </section>

      <section className="mt-10">
        <h2>Ways to save</h2>
        <ul className="mt-4 space-y-2 text-[16px] text-text-secondary">
          <li>Buy bulk rather than bags once you need more than about half a cubic yard.</li>
          <li>Use crusher run or recycled concrete for base layers, and save pricier stone for the top layer where it shows.</li>
          <li>Size orders to full truckloads, or split a load with a neighbor doing a project at the same time.</li>
          <li>Haul small loads yourself if your truck or trailer is rated for the weight.</li>
          <li>Measure carefully so you don&apos;t over-order, or pay for a second delivery to cover a shortfall.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2>Estimate your own cost</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Enter your area, depth, gravel type and your supplier&apos;s price per ton in the{" "}
          <Link href="/calculators/gravel-calculator" className="font-semibold text-primary hover:underline">
            Gravel Calculator
          </Link>{" "}
          to get cubic yards, tons and total cost in one step. To check how far your order will stretch,
          see the{" "}
          <Link href="/guides/gravel-coverage-chart" className="text-primary hover:underline">
            gravel coverage chart
          </Link>
          , or compare materials in the{" "}
          <Link href="/guides/gravel-types-and-sizes" className="text-primary hover:underline">
            gravel types and sizes guide
          </Link>
          .
        </p>
      </section>
    </GuideArticle>
  );
}
