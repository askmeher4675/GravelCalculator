import { CalculatorConfig } from "./types";

export const SQ_FT_PER_GALLON = 350; // typical coverage for one coat of interior/exterior paint

const DOOR_SQ_FT = 20;
const WINDOW_SQ_FT = 15;

/** Gallons of paint for a given wall area, using the calculator's coverage and rounding assumptions. */
function gallonsFor(areaSqFt: number, coats: number, wastePercent: number) {
  return (areaSqFt * coats * (1 + wastePercent / 100)) / SQ_FT_PER_GALLON;
}

const ROOM_SIZES: [number, number][] = [
  [10, 10],
  [12, 12],
  [12, 14],
  [14, 16],
  [16, 20],
];

const ROOM_ROWS = ROOM_SIZES.map(([l, w]) => {
  const perimeter = 2 * (l + w);
  const area = perimeter * 8;
  return [
    `${l} × ${w} ft`,
    `${perimeter} ft`,
    `${area} ft²`,
    `${gallonsFor(area, 1, 10).toFixed(1)} gal`,
    `${gallonsFor(area, 2, 10).toFixed(1)} gal`,
  ];
});

// Worked example: a 12 × 14 ft room with 8 ft walls, one door, and two windows.
const EXAMPLE_AREA = 2 * (12 + 14) * 8;
const EXAMPLE_OPENINGS = DOOR_SQ_FT + 2 * WINDOW_SQ_FT;
const EXAMPLE_NET_AREA = EXAMPLE_AREA - EXAMPLE_OPENINGS;

