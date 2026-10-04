import { CalculatorConfig } from "./types";
import { SHAPES, shapeAreaSqFt, shapeAreaFormulaLabel, shapeLabel } from "./shapeArea";
import { rawVolume, withWaste, roundUpToIncrement } from "./volumeModel";

export const LBS_PER_CUBIC_YD_CONCRETE = 4050; // ~150 lb/ft³ for standard concrete
export const CUBIC_FT_PER_80LB_BAG = 0.6; // yield of one 80 lb bag of ready-mix
export const ORDER_INCREMENT_YD = 0.25; // ready-mix trucks are ordered in quarter-yard increments

const PROJECTS: [string, number, number, number][] = [
  ["Sidewalk", 20, 3, 4],
  ["Small landing or step pad", 4, 4, 4],
  ["Shed slab", 12, 10, 4],
  ["Patio", 12, 16, 4],
  ["Single-car driveway", 20, 10, 5],
  ["Two-car garage floor", 24, 24, 5],
];

const PROJECT_ROWS = PROJECTS.map(([label, l, w, thicknessIn]) => {
  const { cubicFt, cubicYd } = rawVolume(l * w, thicknessIn / 12);
  const adjustedYd = withWaste(cubicYd, 10);
  const bags = Math.ceil(withWaste(cubicFt, 10) / CUBIC_FT_PER_80LB_BAG);
  return [`${label} (${l} × ${w} ft, ${thicknessIn} in)`, `${cubicYd.toFixed(2)} yd³`, `${adjustedYd.toFixed(2)} yd³`, bags];
});

const BAG_ROWS = [
  [40, 0.3],
  [60, 0.45],
  [80, 0.6],
].map(([lb, yieldFt3]) => [`${lb} lb bag`, `${yieldFt3} ft³`, Math.ceil(27 / yieldFt3)]);

