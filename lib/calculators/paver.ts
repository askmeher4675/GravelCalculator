import { CalculatorConfig } from "./types";

const SQ_IN_PER_SQ_FT = 144;

export const paverCalculator: CalculatorConfig = {
  slug: "paver-calculator",
  title: "Paver Calculator",
  category: "Landscaping",
  intro:
    "Estimate how many pavers you need for a patio or walkway based on the area size and the dimensions of a single paver.",
  metaDescription:
    "Paver calculator for patios and walkways. Enter the area size and your paver's dimensions to get the number of pavers to order.",
  fields: [
    { key: "length", label: "Area length", unit: "ft", type: "number", placeholder: "12", min: 0, step: 0.5 },
    { key: "width", label: "Area width", unit: "ft", type: "number", placeholder: "10", min: 0, step: 0.5 },
    {
      key: "paverArea",
      label: "Paver size",
      unit: "in²",
      type: "number",
      placeholder: "96",
      min: 0,
      step: 0.5,
      helperText: "Multiply the paver's length × width in inches (e.g. a 12 in × 8 in paver is 96 in²).",
    },
  ],
  wastePercentOptions: [5, 10, 15],
  wastePercentDefault: 10,
  wasteHelperText: "Covers cuts, breakage, and edge trimming. 10% works for most simple layouts.",
  calculate: (inputs, wastePercent) => {
    const { length, width, paverArea } = inputs;
    const areaSqFt = length * width;
    const areaSqIn = areaSqFt * SQ_IN_PER_SQ_FT;
    const paversNeeded = areaSqIn / paverArea;
    const withWaste = paversNeeded * (1 + wastePercent / 100);
    const recommendedOrder = Math.ceil(Number(withWaste.toFixed(2)));
    const paverAreaSqFt = paverArea / SQ_IN_PER_SQ_FT;

    return {
      primaryValue: Math.ceil(paversNeeded).toString(),
      primaryUnit: "pavers",
      primaryExplanation: "Estimated pavers needed to cover the area",
      secondary: [
        { label: `With ${wastePercent}% waste`, value: `${recommendedOrder} pavers` },
        { label: "Recommended order", value: `${recommendedOrder} pavers` },
        { label: "Coverage per paver", value: `${paverAreaSqFt.toFixed(2)} ft²` },
      ],
      breakdown: [
        { label: "Area to cover", value: `${areaSqFt.toFixed(0)} ft² (${areaSqIn.toFixed(0)} in²)` },
        { label: "Paver footprint", value: `${paverArea.toFixed(0)} in²` },
        { label: "Pavers needed (no waste)", value: `${paversNeeded.toFixed(1)} pavers` },
        { label: `With ${wastePercent}% waste`, value: `${withWaste.toFixed(1)} pavers` },
        { label: "Recommended order", value: `${recommendedOrder} pavers`, note: "Rounded up to the nearest whole paver" },
      ],
    };
  },
  methodology:
    "The area to cover (length × width, converted to square inches) is divided by the footprint of a single paver to get the base paver count. We add your selected waste percentage to account for cuts along edges, borders, and breakage, then round up to the nearest whole paver. This estimate assumes a simple running or basket-weave layout without a border course, which may need extra full pavers.",
  example:
    "A 12 ft × 10 ft patio using 12 in × 8 in (96 in²) pavers needs about 180 pavers. With 10% waste for cuts and breakage, order 198 pavers.",
  faqs: [
    {
      question: "How much extra should I order for cuts and breakage?",
      answer:
        "5–10% is typical for a simple rectangular layout. Complex patterns, curved edges, or herringbone layouts often need 10–15% extra.",
    },
    {
      question: "Do I need extra pavers for a border or edge course?",
      answer:
        "Yes — a soldier-course border is usually calculated separately as its own linear run of pavers along the perimeter, in addition to the field pavers from this calculator.",
    },
    {
      question: "How thick should the paver base be?",
      answer:
        "Most patios use 4–6 in of compacted gravel base plus 1 in of bedding sand beneath the pavers. Driveways typically need 6–8 in of base for vehicle loads.",
    },
    {
      question: "What paver pattern uses the least waste?",
      answer:
        "A simple running bond or stack bond pattern with rectangular pavers typically produces the least waste, since fewer cuts are needed at the edges.",
    },
    {
      question: "How do I find my paver's size if I only know the name?",
      answer:
        "Check the manufacturer's spec sheet — common sizes include 12 in × 12 in (144 in²), 12 in × 8 in (96 in²), and 6 in × 6 in (36 in²), but sizes vary by brand.",
    },
  ],
  related: [
    { slug: "gravel-calculator", title: "Gravel Calculator" },
    { slug: "concrete-calculator", title: "Concrete Calculator" },
    { slug: "deck-calculator", title: "Deck Calculator" },
  ],
};
