import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GuideArticle, DataTable, TableNote } from "@/components/content/GuideArticle";
import { InfoCallout } from "@/components/content/InfoCallout";
import type { FaqItem } from "@/lib/calculators/types";

const PATH = "/guides/gravel-types-and-sizes";
const TITLE = "Types of Gravel and Sizes: Which Should You Use?";
const DESCRIPTION =
  "Crushed stone numbers (#3, #57, #8), crusher run, pea gravel, river rock and decomposed granite compared: sizes, uses, and the right gravel for driveways, drainage, pavers and paths.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: TITLE },
  description: DESCRIPTION,
  article: true,
});

// Nominal ranges from the standard US size chart (ASTM D448), rounded to everyday fractions.
const STONE_NUMBER_ROWS = [
  ["#3", "1 to 2 in", "Driveway base, bottom layer of a three-layer driveway, construction entrances"],
  ["#4", "3/4 to 1-1/2 in", "Driveway base, drainage around large pipes"],
  ["#57", "3/16 to 1 in (mostly 1/2–3/4 in)", "Driveways, French drains, slab bases, behind retaining walls"],
  ["#67", "3/16 to 3/4 in", "Concrete mixes, drainage, finer driveway surfaces"],
  ["#8", "3/32 to 3/8 in", "Paths, permeable paver bedding, pipe bedding"],
  ["#10 (screenings)", "3/16 in down to dust", "Leveling under flagstone, blending into #411"],
];

const TYPE_ROWS = [
  ["Crushed stone (#57)", "About 3/4 in", "Driveways, drainage, base layers", "Angular, locks together when compacted"],
  ["Crusher run", "3/4 in minus, with fines", "Driveway and patio base", "Packs very firm; drains poorly compared with clean stone"],
  ["#411", "#57 mixed with stone dust", "Driveway top layer", "Compacts into a smooth, hard surface"],
  ["Pea gravel", "About 3/8 in, rounded", "Paths, patios, dog runs, decorative beds", "Smooth and comfortable, but shifts underfoot"],
  ["River rock", "1–3 in and larger", "Decorative beds, dry creek beds, splash areas", "Rounded and attractive, not for driving on"],
  ["Decomposed granite", "1/4 in and smaller", "Garden paths, patios", "Compacts to a firm surface; stabilized versions resist washing out"],
  ["Recycled crushed concrete", "Usually 3/4 in minus", "Driveway and road base", "Often cheaper than quarried stone; quality varies, so look at a load first"],
  ["Rip rap", "6 in and larger", "Erosion control on slopes, banks, and culvert outlets", "Too big to walk or drive on"],
];

const PROJECT_ROWS = [
  ["Driveway base", "#3 or #4 stone, crusher run, or recycled concrete", "Large angular stone spreads the load and compacts"],
  ["Driveway surface", "Crusher run, #411, or #57", "Fines pack into a hard surface; #57 drains better but stays looser"],
  ["French drain", "Clean, washed #57 wrapped in non-woven fabric", "Open gaps let water reach the pipe; the fabric keeps soil out"],
  ["Behind a retaining wall", "Clean #57", "Drains water that would otherwise push on the wall"],
  ["Under a concrete slab", "Clean #57 or crusher run, 4 in compacted", "Firm, even support; clean stone also limits moisture wicking under indoor slabs"],
  ["Under pavers", "Crusher run base plus 1 in of concrete sand", "Firm base and a smooth bed; permeable pavers use #57 and #8 instead"],
  ["Walkway or garden path", "Pea gravel, #8, or decomposed granite", "Small stone is comfortable to walk on"],
  ["Dog run", "Pea gravel", "Smooth on paws, drains fast, and rinses clean"],
  ["Decorative beds", "River rock, pea gravel, or colored stone", "Holds its look and doesn't break down like mulch"],
];

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between gravel and crushed stone?",
    answer:
      "Strictly, gravel is naturally rounded stone from rivers and glacial deposits, while crushed stone is quarried rock broken by machines into sharp, angular pieces. Suppliers often call both “gravel”, but the shape matters: angular stone locks together, while rounded stone rolls.",
  },
  {
    question: "Is pea gravel good for a driveway?",
    answer:
      "Not on its own. The rounded stones roll under tires, so pea gravel ruts, scatters, and is tiring to walk on when it's deep. If you want the look, use a thin layer over a compacted crushed-stone base with sturdy edging, or set it in plastic stabilizer grids, and expect to rake it regularly.",
  },
  {
    question: "What gravel is best for drainage?",
    answer:
      "Clean, washed, angular stone, usually #57. With no fines, it leaves open spaces for water to move through, and the angular shape keeps it stable around the pipe. Wrap French drain stone in non-woven filter fabric so soil doesn't wash in and clog it.",
  },
  {
    question: "Should I use #57 or #8 stone?",
    answer:
      "#57, with most pieces around 1/2 to 3/4 in, is the all-purpose choice for driveways, drainage, and bases. #8, at about 3/8 in and smaller, is finer and more comfortable underfoot, so it suits paths, patios, and bedding for permeable pavers.",
  },
  {
    question: "Does the type of rock matter, or just the size?",
    answer:
      "For heavy traffic, hardness matters: granite and trap rock resist being ground down better than softer limestone. Limestone is widely available and works well for most home driveways and bases. For decorative beds, choose by color and shape.",
  },
];