export const paintCalculator: CalculatorConfig = {
  slug: "paint-calculator",
  title: "Paint Calculator",
  category: "Painting",
  intro:
    "Estimate how many gallons of paint you need for a room or wall based on the total wall length, height, and number of coats.",
  metaDescription:
    "Paint calculator for rooms and walls. Enter wall length, height, and number of coats to get the gallons of paint you need to buy.",
  fields: [
    {
      key: "wallLength",
      label: "Total wall length",
      unit: "ft",
      type: "number",
      placeholder: "60",
      min: 0,
      step: 1,
      helperText: "Add up the length of every wall you're painting (the room's perimeter).",
    },
    { key: "wallHeight", label: "Wall height", unit: "ft", type: "number", placeholder: "8", min: 0, step: 0.5 },
    {
      key: "coats",
      label: "Number of coats",
      unit: "coats",
      type: "number",
      placeholder: "2",
      min: 1,
      step: 1,
      helperText: "Most walls need 2 coats for even, opaque coverage.",
    },
  ],
  wastePercentOptions: [0, 10],
  wastePercentDefault: 10,
  wasteHelperText: "Covers cutting-in, touch-ups, and second-coat overlap. 10% works for most rooms.",
  calculate: (inputs, wastePercent) => {
    const { wallLength, wallHeight, coats } = inputs;
    const wallAreaSqFt = wallLength * wallHeight;
    const totalAreaWithCoats = wallAreaSqFt * coats;
    const totalAreaWithWaste = totalAreaWithCoats * (1 + wastePercent / 100);
    const gallonsNeeded = totalAreaWithWaste / SQ_FT_PER_GALLON;
    const recommendedGallons = Math.ceil(gallonsNeeded * 4) / 4; // rounded to nearest quart

    return {
      primaryValue: gallonsNeeded.toFixed(2),
      primaryUnit: "gallons",
      primaryExplanation: "Estimated paint needed",
      secondary: [
        { label: "Wall area", value: `${wallAreaSqFt.toFixed(0)} ft²` },
        { label: `Area for ${coats} coat${coats === 1 ? "" : "s"}`, value: `${totalAreaWithCoats.toFixed(0)} ft²` },
        { label: "Recommended purchase", value: `${recommendedGallons.toFixed(2)} gal` },
      ],
      breakdown: [
        { label: `Wall area (${wallLength.toFixed(0)} × ${wallHeight.toFixed(1)} ft)`, value: `${wallAreaSqFt.toFixed(0)} ft²` },
        { label: `Total coverage for ${coats} coat${coats === 1 ? "" : "s"}`, value: `${totalAreaWithCoats.toFixed(0)} ft²` },
        { label: `With ${wastePercent}% waste`, value: `${totalAreaWithWaste.toFixed(0)} ft²` },
        { label: `Coverage at ${SQ_FT_PER_GALLON} ft² per gallon`, value: `${gallonsNeeded.toFixed(2)} gal` },
        { label: "Recommended purchase", value: `${recommendedGallons.toFixed(2)} gal`, note: "Rounded up to the nearest quart" },
      ],
    };
  },
  methodology:
    "Wall area is calculated as total wall length × height. This calculator does not automatically subtract doors and windows, so for more precision subtract roughly 20 ft² per standard door and 15 ft² per standard window from your wall length × height total. That area is multiplied by the number of coats, then divided by standard paint coverage of 350 ft² per gallon (actual coverage varies by paint brand, sheen, and surface texture). We add your selected waste percentage for cutting-in, touch-ups, and uneven surfaces, then round up to the nearest quart.",
  example:
    "A room with 60 ft of wall length at 8 ft high has 480 ft² of wall area. For 2 coats with 10% waste, that's 1,056 ft², needing about 3.02 gallons — round up to 3.25 gallons (the nearest quart).",
  sections: [
    {
      heading: "How much paint common room sizes need",
      paragraphs: [
        "These figures assume 8 ft walls, 350 ft² of coverage per gallon, and a 10% waste allowance, with no deduction for doors or windows. One coat suits a refresh in a similar color, and two coats is the standard for a new color or fresh drywall.",
      ],
      table: {
        headers: ["Room size", "Wall length", "Wall area", "1 coat", "2 coats"],
        rows: ROOM_ROWS,
        note: "Paint is sold in quarts, gallons, and 5-gallon pails, so round up. Ceilings, trim, and doors are estimated separately.",
      },
    },
    {
      heading: "Measuring walls and subtracting openings",
      paragraphs: [
        `Add up the length of every wall you will paint and multiply by the ceiling height. For openings, a standard interior door is about ${DOOR_SQ_FT} ft² and an average window is about ${WINDOW_SQ_FT} ft². Subtract them from the total only if they are large, since small openings are covered by the waste allowance.`,
        `Here is a worked example. A 12 × 14 ft room with 8 ft walls has ${EXAMPLE_AREA} ft² of wall area. With one door and two windows, you subtract ${EXAMPLE_OPENINGS} ft² and paint ${EXAMPLE_NET_AREA} ft². For two coats with 10% waste, the calculator needs ${gallonsFor(EXAMPLE_NET_AREA, 2, 10).toFixed(2)} gallons instead of ${gallonsFor(EXAMPLE_AREA, 2, 10).toFixed(2)} gallons without the deduction. Rounded up to the nearest quart, that is ${(Math.ceil(gallonsFor(EXAMPLE_NET_AREA, 2, 10) * 4) / 4).toFixed(2)} gallons versus ${(Math.ceil(gallonsFor(EXAMPLE_AREA, 2, 10) * 4) / 4).toFixed(2)} gallons, so subtracting openings saves about a quart in this room.`,
        "Don't subtract openings when you have a lot of trim, built-ins, or rough surfaces. Large windows still need painted frames, and recesses add surface that flat measurements ignore.",
      ],
    },
    {
      heading: "Coverage varies by surface",
      paragraphs: [
        "The 350 ft² per gallon used here is a typical figure for one coat on a smooth, previously painted wall. Porous or rough surfaces absorb more paint, so your real coverage can be much lower.",
      ],
      table: {
        headers: ["Surface", "Typical coverage per gallon", "Why it changes"],
        rows: [
          ["Smooth, previously painted drywall", "350–400 ft²", "Sealed surface; best case"],
          ["New drywall with primer", "300–350 ft²", "Primer evens out absorption"],
          ["New, unprimed drywall", "200–300 ft²", "Paper and joint compound soak up the first coat"],
          ["Textured walls or ceilings", "200–300 ft²", "More surface area and deeper valleys"],
          ["Rough stucco, brick, or masonry", "100–200 ft²", "Very porous; may need a block filler"],
        ],
        note: "Check the coverage printed on the can, which differs by brand, sheen, and color.",
      },
    },
    {
      heading: "When you need primer",
      paragraphs: [
        "Primer seals porous surfaces, blocks stains, and helps the finish coat grip. It is worth the extra step on bare drywall and patched areas, on glossy surfaces after light sanding, over water or smoke stains, and when you are covering a dark color with a light one.",
        "Tinting the primer toward your final color often saves a coat when you are making a big color change. Be wary of paint-and-primer-in-one products over stains or strong colors. They are usually just thicker paint, so you may still need a dedicated primer and two topcoats. Buy primer separately and estimate it with the same wall area, using the coverage listed on its label.",
      ],
    },
    {
      heading: "Choosing a sheen",
      table: {
        headers: ["Sheen", "Best for", "Trade-off"],
        rows: [
          ["Flat or matte", "Ceilings, low-traffic rooms", "Hides flaws but is harder to wipe clean"],
          ["Eggshell", "Living rooms, bedrooms", "Gentle glow with moderate washability"],
          ["Satin", "Hallways, kids' rooms, family areas", "Easy to clean, shows more roller marks"],
          ["Semi-gloss", "Trim, doors, kitchens, baths", "Durable and moisture-resistant, highlights imperfections"],
          ["Gloss", "Accent doors, cabinets, furniture", "Very durable and reflective; needs careful prep"],
        ],
      },
    },
    {
      heading: "Ceilings, trim, and doors",
      paragraphs: [
        "Estimate the ceiling by multiplying room length by width, and use a dedicated ceiling paint that spatters less. A 12 × 14 ft ceiling is 168 ft², so one coat takes roughly half a gallon, and two coats take about a gallon.",
        `Trim and doors are usually painted in semi-gloss and are bought by the quart. A standard door is about ${DOOR_SQ_FT} ft² per side, so both sides with two coats uses around ${DOOR_SQ_FT * 2 * 2} ft², close to one quart. Baseboards, window casings, and crown molding in an average room usually take about a quart for two coats.`,
      ],
    },
    {
      heading: "Buying and using the paint well",
      list: [
        "Buy all the paint for one room at the same time, and mix multiple gallons together (called boxing) so slight batch differences don't show on the wall.",
        "Keep a labeled quart of leftover paint for touch-ups, with the color name, sheen, and room written on the lid.",
        "Prep is the biggest factor in a good result: fill holes, sand glossy spots, clean grease or dust, and tape off trim before you open the can.",
        "Paint with the room ventilated and above the temperature printed on the can, since many latex paints won't cure properly below roughly 50°F.",
        "Cut in the edges first, then roll the wall while the edge is still wet to avoid visible lap marks.",
      ],
    },
  ],
  faqs: [
    {
      question: "How much wall area does a gallon of paint cover?",
      answer:
        "Most paints cover 300–400 ft² per gallon for one coat on a smooth, primed surface. Textured walls, unprimed drywall, or darker color changes may reduce coverage significantly.",
    },
    {
      question: "Do I need to subtract doors and windows from my wall area?",
      answer:
        "For a precise estimate, yes — subtract about 20 ft² per standard door and 15 ft² per standard window. This calculator's waste buffer helps absorb small omissions, but large openings should be subtracted manually.",
    },
    {
      question: "How many coats of paint do I need?",
      answer:
        "Two coats are standard for even coverage and true color, especially over a different existing color. A single coat may work with high-hiding paint over a similar base color, and dramatic color changes may need a primer coat plus two topcoats.",
    },
    {
      question: "Should I buy paint in gallons or quarts?",
      answer:
        "Gallons are more cost-effective for most rooms. Quarts make sense for small accent walls, touch-ups, or testing a color before committing to a full gallon.",
    },
    {
      question: "Does ceiling paint need to be calculated separately?",
      answer:
        "Yes — ceilings use a different area (length × width of the room) and often a different paint formulated for ceilings, so calculate that coverage separately from wall paint.",
    },
  ],
  related: [
    { slug: "deck-calculator", title: "Deck Calculator" },
    { slug: "fence-calculator", title: "Fence Calculator" },
    { slug: "concrete-calculator", title: "Concrete Calculator" },
  ],
};