export const concreteCalculator: CalculatorConfig = {
  slug: "concrete-calculator",
  title: "Concrete Calculator",
  seoTitle: "Concrete Calculator: Yards, Bags & Cost Estimate",
  category: "Concrete & Masonry",
  intro:
    "Estimate how many cubic yards of ready-mix concrete — or how many 80 lb bags — you need for a slab, footing, or walkway.",
  metaDescription:
    "Concrete calculator for slabs, patios, footings and walkways. Get cubic yards or 80 lb bags, then add your price per yard for the concrete cost.",
  fields: [
    {
      key: "shape",
      label: "Slab shape",
      unit: "",
      type: "select",
      helperText: "Pick the shape that best matches your slab, footing, or walkway.",
      options: SHAPES.map((s) => ({ value: s.id, label: s.label })),
    },
    {
      key: "length",
      label: "Length",
      unit: "ft",
      type: "number",
      placeholder: "10",
      min: 0,
      step: 0.5,
      visibleIf: { field: "shape", equals: 1 },
    },
    {
      key: "width",
      label: "Width",
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
      helperText: "Measure straight across the widest point, e.g. a round pad or pool deck.",
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
      placeholder: "14",
      min: 0,
      step: 0.5,
      helperText: "Measure across the outside edge, e.g. a circular walkway around a fire pit.",
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
      helperText: "Measure across the inside edge, e.g. the fire pit or planting bed it circles.",
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
      key: "thickness",
      label: "Thickness",
      unit: "in",
      type: "number",
      placeholder: "4",
      min: 0,
      step: 0.5,
      helperText: "Most slabs use 4 in; driveways and footings often use 5–6 in.",
    },
    {
      key: "pricePerYd3",
      label: "Price per cubic yard",
      unit: "$/yd³",
      type: "number",
      placeholder: "150",
      min: 0,
      step: 5,
      optional: true,
      helperText: "Leave blank for quantities only. Enter your ready-mix price to see the concrete cost.",
    },
  ],
  wastePercentOptions: [5, 10, 15],
  wastePercentDefault: 10,
  wasteHelperText: "Covers spillage, uneven forms, and over-excavation. 10% works for most slabs.",
  calculate: (inputs, wastePercent) => {
    const { shape, thickness, pricePerYd3 } = inputs;
    const areaSqFt = shapeAreaSqFt(shape, inputs);
    const thicknessFt = thickness / 12;

    // Single source of truth: raw volume -> waste-adjusted volume -> suggested order.
    // Weight and bags are BOTH derived from the waste-adjusted volume, never the
    // rounded quarter-yard order (which is only a ready-mix-truck purchasing figure).
    const { cubicFt: rawVolumeCubicFt, cubicYd: rawVolumeCubicYd } = rawVolume(areaSqFt, thicknessFt);
    const wasteAdjustedCubicYd = withWaste(rawVolumeCubicYd, wastePercent);
    const wasteAdjustedCubicFt = withWaste(rawVolumeCubicFt, wastePercent);
    const suggestedOrderYd = roundUpToIncrement(wasteAdjustedCubicYd, ORDER_INCREMENT_YD);
    const bagsNeeded = Math.ceil(wasteAdjustedCubicFt / CUBIC_FT_PER_80LB_BAG);
    const estimatedWeightTons = (wasteAdjustedCubicYd * LBS_PER_CUBIC_YD_CONCRETE) / 2000;
    const rawVolumeCubicM = rawVolumeCubicYd * 0.7646;
    // Cost is derived from the waste-adjusted volume (never the rounded truck order), and only when a price was entered.
    const totalCost = pricePerYd3 && pricePerYd3 > 0 ? wasteAdjustedCubicYd * pricePerYd3 : null;

    return {
      ...(totalCost === null
        ? {
            primaryValue: rawVolumeCubicYd.toFixed(2),
            primaryUnit: "yd³",
            primaryExplanation: "Estimated concrete volume required",
          }
        : {
            primaryValue: `$${totalCost.toFixed(2)}`,
            primaryUnit: "",
            primaryExplanation: "Estimated concrete cost (includes waste)",
          }),
      secondary: [
        { label: `With ${wastePercent}% waste`, value: `${wasteAdjustedCubicYd.toFixed(2)} yd³` },
        { label: "Suggested order", value: `${suggestedOrderYd.toFixed(2)} yd³` },
        { label: "80 lb bags (alternative)", value: `${bagsNeeded} bags` },
      ],
      breakdown: [
        { label: `${shapeAreaFormulaLabel(shape, inputs)} · ${shapeLabel(shape)}`, value: `${areaSqFt.toFixed(0)} ft²` },
        { label: `Volume (${areaSqFt.toFixed(0)} × ${thicknessFt.toFixed(2)} ft)`, value: `${rawVolumeCubicFt.toFixed(1)} ft³` },
        { label: "Required (converted to yd³)", value: `${rawVolumeCubicYd.toFixed(2)} yd³` },
        { label: `With ${wastePercent}% waste`, value: `${wasteAdjustedCubicYd.toFixed(2)} yd³` },
        { label: `Weight (~150 lb/ft³, incl. waste)`, value: `${estimatedWeightTons.toFixed(2)} tons` },
        { label: `Bags at 0.6 ft³ each (incl. waste)`, value: `${bagsNeeded} bags` },
        { label: "Suggested order", value: `${suggestedOrderYd.toFixed(2)} yd³`, note: "Rounded up to the nearest quarter yard" },
        ...(totalCost === null
          ? []
          : [
              {
                label: `Cost (${wasteAdjustedCubicYd.toFixed(2)} yd³ × $${pricePerYd3.toFixed(2)}/yd³)`,
                value: `$${totalCost.toFixed(2)}`,
                note: "Concrete only. Delivery and short-load fees, forming, and finishing are extra",
              },
            ]),
      ],
      conversion: `= ${rawVolumeCubicM.toFixed(2)} m³`,
    };
  },
  methodology:
    "Area is calculated from the shape you select — rectangle (length × width), circle (π × radius²), triangle (½ × base × height), circular ring (π × (outer radius² − inner radius²)), or trapezoid (average of the two parallel sides × width). That area is multiplied by thickness to get the exact volume required, converted from cubic feet to cubic yards (27 ft³ per yd³). Your selected waste percentage is added to that required volume to get the waste-adjusted volume, and weight and bag count are both calculated from that same waste-adjusted volume — weight assumes standard concrete at approximately 150 lb per cubic foot, and the bag estimate assumes standard 80 lb bags of concrete mix, each yielding about 0.6 ft³ once mixed. Ready-mix trucks are typically ordered in quarter-yard increments, so the suggested order separately rounds the waste-adjusted volume up to the nearest quarter yard. If you enter a ready-mix price per cubic yard, the concrete cost is the waste-adjusted volume multiplied by that price. Leave the price blank to see quantities only.",
  example:
    "A 10 ft × 10 ft slab at 4 in thick needs 1.23 yd³ of concrete. With 10% waste that's 1.36 yd³ — about 2.75 tons, or 62 bags of 80 lb mix — so suggested order is 1.50 yd³ from a ready-mix truck. At $150 per cubic yard, the concrete itself costs about $203.70 before delivery fees.",
  sections: [
    {
      heading: "Concrete needed for common projects",
      paragraphs: [
        "These typical projects use the calculator's math: volume is area times thickness, with a 10% allowance for spillage and uneven forms. Bag counts assume 80 lb bags yielding about 0.6 ft³ each.",
      ],
      table: {
        headers: ["Project", "Exact volume", "With 10% waste", "80 lb bags"],
        rows: PROJECT_ROWS,
        note: "Orders for ready-mix are typically rounded up to the nearest quarter yard. Bags above about 60–90 become impractical to mix by hand.",
      },
    },
    {
      heading: "Bags or ready-mix truck?",
      paragraphs: [
        "Bagged mix is the right choice for small jobs such as a post footing, a step landing, or a small pad. Bags are easy to buy, but mixing takes time, and every batch is slightly different. Consistency matters for a large slab, because a pour that has to be finished all at once can't be paused for an hour while you mix the next batch.",
      ],
      table: {
        headers: ["Bag size", "Yield per bag", "Bags per cubic yard"],
        rows: BAG_ROWS,
      },
      after: [
        "As a rule of thumb, once a job needs more than about one cubic yard (45 bags of 80 lb mix), ready-mix delivered by truck is easier and usually costs less than the equivalent in bags once you count your time and the mixer. Short-load fees apply to small deliveries, so ask the supplier about their minimum and the price per yard, then enter that price in the calculator to see the cost of the concrete. Have forms, a screed board, a bull float, helpers, and wheelbarrows ready before the truck arrives, because drivers typically allow limited unloading time.",
      ],
    },
    {
      heading: "Thickness and strength by project",
      table: {
        headers: ["Project", "Typical thickness", "Typical strength"],
        rows: [
          ["Sidewalks and patios", "4 in", "3,000–3,500 psi"],
          ["Shed or hot tub pad", "4–6 in", "3,000–3,500 psi"],
          ["Residential driveways", "5–6 in", "3,500–4,000 psi"],
          ["Garage floors", "4–6 in", "3,500–4,000 psi"],
          ["Footings", "Depends on code and load", "Per engineer or local code"],
        ],
        note: "Strength figures are typical 28-day compressive strengths in pounds per square inch. Footings and structural pours should follow local building code or an engineer's design.",
      },
    },
    {
      heading: "Prepare the base before you order",
      list: [
        "Remove sod and topsoil down to firm soil, then compact the subgrade. Concrete placed over soft or organic soil cracks as it settles.",
        "Add 4 in of compacted gravel under slabs for drainage and a uniform bed. Use the gravel calculator to size that order. A level base also keeps the slab at a uniform thickness, so low spots don't swallow extra concrete.",
        "Set forms level and square with stakes every 2 to 3 ft. Slope patios and walkways about 1/8 to 1/4 in per foot away from the house for drainage.",
        "Add reinforcement such as welded wire mesh or rebar where your plan or local code calls for it, and keep it lifted into the middle of the slab on supports rather than lying on the ground.",
      ],
    },
    {
      heading: "Control joints and curing",
      paragraphs: [
        "Concrete shrinks as it cures, and it will crack somewhere. Control joints tell it where. A common rule of thumb is to space joints at two to three times the slab thickness in feet. For a 4 in slab, that is every 8 to 12 ft. Keep panels roughly square, and cut or tool joints about one-quarter of the slab depth.",
        "Curing matters as much as the pour. Keep the surface damp, covered, or sealed with a curing compound for about seven days so it can gain strength, and avoid pouring when temperatures are below about 40°F or above about 90°F unless you take precautions. Rain on a fresh surface weakens it, so check the forecast before the truck is scheduled.",
        "Wet concrete is caustic and can cause skin burns, so wear gloves, boots, and eye protection, and wash splashes off promptly.",
      ],
    },
  ],
  faqs: [
    {
      question: "How much does concrete cost for a slab?",
      answer:
        "Enter your supplier's ready-mix price per cubic yard and the calculator multiplies it by your waste-adjusted volume. That is the cost of the concrete only. Short-load fees for small deliveries, forming, gravel base, reinforcement, finishing, and labor are extra, so ask the supplier for a delivered price on your exact order.",
    },
    {
      question: "My slab isn't a rectangle — can this calculator still handle it?",
      answer:
        "Yes. Use the \"Slab shape\" dropdown to switch to circle, triangle, circular ring, or trapezoid. Each shape shows the measurements it needs and the area formula used is shown in the breakdown.",
    },
    {
      question: "How thick should a concrete slab be?",
      answer:
        "Most patios and walkways use 4 in of concrete. Driveways and areas with vehicle traffic typically need 5–6 in, and heavy-duty applications may need more with rebar reinforcement.",
    },
    {
      question: "How many 80 lb bags of concrete make a cubic yard?",
      answer:
        "About 45 bags of 80 lb concrete mix are needed to make one cubic yard, since each bag yields roughly 0.6 cubic feet of mixed concrete.",
    },
    {
      question: "Why is concrete ordered in quarter-yard increments?",
      answer:
        "Ready-mix trucks measure and bill by the cubic yard, and most suppliers can dispense in quarter-yard increments. Many also charge a short-load fee for orders under a full truck (often 9–10 yd³).",
    },
    {
      question: "Should I add extra for a footing or a slab with a thickened edge?",
      answer:
        "Yes — calculate the footing or edge separately as its own volume and add it to your slab total, since the calculator assumes a uniform thickness.",
    },
    {
      question: "Does this include rebar or wire mesh?",
      answer:
        "No, this calculator estimates concrete volume only. Reinforcement is typically sized separately based on the slab's span and load requirements.",
    },
  ],
  related: [
    { slug: "gravel-calculator", title: "Gravel Calculator" },
    { slug: "paver-calculator", title: "Paver Calculator" },
    { slug: "deck-calculator", title: "Deck Calculator" },
  ],
  relatedGuides: [
    { href: "/guides/concrete-slab-thickness", title: "Concrete slab thickness guide" },
    { href: "/guides/gravel-under-concrete-slab", title: "How much gravel under a concrete slab" },
    { href: "/guides/concrete-walkway-path", title: "How much concrete for a walkway or path" },
  ],
};
