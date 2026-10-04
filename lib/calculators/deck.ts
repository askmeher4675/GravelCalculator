import { CalculatorConfig } from "./types";

export const JOIST_SPACING_IN = 16; // standard on-center joist spacing
export const BOARD_LENGTH_FT = 12; // common stocked decking board length

/** Core decking quantities, shared by the calculator and the reference tables on the page. */
export function deckQuantities(length: number, width: number, boardWidthIn: number, wastePercent: number) {
  const areaSqFt = length * width;
  const linearFtNeeded = areaSqFt / (boardWidthIn / 12);
  const linearFtWithWaste = linearFtNeeded * (1 + wastePercent / 100);
  const boards = Math.ceil(linearFtWithWaste / BOARD_LENGTH_FT);
  const joists = Math.ceil((width * 12) / JOIST_SPACING_IN) + 1;
  return { areaSqFt, linearFtNeeded, linearFtWithWaste, boards, joists };
}

const COMMON_SIZES: [number, number][] = [
  [10, 10],
  [12, 12],
  [16, 12],
  [20, 14],
  [20, 16],
  [24, 20],
];

const SIZE_ROWS = COMMON_SIZES.map(([l, w]) => {
  const q = deckQuantities(l, w, 5.5, 10);
  return [`${l} × ${w} ft`, `${q.areaSqFt} ft²`, `${Math.round(q.linearFtWithWaste)} ft`, q.boards, q.joists];
});

const BOARD_WIDTH_ROWS = [
  ["2×4 (3.5 in actual)", 3.5],
  ["5/4×6 or 2×6 (5.5 in actual)", 5.5],
  ["2×8 (7.25 in actual)", 7.25],
].map(([label, w]) => {
  const q = deckQuantities(16, 12, w as number, 10);
  return [label as string, `${Math.round(q.linearFtWithWaste)} ft`, q.boards];
});

