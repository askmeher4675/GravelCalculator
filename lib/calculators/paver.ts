import { CalculatorConfig } from "./types";
import { SHAPES, shapeAreaSqFt, shapeAreaFormulaLabel, shapeLabel } from "./shapeArea";

const SQ_IN_PER_SQ_FT = 144;

const COMMON_PAVERS: [string, number][] = [
  ["4 × 8 in brick", 4 * 8],
  ["6 × 6 in", 6 * 6],
  ["6 × 9 in", 6 * 9],
  ["12 × 8 in", 12 * 8],
  ["12 × 12 in", 12 * 12],
  ["16 × 16 in", 16 * 16],
  ["24 × 24 in", 24 * 24],
];

const PAVER_ROWS = COMMON_PAVERS.map(([label, areaIn2]) => {
  const per100 = (100 * SQ_IN_PER_SQ_FT) / areaIn2;
  return [label, `${areaIn2} in²`, Math.ceil(per100), Math.ceil(per100 * 1.1)];
});

// Worked example: a 12 × 10 ft patio, 4 in compacted base, 1 in bedding sand.
const PATIO_AREA_SQ_FT = 12 * 10;
const PATIO_BASE_YD = (PATIO_AREA_SQ_FT * (4 / 12)) / 27;
const PATIO_SAND_YD = (PATIO_AREA_SQ_FT * (1 / 12)) / 27;

