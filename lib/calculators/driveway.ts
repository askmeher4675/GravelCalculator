import { CalculatorConfig } from "./types";
import { SHAPES, shapeAreaSqFt, shapeAreaFormulaLabel, shapeLabel } from "./shapeArea";
import { CUBIC_FT_PER_CUBIC_YD, withWaste, roundUpToIncrement } from "./volumeModel";

export const LBS_PER_CUBIC_YD_AGGREGATE = 2800; // ~1.4 tons per yd³, standard crushed base/gravel
const ORDER_INCREMENT_YD = 0.1; // suggested order rounds up to the nearest 0.1 yd³

const DRIVEWAY_SIZES: [string, number, number][] = [
  ["Single-car, short", 10, 20],
  ["Single-car, standard", 10, 40],
  ["Double-wide, short", 20, 30],
  ["Double-wide, long", 20, 50],
  ["Long single-lane", 12, 100],
];

/** Total yd³ and tons for a 4 in base plus 2 in surface layer with 10% waste. */
function drivewayQuantities(length: number, width: number) {
  const areaSqFt = length * width;
  const rawYd = (areaSqFt * ((4 + 2) / 12)) / CUBIC_FT_PER_CUBIC_YD;
  const wasteYd = withWaste(rawYd, 10);
  return { areaSqFt, wasteYd, tons: (wasteYd * LBS_PER_CUBIC_YD_AGGREGATE) / 2000 };
}

const DRIVEWAY_ROWS = DRIVEWAY_SIZES.map(([label, w, l]) => {
  const q = drivewayQuantities(l, w);
  return [`${label} (${l} × ${w} ft)`, `${q.areaSqFt} ft²`, `${q.wasteYd.toFixed(1)} yd³`, `${q.tons.toFixed(1)} tons`];
});

// Worked cost example: a 50 × 12 ft driveway at an example price of $40 per ton.
const COST_EXAMPLE = drivewayQuantities(50, 12);
const COST_EXAMPLE_PRICE = 40;