export const deckCalculator: CalculatorConfig = {
  slug: "deck-calculator",
  title: "Deck Calculator",
  seoTitle: "Deck Calculator: Boards, Joists & Square Footage",
  category: "Decks & Outdoor Projects",
  intro:
    "Estimate the square footage, decking boards, and joists you need to build a deck based on its length, width, and board width.",
  metaDescription:
    "Deck calculator for decking boards, joists and square footage. Compare board widths and materials to build a materials list before you price the job.",
  fields: [
    { key: "length", label: "Deck length", unit: "ft", type: "number", placeholder: "16", min: 0, step: 0.5 },
    { key: "width", label: "Deck width", unit: "ft", type: "number", placeholder: "12", min: 0, step: 0.5 },
    {
      key: "boardWidth",
      label: "Board width",
      unit: "in",
      type: "number",
      placeholder: "5.5",
      min: 0,
      step: 0.25,
      helperText: "Standard 5/4 decking boards are about 5.5 in wide after milling.",
    },
  ],
  wastePercentOptions: [10, 15],
  wastePercentDefault: 10,
  wasteHelperText: "Covers angled cuts, staggered seams, and defects. 10% works for most simple decks.",
  calculate: (inputs, wastePercent) => {
    const { length, width, boardWidth } = inputs;
    const boardWidthFt = boardWidth / 12;
    const { areaSqFt, linearFtNeeded, linearFtWithWaste, boards: boardsNeeded, joists } = deckQuantities(
      length,
      width,
      boardWidth,
      wastePercent,
    );

    return {
      primaryValue: areaSqFt.toFixed(0),
      primaryUnit: "ft²",
      primaryExplanation: "Deck surface area",
      secondary: [
        { label: "Decking linear feet", value: `${linearFtWithWaste.toFixed(0)} ft` },
        { label: `${BOARD_LENGTH_FT} ft boards needed`, value: `${boardsNeeded} boards` },
        { label: `Joists (${JOIST_SPACING_IN} in on-center)`, value: `${joists} joists` },
      ],
      breakdown: [
        { label: `Deck area (${length.toFixed(1)} × ${width.toFixed(1)} ft)`, value: `${areaSqFt.toFixed(0)} ft²` },
        { label: `Decking linear feet (area ÷ ${boardWidthFt.toFixed(3)} ft board width)`, value: `${linearFtNeeded.toFixed(0)} ft` },
        { label: `With ${wastePercent}% waste`, value: `${linearFtWithWaste.toFixed(0)} ft` },
        { label: `Boards at ${BOARD_LENGTH_FT} ft each`, value: `${boardsNeeded} boards`, note: "Rounded up to the nearest whole board" },
        { label: `Joists spanning the width, every ${JOIST_SPACING_IN} in`, value: `${joists} joists`, note: "Assumes joists run along the length, spaced across the width" },
      ],
    };
  },
  methodology:
    "Deck area is length × width. Decking linear footage is the area divided by the board's actual face width, which approximates board count while ignoring the small gaps typically left between boards for drainage. We add your selected waste percentage for angled cuts, staggered seams, and defects, then convert to a board count assuming standard 12 ft boards. Joist count assumes standard 16 in on-center spacing across the deck's width, with joists running the full length — actual framing should be confirmed against local building code and span tables for your joist size and species.",
  example:
    "A 16 ft × 12 ft deck is 192 ft². With 5.5 in boards and 10% waste, that's about 461 linear feet, or 39 boards at 12 ft each, plus 10 joists at 16 in on-center.",
  sections: [
    {
      heading: "Decking needed for common deck sizes",
      paragraphs: [
        "Most backyard decks fall into a handful of standard footprints. The table below uses the same assumptions as the calculator: 5.5 in boards, 12 ft lengths, 10% waste, and joists every 16 in across the deck's width (the shorter side, listed second). Use it for a quick sanity check before you enter your own dimensions.",
      ],
      table: {
        headers: ["Deck size", "Surface area", "Decking (with waste)", "12 ft boards", "Joists"],
        rows: SIZE_ROWS,
        note: "Board counts are for decking only. Framing lumber, fasteners, railing, and stairs are separate line items.",
      },
    },
    {
      heading: "How board width changes the count",
      paragraphs: [
        "Decking is sold by nominal size, but the face you walk on is smaller. A 5/4×6 or 2×6 board is about 5.5 in wide, a 2×4 is only 3.5 in, and a 2×8 is 7.25 in. Narrower boards mean more pieces, more gaps, and more fasteners for the same square footage, which is why a 2×4 deck costs more labor even when the lumber is cheaper per foot.",
        "The table shows the same 16 × 12 ft deck (192 ft²) with 10% waste at three common widths. Switching from 5.5 in to 3.5 in boards adds roughly 60% more linear footage.",
      ],
      table: {
        headers: ["Board", "Decking (with waste)", "12 ft boards"],
        rows: BOARD_WIDTH_ROWS,
      },
    },
    {
      heading: "Choosing a decking material",
      paragraphs: [
        "Material affects price, maintenance, and how long the deck lasts far more than it affects the quantity you order. The quantities from this calculator apply to any of them, but you may need different joist spacing depending on the product.",
      ],
      table: {
        headers: ["Material", "Typical lifespan", "Upkeep", "Relative cost"],
        rows: [
          ["Pressure-treated pine", "10–20 years", "Seal or stain every 1–3 years", "$"],
          ["Cedar or redwood", "15–25 years", "Seal or stain every 1–2 years", "$$"],
          ["Composite", "25–30 years", "Occasional cleaning", "$$$"],
          ["PVC (cellular)", "25–30+ years", "Occasional cleaning", "$$$$"],
          ["Tropical hardwood (ipe)", "25–40 years", "Oil yearly to keep the color", "$$$$"],
        ],
        note: "Lifespans are typical ranges and depend on climate, drainage, and sun exposure. Warranty terms vary by manufacturer.",
      },
      after: [
        "Pressure-treated pine is the usual budget choice and works well when it is sealed on schedule. Composite and PVC cost more up front but remove most of the recurring staining work, so many owners compare total cost over ten or fifteen years rather than the purchase price alone. Hardwoods like ipe are extremely dense, so pre-drilling and carbide blades are essential.",
      ],
    },
    {
      heading: "Layout choices that change your material order",
      list: [
        "Diagonal installs run boards at 45°, which creates many angled cuts. Plan on 15% waste or more, and check whether the manufacturer requires 12 in joist spacing.",
        "Picture-frame borders add a perimeter ring of boards and extra miter cuts. Count the border boards separately and subtract that area from the field.",
        "Board length matters. If your deck is 16 ft long, buying 16 ft boards removes the butt joints entirely, while 12 ft boards force a seam on every row and add waste from offcuts.",
        "Stagger seams so adjacent rows never end on the same joist, and put every seam over the center of a joist so both board ends have solid support.",
        "Leave a 1/8 to 1/4 in gap between boards for drainage, or follow the manufacturer's gap for composite, which changes with temperature at installation.",
      ],
    },
    {
      heading: "What this estimate doesn't include",
      paragraphs: [
        "The calculator covers surface boards and a joist count. A complete material list for a ground-level or raised deck also needs the items below. Ask your supplier or the building department for span tables before you finalize any of them.",
      ],
      list: [
        "Footings, posts, and beams sized for your deck height, span, and soil.",
        "A ledger board with flashing if the deck attaches to the house, plus approved ledger fasteners.",
        "Joist hangers, blocking or bridging, and rim (band) boards around the perimeter.",
        "Deck screws: roughly 330–350 per 100 ft² for 5.5 in boards on 16 in centers (two screws at every joist crossing), or hidden fasteners sold by the box.",
        "Railing, balusters, and post caps where required, plus stairs and stringers.",
        "Concrete for footings. Use the concrete calculator to size each footing hole.",
      ],
    },
    {
      heading: "Permits, railings, and code basics",
      paragraphs: [
        "Requirements vary by city and county, so treat the points below as common patterns rather than rules for your property. Many jurisdictions require a permit for attached decks, for decks more than about 30 in above grade, or for decks above a certain area such as 200 ft². Inspections are usually required at the footing and framing stages.",
        "In the United States, the International Residential Code requires guardrails on walking surfaces more than 30 in above the ground, with a minimum height of 36 in for residential guards. Stair rails, baluster spacing, and landing sizes have their own rules. A short call to your local building department before you buy lumber can save a failed inspection later.",
      ],
    },
  ],
  faqs: [
    {
      question: "How much waste should I add for decking?",
      answer:
        "10% is typical for a simple rectangular deck. Diagonal patterns, picture-frame borders, or decks with many cutouts often need 15% or more.",
    },
    {
      question: "What joist spacing should I use?",
      answer:
        "16 in on-center is standard for most composite and wood decking. Some composite manufacturers require 12 in spacing for diagonal installs or specific board types — always check the manufacturer's span table.",
    },
    {
      question: "Does this calculator include the substructure — posts, beams, and footings?",
      answer:
        "No, this calculator covers decking boards and joist count only. Posts, beams, and footings are sized separately based on deck height, span, and local building code.",
    },
    {
      question: "Should I leave gaps between decking boards?",
      answer:
        "Yes — typically 1/8 to 1/4 in between boards for drainage and material expansion, which this calculator does not subtract but is small enough to be absorbed by the waste allowance.",
    },
    {
      question: "How do I reduce seams in long deck runs?",
      answer:
        "Use the longest boards available for your run length and stagger the seams between rows so they don't line up, which also affects total board count slightly.",
    },
  ],
  related: [
    { slug: "fence-calculator", title: "Fence Calculator" },
    { slug: "concrete-calculator", title: "Concrete Calculator" },
    { slug: "paint-calculator", title: "Paint Calculator" },
  ],
  relatedGuides: [{ href: "/guides/deck-cost-breakdown", title: "Deck cost breakdown" }],
};