export const paverCalculator: CalculatorConfig = {
  slug: "paver-calculator",
  title: "Paver Calculator",
  category: "Landscaping",
  intro:
    "Estimate how many pavers you need for a patio or walkway based on the area size and the dimensions of a single paver.",
  metaDescription:
    "Paver calculator for patios and walkways. Enter the area size and your paver's dimensions to get the number of pavers to order.",
  fields: [
    {
      key: "shape",
      label: "Area shape",
      unit: "",
      type: "select",
      helperText: "Pick the shape that best matches your patio or walkway.",
      options: SHAPES.map((s) => ({ value: s.id, label: s.label })),
    },
    {
      key: "length",
      label: "Area length",
      unit: "ft",
      type: "number",
      placeholder: "12",
      min: 0,
      step: 0.5,
      visibleIf: { field: "shape", equals: 1 },
    },
    {
      key: "width",
      label: "Area width",
      unit: "ft",
      type: "number",
      placeholder: "10",
      min: 0,
      step: 0.5,
      visibleIf: { field: "shape", equals: 1 },
    },
    {
      key: "diameter",
      label: "Diameter",
      unit: "ft",
      type: "number",
      placeholder: "10",
      min: 0,
      step: 0.5,
      helperText: "Measure straight across the widest point of a round patio.",
      visibleIf: { field: "shape", equals: 2 },
    },
    {
      key: "base",
      label: "Base",
      unit: "ft",
      type: "number",
      placeholder: "12",
      min: 0,
      step: 0.5,
      visibleIf: { field: "shape", equals: 3 },
    },
    {
      key: "triangleHeight",
      label: "Height",
      unit: "ft",
      type: "number",
      placeholder: "8",
      min: 0,
      step: 0.5,
      helperText: "Perpendicular distance from the base to the opposite point.",
      visibleIf: { field: "shape", equals: 3 },
    },
    {
      key: "outerDiameter",
      label: "Outer diameter",
      unit: "ft",
      type: "number",
      placeholder: "16",
      min: 0,
      step: 0.5,
      helperText: "Measure across the outside edge, e.g. a paver path circling a fire pit.",
      visibleIf: { field: "shape", equals: 4 },
    },
    {
      key: "innerDiameter",
      label: "Inner diameter",
      unit: "ft",
      type: "number",
      placeholder: "8",
      min: 0,
      step: 0.5,
      helperText: "Measure across the inside edge it circles.",
      visibleIf: { field: "shape", equals: 4 },
    },
    {
      key: "lengthA",
      label: "Side A",
      unit: "ft",
      type: "number",
      placeholder: "14",
      min: 0,
      step: 0.5,
      helperText: "The longer parallel side.",
      visibleIf: { field: "shape", equals: 5 },
    },
    {
      key: "lengthB",
      label: "Side B",
      unit: "ft",
      type: "number",
      placeholder: "8",
      min: 0,
      step: 0.5,
      helperText: "The shorter parallel side.",
      visibleIf: { field: "shape", equals: 5 },
    },
    {
      key: "trapWidth",
      label: "Width",
      unit: "ft",
      type: "number",
      placeholder: "10",
      min: 0,
      step: 0.5,
      helperText: "Distance between side A and side B.",
      visibleIf: { field: "shape", equals: 5 },
    },
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
    const { shape, paverArea } = inputs;
    const areaSqFt = shapeAreaSqFt(shape, inputs);
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
        { label: `${shapeAreaFormulaLabel(shape, inputs)} · ${shapeLabel(shape)}`, value: `${areaSqFt.toFixed(0)} ft² (${areaSqIn.toFixed(0)} in²)` },
        { label: "Paver footprint", value: `${paverArea.toFixed(0)} in²` },
        { label: "Pavers needed (no waste)", value: `${paversNeeded.toFixed(1)} pavers` },
        { label: `With ${wastePercent}% waste`, value: `${withWaste.toFixed(1)} pavers` },
        { label: "Recommended order", value: `${recommendedOrder} pavers`, note: "Rounded up to the nearest whole paver" },
      ],
    };
  },
  methodology:
    "Area is calculated from the shape you select — rectangle (length × width), circle (π × radius²), triangle (½ × base × height), circular ring (π × (outer radius² − inner radius²)), or trapezoid (average of the two parallel sides × width) — then converted to square inches and divided by the footprint of a single paver to get the base paver count. We add your selected waste percentage to account for cuts along edges, borders, and breakage, then round up to the nearest whole paver. This estimate assumes a simple running or basket-weave layout without a border course, which may need extra full pavers.",
  example:
    "A 12 ft × 10 ft patio using 12 in × 8 in (96 in²) pavers needs about 180 pavers. With 10% waste for cuts and breakage, order 198 pavers.",
  sections: [
    {
      heading: "Pavers needed per 100 square feet",
      paragraphs: [
        "If you know your paver size, this table gives a quick check on the calculator's output. The count is for 100 ft² of paved area, with and without a 10% allowance for cuts and breakage. Pavers are often priced and stocked by the square foot, so convert using the footprint if your supplier quotes that way.",
      ],
      table: {
        headers: ["Paver size", "Footprint", "Pavers per 100 ft²", "With 10% waste"],
        rows: PAVER_ROWS,
        note: "Actual dimensions vary by manufacturer, and many pavers have beveled edges or spacer lugs. Use the size on the spec sheet.",
      },
    },
    {
      heading: "Base and sand: what goes under the pavers",
      paragraphs: [
        "A paver patio is only as good as what is underneath it. The standard system is a compacted crushed-stone base, a thin screeded layer of bedding sand, the pavers, edge restraints, and joint sand swept between the stones.",
      ],
      table: {
        headers: ["Layer", "Patio or walkway", "Driveway"],
        rows: [
          ["Excavation depth", "7–9 in below finished height", "12–16 in below finished height"],
          ["Compacted base (crushed stone)", "4–6 in", "8–12 in"],
          ["Bedding sand", "1 in", "1 in"],
          ["Paver thickness", "2 3/8 in (60 mm) typical", "3 1/8 in (80 mm) typical"],
        ],
        note: "Soft clay, high water tables, and freezing climates call for a deeper base. Ask a local paver supplier what works in your area.",
      },
      after: [
        `For example, a 12 × 10 ft patio (${PATIO_AREA_SQ_FT} ft²) with a 4 in base needs about ${PATIO_BASE_YD.toFixed(2)} yd³ of crushed stone, and the 1 in sand layer needs about ${PATIO_SAND_YD.toFixed(2)} yd³. Compaction reduces the volume of loose stone, so order roughly 15–25% more base than the flat figure. Use the gravel calculator to size that order.`,
      ],
    },
    {
      heading: "Patterns and how much waste to expect",
      table: {
        headers: ["Pattern", "Typical waste", "Why"],
        rows: [
          ["Running bond or stack bond", "5–10%", "Mostly full pavers, with cuts only at the edges"],
          ["Basket weave", "5–10%", "Square groupings line up with simple edges"],
          ["Herringbone (45° or 90°)", "10–15%", "Every edge piece needs an angled cut"],
          ["Circular or curved layouts", "15–20%", "Cuts all around the curve"],
          ["Pavers with a soldier-course border", "Add a border count", "Count border pavers along the perimeter separately"],
        ],
        note: "Order everything from one production lot where you can, because slight color variation between lots can show.",
      },
    },
    {
      heading: "Borders, edge restraints, and drainage",
      list: [
        "A soldier course is a row of pavers set on end along the perimeter. Divide the perimeter in feet by the paver's width in feet to count them, and subtract those from the field area.",
        "Edge restraints are not optional. Without them the outer pavers drift outward and the joints open. Plastic, aluminum, or concrete restraints are staked or set along every free edge.",
        "Slope the surface away from the house about 1/4 in per foot (roughly 2%). On a 12 ft run, that is a 3 in drop. A flat patio holds water and heaves in frost.",
        "Sweep polymeric or fine kiln-dried sand into the joints after compacting, then sweep again after a few weeks as it settles. Check the bag for coverage, since it depends on paver size and joint width.",
      ],
    },
    {
      heading: "Planning checklist before you order",
      list: [
        "Mark the outline with stakes and string, then measure each section separately and add them. Subtract planters, fire pits, or anything you will leave unpaved.",
        "Pavers are typically sold by the pallet, and a pallet covers a fixed area. Ask for the exact square feet per pallet and round up to full pallets.",
        "Mix pavers from several pallets as you lay them. That blends color and texture variation instead of creating visible patches.",
        "Keep a few extra pavers from the same lot after the job for future repairs, since the same color may not be available later.",
        "Rent a plate compactor. Hand tamping does not reach the density a base needs to stay flat.",
      ],
    },
  ],
  relatedGuides: [{ href: "/guides/gravel-driveway", title: "How much gravel for a driveway (base depth)" }],
  faqs: [
    {
      question: "My patio isn't a rectangle — can this calculator still handle it?",
      answer:
        "Yes. Use the \"Area shape\" dropdown to switch to circle, triangle, circular ring, or trapezoid. Each shape shows the measurements it needs and the area formula used is shown in the breakdown.",
    },
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