export default function GravelTypesGuidePage() {
  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Gravel Types and Sizes"
      intro="Gravel names vary by region and supplier, but a few materials cover most projects. Choosing the right one affects how well the surface holds up, how it drains, and how much you pay. This guide explains what the names and numbers mean, and which gravel suits each job."
      related={[
        { href: "/calculators/gravel-calculator", label: "Gravel Calculator" },
        { href: "/guides/gravel-coverage-chart", label: "Gravel coverage chart" },
        { href: "/guides/gravel-cost-per-ton", label: "How much does gravel cost?" },
        { href: "/guides/gravel-driveway", label: "How much gravel for a driveway" },
      ]}
      faqs={FAQS}
    >
      <div className="mt-6">
        <InfoCallout>
          <strong>Quick answer:</strong> for driveways, use angular crushed stone: a coarse base of #3, #4, or
          crusher run under a finer top layer that compacts, such as crusher run or #411. For drainage, use
          clean, washed #57. For paths and patios, use pea gravel, #8 chips, or decomposed granite. Keep
          rounded stone away from anything vehicles drive on.
        </InfoCallout>
      </div>

      <section className="mt-10">
        <h2>The two things that matter most</h2>
        <p className="mt-3 text-[16px] text-text-secondary">Almost every gravel choice comes down to two properties.</p>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Shape: angular or rounded.</strong> Crushed stone is quarried rock broken by machines, so it
            has sharp, fractured faces that lock together when compacted. Natural gravel, pea gravel, and river
            rock have been rounded by water. They roll against each other, which makes them comfortable
            underfoot but unstable under wheels.
          </li>
          <li>
            <strong>Clean or with fines.</strong> Clean (washed) stone is screened to one size, leaving open
            spaces between the pieces for water to flow through. Stone with fines, such as crusher run, #411,
            and anything sold as &quot;minus&quot;, includes dust and small pieces that fill those spaces, so it
            compacts into a hard, stable layer that sheds water rather than draining it.
          </li>
        </ul>
        <p className="mt-4 text-[16px] text-text-secondary">
          Driveway bases want angular stone with fines. Drainage wants angular stone without them. Paths and
          decorative beds can use rounded stone.
        </p>
      </section>

      <section className="mt-10">
        <h2>Crushed stone numbers explained</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Crushed stone is often sold by number. In the US the numbers come from a standard size chart (ASTM
          D448, which state transportation departments also use), and lower numbers mean bigger stone. Each
          number is a range rather than a single size: #57, for example, runs from about 1 in down to 3/16 in,
          with most pieces between 1/2 and 3/4 in.
        </p>
        <DataTable headers={["Number", "Approximate size", "Common uses"]} rows={STONE_NUMBER_ROWS} />
        <TableNote>
          Sizes are approximate. Some states and quarries use their own numbering, so ask for the gradation
          sheet when size really matters, such as for drainage or paver bedding.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>Common gravel types at a glance</h2>
        <DataTable headers={["Type", "Typical size", "Best for", "Notes"]} rows={TYPE_ROWS} />
        <TableNote>
          Sizes are approximate. Grading names and stone sizes differ between suppliers, so confirm what you
          are buying.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>Crusher run goes by many names</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          The dense, compactable base material most driveways are built on is sold under many local names:
          crusher run, crush and run, road base, 3/4 in minus, dense-grade aggregate (DGA), and state
          designations such as 21AA in Michigan, Class 5 in Minnesota, CA-6 in Illinois, and Item 4 in New
          York. They aren&apos;t identical, since each has its own mix of sizes, but they do the same job. Tell
          the supplier what you&apos;re building and they&apos;ll point you to their equivalent.
        </p>
      </section>

      <section className="mt-10">
        <h2>Which gravel for which project</h2>
        <DataTable headers={["Project", "Use", "Why"]} rows={PROJECT_ROWS} />
        <TableNote>
          Layer depths for driveways are in{" "}
          <Link href="/guides/gravel-driveway" className="text-primary hover:underline">
            how much gravel for a driveway
          </Link>
          ; slab bases are covered in the{" "}
          <Link href="/guides/concrete-slab-thickness" className="text-primary hover:underline">
            concrete slab thickness guide
          </Link>
          .
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>Weight and coverage by type</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Different stone weighs different amounts per cubic yard, typically between 2,600 and 2,800 pounds.
          That changes how many tons you order for the same volume. Stone with fines, such as crusher run,
          packs even denser once compacted, which is why the Driveway Calculator assumes about 2,800 lb per
          cubic yard for driveway stone. See the{" "}
          <Link href="/guides/gravel-coverage-chart" className="text-primary hover:underline">
            gravel coverage chart
          </Link>{" "}
          for the numbers, then use the{" "}
          <Link href="/calculators/gravel-calculator" className="font-semibold text-primary hover:underline">
            Gravel Calculator
          </Link>{" "}
          to price your chosen type. For prices, read{" "}
          <Link href="/guides/gravel-cost-per-ton" className="text-primary hover:underline">
            how much gravel costs
          </Link>
          .
        </p>
      </section>

      <section className="mt-10">
        <h2>Buying tips</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Say what it&apos;s for.</strong> Names vary between suppliers, but &quot;base for a
            driveway&quot; or &quot;stone for a French drain&quot; gets you the right product anywhere.
          </li>
          <li>
            <strong>Ask if it&apos;s washed.</strong> For drainage it should be; for a compacted base it
            shouldn&apos;t be.
          </li>
          <li>
            <strong>See it first.</strong> Many yards have sample bins. For decorative stone, look at it both
            wet and dry, since the color changes when it&apos;s wet.
          </li>
          <li>
            <strong>Buy decorative stone all at once.</strong> Color and size vary between batches, so a
            second order may not match the first.
          </li>
          <li>
            <strong>Order each layer separately</strong> if you&apos;re using different stone for the base and
            the surface.
          </li>
        </ul>
      </section>
    </GuideArticle>
  );
}
