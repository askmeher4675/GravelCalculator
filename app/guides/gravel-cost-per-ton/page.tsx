import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { GuideArticle, DataTable } from "@/components/content/GuideArticle";
import { InfoCallout } from "@/components/content/InfoCallout";

const PATH = "/guides/gravel-cost-per-ton";
const TITLE = "How Much Does Gravel Cost? Per Ton and Per Cubic Yard";
const DESCRIPTION =
  "What drives gravel prices, how to convert price per ton to price per cubic yard, and how to estimate the total cost of a gravel project including delivery.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: TITLE },
  description: DESCRIPTION,
  article: true,
});

// Crushed stone runs about 1.3 tons per cubic yard (2,600 lb/yd³); pea gravel/DG about 1.4.
const TON_PRICES = [20, 30, 40, 50, 60, 75];
const money = (n: number) => `$${n.toFixed(0)}`;

export default function GravelCostGuidePage() {
  const rows = TON_PRICES.map((p) => [
    `${money(p)}/ton`,
    `${money(p * 1.3)}/yd³`,
    `${money(p * 1.4)}/yd³`,
  ]);

  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Gravel Cost"
      intro="Gravel is usually quoted at $15–$75 per ton, but that is only part of the bill. Here is how to compare quotes, convert between tons and cubic yards, and budget for the whole project."
    >
      <section className="mt-10">
        <h2>Typical price range</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Bulk gravel commonly falls between $15 and $75 per ton. Plain crushed stone and recycled
          aggregate sit at the low end. Washed, decorative, or specialty stone such as river rock and
          decomposed granite costs more. Prices vary widely by region and by how far the quarry is from
          your site, so treat any published range as a starting point and call two or three local
          suppliers.
        </p>
      </section>

      <section className="mt-10">
        <h2>Convert price per ton to price per cubic yard</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Suppliers may quote by weight or by volume. A cubic yard of crushed stone weighs about 1.3
          tons, and denser stone such as pea gravel or decomposed granite about 1.4 tons, so multiply
          the ton price by that factor.
        </p>
        <DataTable
          headers={["Price per ton", "Per yd³ (crushed stone, ~1.3 t)", "Per yd³ (pea gravel / DG, ~1.4 t)"]}
          rows={rows}
        />
      </section>

      <section className="mt-10">
        <h2>What else goes into the total</h2>
        <ul className="mt-4 space-y-2 text-[16px] text-text-secondary">
          <li>
            <strong>Delivery:</strong> often a flat fee or a per-mile charge, and sometimes waived above
            a minimum order. Ask for it separately from the material price.
          </li>
          <li>
            <strong>Minimum orders:</strong> some yards have a minimum load, which can matter for small
            jobs. Bagged gravel is more expensive per ton but avoids minimums.
          </li>
          <li>
            <strong>Waste and compaction:</strong> plan on ordering about 10% extra so you don&apos;t run short.
          </li>
          <li>
            <strong>Base prep:</strong> landscape fabric, edging, and equipment rental are not included
            in the material price.
          </li>
        </ul>
        <div className="mt-4">
          <InfoCallout>
            Example: a 2.8 yd³ order of crushed stone weighs about 3.6 tons. At $55/ton that is roughly
            $200 for material, before delivery and tax.
          </InfoCallout>
        </div>
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
