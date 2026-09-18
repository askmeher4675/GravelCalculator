import { CalculatorConfig } from "./types";

const SQ_FT_PER_GALLON = 350; // typical coverage for one coat of interior/exterior paint

export const paintCalculator: CalculatorConfig = {
  slug: "paint-calculator",
  title: "Paint Calculator",
  category: "Painting",
  intro:
    "Estimate how many gallons of paint you need for a room or wall based on the total wall length, height, and number of coats.",
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
    "A room with 60 ft of wall length at 8 ft high has 480 ft² of wall area. For 2 coats with 10% waste, that's 1,056 ft², needing about 3.02 gallons — round up to 3 gallons.",
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