export const drivewayCalculator: CalculatorConfig = {
  slug: "driveway-calculator",
  title: "Driveway Calculator",
  category: "Landscaping",
  intro:
    "Estimate the total gravel volume for a driveway built with a compacted base layer and a top surface layer.",
  metaDescription:
    "Driveway gravel calculator. Enter driveway length, width, base depth, and surface depth to get total gravel volume and estimated weight.",
  fields: [
    {
      key: "shape",
      label: "Driveway shape",
      unit: "",
      type: "select",
      helperText: "Most driveways are rectangular or tapered; use trapezoid for a driveway that widens toward the street.",
      options: SHAPES.map((s) => ({ value: s.id, label: s.label })),
    },
    {
      key: "length",
      label: "Length",
      unit: "ft",
      type: "number",
      placeholder: "50",
      min: 0,
      step: 0.5,
      visibleIf: { field: "shape", equals: 1 },
    },
    {
      key: "width",
      label: "Width",
      unit: "ft",
      type: "number",
      placeholder: "12",
      min: 0,
      step: 0.5,
      visibleIf: { field: "shape", equals: 1 },
    },
    {
      key: "diameter",
      label: "Diameter",
      unit: "ft",
      type: "number",
      placeholder: "30",
      min: 0,
      step: 0.5,
      helperText: "Measure straight across a circular turnaround pad.",
      visibleIf: { field: "shape", equals: 2 },
    },
    {
      key: "base",
      label: "Base",
      unit: "ft",
      type: "number",
      placeholder: "40",
      min: 0,
      step: 0.5,
      visibleIf: { field: "shape", equals: 3 },
    },
    {
      key: "triangleHeight",
      label: "Height",
      unit: "ft",
      type: "number",
      placeholder: "20",
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
      placeholder: "45",
      min: 0,
      step: 0.5,
      helperText: "Measure across the outside edge of a circular loop driveway.",
      visibleIf: { field: "shape", equals: 4 },
    },
    {
      key: "innerDiameter",
      label: "Inner diameter",
      unit: "ft",
      type: "number",
      placeholder: "25",
      min: 0,
      step: 0.5,
      helperText: "Measure across the inside edge — the island the loop circles.",
      visibleIf: { field: "shape", equals: 4 },
    },
    {
      key: "lengthA",
      label: "Side A",
      unit: "ft",
      type: "number",
      placeholder: "20",
      min: 0,
      step: 0.5,
      helperText: "The wider end, e.g. the street side.",
      visibleIf: { field: "shape", equals: 5 },
    },
    {
      key: "lengthB",
      label: "Side B",
      unit: "ft",
      type: "number",
      placeholder: "12",
      min: 0,
      step: 0.5,
      helperText: "The narrower end, e.g. the garage side.",
      visibleIf: { field: "shape", equals: 5 },
    },
    {
      key: "trapWidth",
      label: "Length",
      unit: "ft",
      type: "number",
      placeholder: "50",
      min: 0,
      step: 0.5,
      helperText: "Distance between side A and side B.",
      visibleIf: { field: "shape", equals: 5 },
    },
    {
      key: "baseDepth",
      label: "Base layer depth",
      unit: "in",
      type: "number",
      placeholder: "4",
      min: 0,
      step: 0.5,
      helperText: "Compacted crushed stone base — most driveways use 4–6 in.",
    },
    {
      key: "surfaceDepth",
      label: "Surface layer depth",
      unit: "in",
      type: "number",
      placeholder: "2",
      min: 0,
      step: 0.5,
      helperText: "Top gravel layer for finish and drainage — typically 2 in.",
    },
  ],
  wastePercentOptions: [5, 10, 15],
  wastePercentDefault: 10,
  wasteHelperText: "Covers compaction, spillage, and uneven sub-grade. 10% works for most driveways.",
  calculate: (inputs, wastePercent) => {
    const { shape, baseDepth, surfaceDepth } = inputs;
    const areaSqFt = shapeAreaSqFt(shape, inputs);
    const baseVolumeCubicFt = areaSqFt * (baseDepth / 12);
    const surfaceVolumeCubicFt = areaSqFt * (surfaceDepth / 12);

    // Single source of truth: raw volume -> waste-adjusted volume -> suggested order.
    // Weight is ALWAYS derived from the waste-adjusted volume, never the rounded order.
    const rawVolumeCubicFt = baseVolumeCubicFt + surfaceVolumeCubicFt;
    const rawVolumeCubicYd = rawVolumeCubicFt / CUBIC_FT_PER_CUBIC_YD;
    const wasteAdjustedCubicYd = withWaste(rawVolumeCubicYd, wastePercent);
    const suggestedOrderYd = roundUpToIncrement(wasteAdjustedCubicYd, ORDER_INCREMENT_YD);
    const estimatedWeightTons = (wasteAdjustedCubicYd * LBS_PER_CUBIC_YD_AGGREGATE) / 2000;

    return {
      primaryValue: rawVolumeCubicYd.toFixed(2),
      primaryUnit: "yd³",
      primaryExplanation: "Total material required (base + surface)",
      secondary: [
        { label: `With ${wastePercent}% waste`, value: `${wasteAdjustedCubicYd.toFixed(2)} yd³` },
        { label: "Suggested order", value: `${suggestedOrderYd.toFixed(1)} yd³` },
        { label: "Estimated weight", value: `~${estimatedWeightTons.toFixed(2)} tons` },
      ],
      breakdown: [
        { label: `${shapeAreaFormulaLabel(shape, inputs)} · ${shapeLabel(shape)}`, value: `${areaSqFt.toFixed(0)} ft²` },
        { label: `Base layer (${baseDepth.toFixed(1)} in)`, value: `${(baseVolumeCubicFt / CUBIC_FT_PER_CUBIC_YD).toFixed(2)} yd³` },
        { label: `Surface layer (${surfaceDepth.toFixed(1)} in)`, value: `${(surfaceVolumeCubicFt / CUBIC_FT_PER_CUBIC_YD).toFixed(2)} yd³` },
        { label: "Required (base + surface)", value: `${rawVolumeCubicYd.toFixed(2)} yd³` },
        { label: `With ${wastePercent}% waste`, value: `${wasteAdjustedCubicYd.toFixed(2)} yd³` },
        { label: `Weight (~${LBS_PER_CUBIC_YD_AGGREGATE} lb/yd³, incl. waste)`, value: `${estimatedWeightTons.toFixed(2)} tons` },
        { label: "Suggested order", value: `${suggestedOrderYd.toFixed(1)} yd³`, note: `Rounded up to the nearest ${ORDER_INCREMENT_YD} yd³, base and surface combined` },
      ],
    };
  },
  methodology:
    "Area is calculated from the shape you select — rectangle (length × width), circle (π × radius²), triangle (½ × base × height), circular ring (π × (outer radius² − inner radius²)) for a circular loop driveway, or trapezoid (average of the two parallel sides × length) for a driveway that tapers between the street and garage. Base and surface layer volumes are calculated separately (area × depth in feet) and then summed to get the exact volume required, since driveways are typically built with a compacted crushed-stone base topped by a finer surface layer. That required volume is converted to cubic yards (27 ft³ per yd³), then your selected waste percentage is added to cover compaction, spillage, and uneven sub-grade. Weight and the suggested order are both calculated from that same waste-adjusted volume — weight assumes standard crushed aggregate at approximately 2,800 lb per cubic yard, and the suggested order rounds up to the nearest 0.1 yd³.",
  example:
    "A 50 ft × 12 ft driveway with a 4 in base and 2 in surface layer needs 11.11 yd³ total. With 10% waste that's 12.22 yd³ — about 17.11 tons — so suggested order is 12.3 yd³.",
  sections: [
    {
      heading: "Gravel needed for common driveway sizes",
      paragraphs: [
        "The table assumes a 4 in compacted base plus a 2 in surface layer, 10% waste, and crushed aggregate at about 2,800 lb per cubic yard. These are quantities for the gravel only. Heavier traffic or soft soil calls for a deeper base, which you can enter in the calculator.",
      ],
      table: {
        headers: ["Driveway", "Area", "Gravel with waste", "Weight"],
        rows: DRIVEWAY_ROWS,
        note: "Delivery trucks carry a limited load, so a long driveway may need several trips. Ask your supplier for the truck capacity in tons.",
      },
    },
    {
      heading: "The layers of a gravel driveway",
      paragraphs: [
        "A durable gravel driveway is built in layers, from large and coarse at the bottom to small and fine on top. Stone names differ by region, so ask your supplier for the product they use for a driveway base and the one they use for a driving surface.",
      ],
      table: {
        headers: ["Layer", "Typical depth", "Typical material", "Purpose"],
        rows: [
          ["Geotextile fabric (optional)", "—", "Woven or non-woven fabric", "Keeps soft soil from mixing into the stone"],
          ["Sub-base (soft soil only)", "6–12 in", "Large crushed stone, e.g. #3 or #4", "Spreads load over weak ground"],
          ["Base", "4–6 in", "Crusher run or dense-grade aggregate", "Compacts into a firm, stable foundation"],
          ["Surface", "2 in", "Smaller angular stone, e.g. #57 or fines", "Smooth, drivable top layer"],
        ],
        note: "Use angular crushed stone rather than rounded river gravel, which doesn't lock together and shifts under tires.",
      },
    },
    {
      heading: "Compaction, drainage, and crown",
      list: [
        "Compact each layer separately with a plate compactor, in lifts of no more than about 4 in at a time. A base that isn't compacted will rut within the first season.",
        "Build in a crown, so the center is higher than the edges, or a one-way cross slope. A fall of about 1/4 to 1/2 in per foot of width sheds water. On a 12 ft driveway with a center crown, that's a rise of roughly 1.5 to 3 in at the middle.",
        "Direct runoff away from the driveway with ditches, culverts, or a swale. Standing water softens the base and washes out the surface.",
        "Make the driveway wide enough to use. About 10 ft is the minimum for one lane, 12 ft is more comfortable, and two cars side by side need about 18 to 20 ft. Some localities set minimum widths for emergency vehicle access.",
        "Compaction squeezes loose stone down, so the finished layers end up thinner than the loose depth you spread. The 10% waste setting covers a typical base. On soft ground, or with a deep base, switch to 15%.",
      ],
    },
    {
      heading: "Estimating cost",
      paragraphs: [
        `Cost is the total weight of the gravel times the price per ton, plus delivery. Using the table above, a 50 × 12 ft driveway needs about ${COST_EXAMPLE.tons.toFixed(1)} tons. At an example price of $${COST_EXAMPLE_PRICE} per ton, that's about $${Math.round(COST_EXAMPLE.tons * COST_EXAMPLE_PRICE).toLocaleString("en-US")} for the stone before delivery, taxes, and any fabric or equipment rental. Actual prices vary widely by region and stone type, so get two or three quotes.`,
        "Delivery fees are often a flat fee or a charge per load, so ordering all the stone in as few loads as practical saves money. Ask whether the price includes spreading, and whether your driveway can carry the truck's weight without damage.",
      ],
    },
    {
      heading: "Maintaining a gravel driveway",
      table: {
        headers: ["Task", "How often", "Notes"],
        rows: [
          ["Rake or drag to refill ruts and level the surface", "Every few months, or after storms", "A landscape rake or a drag bar works"],
          ["Fill potholes", "As they appear", "Add matching stone and compact it"],
          ["Add a fresh surface layer", "Every 2–4 years", "Usually about 1–2 in"],
          ["Control weeds", "Each spring", "A well-compacted base reduces weeds, and fabric helps"],
          ["Clear snow", "As needed", "Raise the plow blade about an inch to avoid scraping up stone"],
        ],
      },
    },
  ],
  faqs: [
    {
      question: "My driveway isn't a simple rectangle — can this calculator still handle it?",
      answer:
        "Yes. Use the \"Driveway shape\" dropdown to switch to circle (a turnaround pad), triangle, circular ring (a loop driveway around an island), or trapezoid (a driveway that widens toward the street). Each shape shows the measurements it needs and the area formula used is shown in the breakdown.",
    },
    {
      question: "How many layers does a gravel driveway need?",
      answer:
        "Most gravel driveways use two layers: a 4–6 in compacted base of larger crushed stone (such as #3 or #4 stone, or crusher run) for structure, and a 2 in top layer of smaller, more finished gravel for a smooth driving surface.",
    },
    {
      question: "Can I order the base and surface layers separately?",
      answer:
        "Yes — some suppliers deliver different gravel grades for base and surface separately. This calculator shows each layer's volume individually in the breakdown so you can order them as separate loads if needed.",
    },
    {
      question: "How often does a gravel driveway need new material?",
      answer:
        "Expect to add a fresh top layer every 2–4 years depending on traffic and weather, as surface gravel gradually migrates, compacts, or washes away.",
    },
    {
      question: "Should the driveway be crowned or sloped?",
      answer:
        "Yes — a slight crown or cross-slope (about 1/2 in per foot of width, roughly 4%) helps water drain off the surface instead of pooling, which extends the driveway's lifespan.",
    },
    {
      question: "Does this work for asphalt or concrete driveways?",
      answer:
        "No — this calculator is for gravel driveways specifically. For a poured concrete driveway, use the Concrete Calculator with your driveway's dimensions and slab thickness.",
    },
  ],
  related: [
    { slug: "gravel-calculator", title: "Gravel Calculator" },
    { slug: "concrete-calculator", title: "Concrete Calculator" },
    { slug: "paver-calculator", title: "Paver Calculator" },
  ],
  relatedGuides: [{ href: "/guides/gravel-driveway", title: "How much gravel for a driveway" }],
};
