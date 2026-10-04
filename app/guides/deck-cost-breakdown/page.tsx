import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { GuideArticle, DataTable, TableNote } from "@/components/content/GuideArticle";
import { InfoCallout } from "@/components/content/InfoCallout";
import { BOARD_LENGTH_FT, JOIST_SPACING_IN, deckQuantities } from "@/lib/calculators/deck";
import type { FaqItem } from "@/lib/calculators/types";

const PATH = "/guides/deck-cost-breakdown";
const TITLE = "Deck Cost Breakdown: Materials & a Worked Estimate";
const DESCRIPTION =
  "How to estimate what a deck will cost: every line item in the materials list, a worked example for a 16 × 12 ft deck, how decking material changes the total, and where to save.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: { absolute: TITLE },
  description: DESCRIPTION,
  article: true,
});

// Worked example: a 16 × 12 ft deck attached to the house along one 16 ft side, 5.5 in boards, 10% waste.
const LENGTH = 16;
const WIDTH = 12;
const q = deckQuantities(LENGTH, WIDTH, 5.5, 10);
const SCREWS_PER_100_SQFT = 330; // two screws at every joist crossing for 5.5 in boards on 16 in centers
const SCREWS = Math.ceil((q.areaSqFt / 100) * SCREWS_PER_100_SQFT);
const RAILING_FT = LENGTH + 2 * WIDTH; // the side against the house needs no railing
const FOOTINGS = 6;
const FOOTING_FT3 = Math.PI * 0.5 * 0.5 * 3; // 12 in diameter hole, 36 in deep
const FOOTING_BAGS = Math.ceil((FOOTING_FT3 * FOOTINGS) / 0.6);

// Placeholder prices used only to show the arithmetic. Replace them with quotes from your own suppliers.
const PRICE = {
  pressureTreatedBoard: 15, // 5/4×6×12 ft
  compositeBoard: 55,
  joist: 30, // 2×8×16 ft
  framingBoard: 30, // 2×8×16 ft for ledger, rim, and beams
  post: 25, // 6×6×8 ft
  hangerAndHardwareAllowance: 150,
  screwBox: 30, // ~350 screws
  concreteBag: 7, // 80 lb
  railingPerFt: 40,
};
const FRAMING_BOARDS = 5;
const POSTS = 6;
const SCREW_BOXES = Math.ceil(SCREWS / 350);

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

const FAQS: FaqItem[] = [
  {
    question: "How much does it cost to build a deck?",
    answer:
      "It depends on size, height, decking material, railing, local lumber prices, and whether you hire a contractor. The reliable way to estimate is to list every material, multiply each quantity by your local price, then add permits and any labor. The worked example on this page shows the method for a 16 × 12 ft deck.",
  },
  {
    question: "What is the biggest cost in a deck?",
    answer:
      "The decking surface and the railing are usually the two largest material items, and the choice of decking material can change the total by a wide margin. Footings, framing, and hardware are smaller individually but add up.",
  },
  {
    question: "Is it cheaper to build a deck yourself?",
    answer:
      "Doing the work yourself removes labor costs, which can be a large share of a contractor's quote, but you pay for tools, mistakes, and your time. Get a contractor's quote for comparison, and don't skip the permit and inspections either way.",
  },
  {
    question: "How do I compare composite and wood decking costs?",
    answer:
      "Compare the full cost of ownership, not only the purchase price. Wood needs sealing or staining every year or two, while composite costs more up front but needs mostly cleaning. Add up the upkeep over 10 to 15 years before you decide.",
  },
  {
    question: "Does a bigger deck cost less per square foot?",
    answer:
      "Often it does, because some costs, such as stairs, the ledger, and permit fees, don't grow in proportion to the area. A tall deck with a long railing costs more per square foot than a low one without.",
  },
];

export default function DeckCostBreakdownPage() {
  const decking = (price: number) => q.boards * price;
  const framing =
    q.joists * PRICE.joist +
    FRAMING_BOARDS * PRICE.framingBoard +
    POSTS * PRICE.post +
    PRICE.hangerAndHardwareAllowance;
  const footings = FOOTING_BAGS * PRICE.concreteBag;
  const screws = SCREW_BOXES * PRICE.screwBox;
  const railing = RAILING_FT * PRICE.railingPerFt;
  const common = framing + footings + screws + railing;
  const totalPT = decking(PRICE.pressureTreatedBoard) + common;
  const totalComposite = decking(PRICE.compositeBoard) + common;

  const lineRows = [
    [
      `Decking boards (${LENGTH} × ${WIDTH} ft, 5.5 in)`,
      `${q.boards} × ${BOARD_LENGTH_FT} ft boards`,
      money(PRICE.pressureTreatedBoard),
      money(decking(PRICE.pressureTreatedBoard)),
    ],
    [`Joists, 2×8×16`, `${q.joists}`, money(PRICE.joist), money(q.joists * PRICE.joist)],
    [
      "Ledger, rim, and beam boards, 2×8×16",
      `${FRAMING_BOARDS}`,
      money(PRICE.framingBoard),
      money(FRAMING_BOARDS * PRICE.framingBoard),
    ],
    ["Posts, 6×6×8", `${POSTS}`, money(PRICE.post), money(POSTS * PRICE.post)],
    ["Joist hangers, bolts, flashing", "allowance", "-", money(PRICE.hangerAndHardwareAllowance)],
    [
      "Concrete for footings, 80 lb bags",
      `${FOOTING_BAGS}`,
      money(PRICE.concreteBag),
      money(footings),
    ],
    [
      "Deck screws",
      `${SCREW_BOXES} boxes (~${SCREWS} screws)`,
      money(PRICE.screwBox),
      money(screws),
    ],
    ["Railing", `${RAILING_FT} linear ft`, `${money(PRICE.railingPerFt)}/ft`, money(railing)],
    ["Total (materials only)", "", "", money(totalPT)],
  ];

  return (
    <GuideArticle
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      breadcrumb="Deck Cost Breakdown"
      intro="A deck is a long list of small purchases, and the final number depends on your local prices, the material you choose, and how much of the work you do yourself. This guide shows how to build an estimate line by line: what quantities to count, how to get them from the Deck Calculator, and what a worked example looks like for a 16 × 12 ft deck."
      related={[
        { href: "/calculators/deck-calculator", label: "Deck Calculator" },
        { href: "/calculators/concrete-calculator", label: "Concrete Calculator (for footings)" },
        { href: "/guides/concrete-slab-thickness", label: "Concrete slab thickness guide" },
        { href: "/calculators/fence-calculator", label: "Fence Calculator" },
      ]}
      faqs={FAQS}
    >
      <div className="mt-6">
        <InfoCallout>
          <strong>How to estimate fast:</strong> get the quantities from the{" "}
          <Link href="/calculators/deck-calculator" className="font-semibold text-primary hover:underline">
            Deck Calculator
          </Link>
          , multiply each by your local price, then add footings, hardware, railing, stairs, and permits. The
          prices on this page are placeholders for the arithmetic only. Replace them with quotes from your own
          suppliers.
        </InfoCallout>
      </div>

      <section className="mt-10">
        <h2>The materials list, line by line</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Every deck needs the same categories of materials, whatever its size. Count each one separately, then add
          them up.
        </p>
        <DataTable
          headers={["Item", "What to count", "How to get the quantity"]}
          rows={[
            ["Decking boards", "Surface area ÷ board width, plus waste", "Deck Calculator"],
            ["Joists", "One every 16 in across the width, plus one", "Deck Calculator"],
            ["Ledger, rim, and beam boards", "Perimeter and beam lines", "Your deck plan"],
            ["Posts and footings", "One per beam end and span", "Deck plan and span tables"],
            ["Concrete", "Volume of each footing hole", "Concrete Calculator"],
            ["Fasteners and hangers", "Per joist crossing and connection", "Roughly 330 screws per 100 ft²"],
            ["Railing and stairs", "Linear feet of rail, number of steps", "Measure the open sides"],
            ["Permit and inspection fees", "Local flat fee or a rate by area", "Your building department"],
          ]}
        />
        <TableNote>
          Quantities for decking and joists use the same {JOIST_SPACING_IN} in joist spacing and {BOARD_LENGTH_FT} ft
          boards as the calculator. Framing and footing quantities depend on your design and local code.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>Worked example: a {LENGTH} × {WIDTH} ft deck</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Take a {q.areaSqFt} ft² deck attached to the house along one {LENGTH} ft side. The Deck Calculator gives{" "}
          {q.boards} boards ({BOARD_LENGTH_FT} ft, 5.5 in wide, with 10% waste) and {q.joists} joists. The other
          quantities are assumptions for a typical low deck: {FRAMING_BOARDS} 2×8×16 boards for the ledger, rim, and
          beams, {POSTS} posts on {FOOTINGS} footings, and railing on the three open sides ({RAILING_FT} ft). Each
          footing is a 12 in diameter hole 36 in deep, which takes about {FOOTING_FT3.toFixed(1)} ft³ of concrete,
          or {FOOTING_BAGS} bags for all {FOOTINGS}.
        </p>
        <DataTable
          headers={["Item", "Quantity", "Example price", "Line total"]}
          rows={lineRows}
        />
        <TableNote>
          Placeholder prices for illustration only. Pressure-treated decking at the example price gives about{" "}
          {money(totalPT / q.areaSqFt)} per square foot of deck in materials. Stairs, permits, tools, delivery, tax,
          and labor are extra.
        </TableNote>
      </section>

      <section className="mt-10">
        <h2>How the decking material changes the total</h2>
        <p className="mt-3 text-[16px] text-text-secondary">
          Everything under the surface is the same for any decking, so the choice of boards is the biggest lever.
          Keeping the same {q.boards} boards and swapping only the price shows how much it matters at the example
          prices.
        </p>
        <DataTable
          headers={["Decking", "Example price per 12 ft board", "Decking cost", "Estimated materials total"]}
          rows={[
            ["Pressure-treated wood", money(PRICE.pressureTreatedBoard), money(decking(PRICE.pressureTreatedBoard)), money(totalPT)],
            ["Composite", money(PRICE.compositeBoard), money(decking(PRICE.compositeBoard)), money(totalComposite)],
          ]}
        />
        <p className="mt-4 text-[16px] text-text-secondary">
          Wood costs less up front but needs sealing or staining every year or two, and composite costs more now with
          far less upkeep. Compare the totals over 10 to 15 years, adding the stain, sealer, and time for wood, before
          you decide. The{" "}
          <Link href="/calculators/deck-calculator" className="text-primary hover:underline">
            Deck Calculator
          </Link>{" "}
          page compares lifespans and upkeep for each material.
        </p>
      </section>

      <section className="mt-10">
        <h2>What changes the cost most</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>
            <strong>Height.</strong> Tall decks need longer posts, bigger footings, bracing, stairs, and more railing.
            A ground-level deck can skip the railing in many places.
          </li>
          <li>
            <strong>Shape.</strong> Diagonal boards, picture-frame borders, and curves add waste and labor. Use 15% or
            more waste for diagonal layouts.
          </li>
          <li>
            <strong>Railing.</strong> Railing is priced per linear foot and can rival the decking cost on a small,
            high deck.
          </li>
          <li>
            <strong>Local code.</strong> Frost depth sets the footing depth, and snow and wind loads can call for
            larger lumber or closer joists.
          </li>
          <li>
            <strong>Labor.</strong> A contractor&apos;s quote adds labor, equipment, and overhead to the materials
            above. Ask for an itemized estimate so you can compare it with your own list.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2>How to build your own estimate</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[16px] text-text-secondary">
          <li>
            <strong>Design the deck.</strong> Decide the size, height, shape, and how it attaches to the house.
          </li>
          <li>
            <strong>Run the Deck Calculator</strong> for boards and joists, and the{" "}
            <Link href="/calculators/concrete-calculator" className="text-primary hover:underline">
              Concrete Calculator
            </Link>{" "}
            for footings.
          </li>
          <li>
            <strong>List the rest</strong> from your plan: posts, beams, ledger, hangers, railing, and stairs.
          </li>
          <li>
            <strong>Get real prices.</strong> Ask two or three suppliers for current prices on the exact items,
            including delivery.
          </li>
          <li>
            <strong>Add a contingency.</strong> Ten to fifteen percent covers waste, mistakes, and price changes.
          </li>
          <li>
            <strong>Add permit and inspection fees,</strong> then divide the total by the deck area to get your cost
            per square foot.
          </li>
        </ol>
      </section>

      <section className="mt-10">
        <h2>Ways to save without cutting corners</h2>
        <ul className="mt-4 space-y-3 text-[16px] text-text-secondary">
          <li>Match board length to the deck dimension to cut seams and waste. A 16 ft deck with 16 ft boards needs no butt joints.</li>
          <li>Keep the design rectangular and low, which reduces railing, framing, and labor.</li>
          <li>Buy lumber together from one supplier and ask about a project discount or free delivery.</li>
          <li>Choose a mid-range material you can maintain, since a neglected wood deck costs more in the long run.</li>
          <li>Spend on the parts you can&apos;t easily change later: footings, framing, flashing, and fasteners.</li>
        </ul>
      </section>
    </GuideArticle>
  );
}
