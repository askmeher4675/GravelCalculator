import { CalculatorConfig } from "./types";
import { SHAPES, shapeAreaSqFt, shapeAreaFormulaLabel, shapeLabel } from "./shapeArea";
import { rawVolume, withWaste, roundUpToIncrement } from "./volumeModel";

export const LBS_PER_CUBIC_YD_TOPSOIL = 2200; // ~81 lb/ft³, typical for moist screened topsoil
const ORDER_INCREMENT_YD = 0.1; // suggested order rounds up to the nearest 0.1 yd³

/** Cubic yards to cover an area to a depth, before waste. */
function yardsFor(areaSqFt: number, depthIn: number) {
  return (areaSqFt * (depthIn / 12)) / 27;
}

const fmt = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(1));

const COVERAGE_ROWS = [1, 2, 3, 4, 6, 8, 12].map((d) => {
  const per100 = yardsFor(100, d);
  return [
    `${d} in`,
    `${fmt(27 / (d / 12))} ft²`,
    `${per100.toFixed(2)} yd³`,
    `${((per100 * LBS_PER_CUBIC_YD_TOPSOIL) / 2000).toFixed(2)} tons`,
  ];
});

// Worked example: a 4 × 8 ft raised bed filled 12 in deep with a 70/30 topsoil and compost blend, 10% settling.
const BED_YD = yardsFor(4 * 8, 12);
const BED_ORDER_YD = BED_YD * 1.1;
const BED_COMPOST_YD = BED_ORDER_YD * 0.3;
const BED_TOPSOIL_YD = BED_ORDER_YD * 0.7;

export const topsoilCalculator: CalculatorConfig = {
  slug: "topsoil-calculator",
  title: "Topsoil Calculator",
  category: "Lawn & Garden",
  intro:
    "Estimate how many cubic yards of topsoil you need to fill a garden bed, raised bed, or level a section of lawn.",
  metaDescription:
    "Topsoil calculator for garden beds and lawn leveling. Enter length, width, and depth to get the cubic yards of topsoil you need to order.",
  fields: [
    {
      key: "shape",
      label: "Bed shape",
      unit: "",
      type: "select",
      helperText: "Pick the shape that best matches your bed or the area you're leveling.",
      options: SHAPES.map((s) => ({ value: s.id, label: s.label })),
    },
    {
      key: "length",
      label: "Length",
      unit: "ft",
      type: "number",
      placeholder: "12",
      min: 0,
      step: 0.5,
      visibleIf: { field: "shape", equals: 1 },
    },
    {
      key: "width",
      label: "Width",
      unit: "ft",
      type: "number",
      placeholder: "6",
      min: 0,
      step: 0.5,
      visibleIf: { field: "shape", equals: 1 },
    },
    {
      key: "diameter",
      label: "Diameter",
      unit: "ft",
      type: "number",
      placeholder: "8",
      min: 0,
      step: 0.5,
      helperText: "Measure straight across the widest point, e.g. a round raised bed.",
      visibleIf: { field: "shape", equals: 2 },
    },
    {
      key: "base",
      label: "Base",
      unit: "ft",
      type: "number",
      placeholder: "10",
      min: 0,
      step: 0.5,
      visibleIf: { field: "shape", equals: 3 },
    },
    {
      key: "triangleHeight",
      label: "Height",
      unit: "ft",
      type: "number",
      placeholder: "6",
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
      placeholder: "10",
      min: 0,
      step: 0.5,
      helperText: "Measure across the outside edge of the ring-shaped bed.",
      visibleIf: { field: "shape", equals: 4 },
    },
    {
      key: "innerDiameter",
      label: "Inner diameter",
      unit: "ft",
      type: "number",
      placeholder: "4",
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
      placeholder: "12",
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
      placeholder: "6",
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
      placeholder: "6",
      min: 0,
      step: 0.5,
      helperText: "Distance between side A and side B.",
      visibleIf: { field: "shape", equals: 5 },
    },
    {
      key: "depth",
      label: "Depth",
      unit: "in",
      type: "number",
      placeholder: "6",
      min: 0,
      step: 0.5,
      helperText: "New garden beds typically use 6–12 in of topsoil.",
    },
  ],
  wastePercentOptions: [5, 10, 15],
  wastePercentDefault: 10,
  wasteHelperText: "Covers settling and uneven grading. 10% works for most beds and lawns.",
  calculate: (inputs, wastePercent) => {
    const { shape, depth } = inputs;
    const areaSqFt = shapeAreaSqFt(shape, inputs);
    const depthFt = depth / 12;

    // Single source of truth: raw volume -> waste-adjusted volume -> suggested order.
    // Weight is ALWAYS derived from the waste-adjusted volume.
    const { cubicFt: rawVolumeCubicFt, cubicYd: rawVolumeCubicYd } = rawVolume(areaSqFt, depthFt);
    const wasteAdjustedCubicYd = withWaste(rawVolumeCubicYd, wastePercent);
    const suggestedOrderYd = roundUpToIncrement(wasteAdjustedCubicYd, ORDER_INCREMENT_YD);
    const estimatedWeightTons = (wasteAdjustedCubicYd * LBS_PER_CUBIC_YD_TOPSOIL) / 2000;
    const rawVolumeCubicM = rawVolumeCubicYd * 0.7646;

    return {
      primaryValue: rawVolumeCubicYd.toFixed(2),
      primaryUnit: "yd³",
      primaryExplanation: "Estimated topsoil volume required",
      secondary: [
        { label: `With ${wastePercent}% waste`, value: `${wasteAdjustedCubicYd.toFixed(2)} yd³` },
        { label: "Suggested order", value: `${suggestedOrderYd.toFixed(1)} yd³` },
        { label: "Estimated weight", value: `~${estimatedWeightTons.toFixed(2)} tons` },
      ],
      breakdown: [
        { label: `${shapeAreaFormulaLabel(shape, inputs)} · ${shapeLabel(shape)}`, value: `${areaSqFt.toFixed(0)} ft²` },
        { label: `Volume (${areaSqFt.toFixed(0)} × ${depthFt.toFixed(2)} ft)`, value: `${rawVolumeCubicFt.toFixed(1)} ft³` },
        { label: "Required (converted to yd³)", value: `${rawVolumeCubicYd.toFixed(2)} yd³` },
        { label: `With ${wastePercent}% waste`, value: `${wasteAdjustedCubicYd.toFixed(2)} yd³` },
        { label: `Weight (~${LBS_PER_CUBIC_YD_TOPSOIL} lb/yd³, incl. waste)`, value: `${estimatedWeightTons.toFixed(2)} tons` },
        { label: "Suggested order", value: `${suggestedOrderYd.toFixed(1)} yd³`, note: `Rounded up to the nearest ${ORDER_INCREMENT_YD} yd³` },
      ],
      conversion: `= ${rawVolumeCubicM.toFixed(2)} m³`,
    };
  },
  methodology:
    "Area is calculated from the shape you select — rectangle (length × width), circle (π × radius²), triangle (½ × base × height), circular ring (π × (outer radius² − inner radius²)), or trapezoid (average of the two parallel sides × width). That area is multiplied by depth to get the exact volume required, converted from cubic feet to cubic yards (27 ft³ per yd³). Your selected waste percentage is added to cover settling and uneven grading, and weight is calculated from that same waste-adjusted volume — approximately 2,200 lb per cubic yard for moist, screened topsoil (actual density varies with moisture content and soil composition). The suggested order then rounds the waste-adjusted volume up to the nearest 0.1 yd³ since most suppliers sell topsoil by the yard.",
  example:
    "A 12 ft × 6 ft raised bed area at 6 in deep needs 1.33 yd³ of topsoil. With 10% waste that's 1.47 yd³ — about 1.61 tons — so suggested order is 1.5 yd³.",
  sections: [
    {
      heading: "How far a cubic yard of topsoil goes",
      paragraphs: [
        "One cubic yard is 27 cubic feet, so it covers 324 ft² at 1 in deep and proportionally less as you go deeper. Use this table to sanity-check your result or to estimate quickly before you measure precisely. Weights use the same 2,200 lb per cubic yard as the calculator.",
      ],
      table: {
        headers: ["Depth", "Area covered by 1 yd³", "Needed for 100 ft²", "Weight for 100 ft²"],
        rows: COVERAGE_ROWS,
        note: "Figures are before any settling allowance. Add 10–20% for compaction and uneven ground.",
      },
    },
    {
      heading: "How deep to spread topsoil by project",
      table: {
        headers: ["Project", "Typical depth", "Notes"],
        rows: [
          ["Top-dressing or overseeding an existing lawn", "1/4–1/2 in", "A thin layer worked into the grass, not a full layer"],
          ["Leveling low spots in a lawn", "1–2 in at a time", "Spread thin layers so the grass can grow up through them"],
          ["New lawn from sod or seed", "4–6 in total", "Count the existing soil you have already loosened"],
          ["Flower and shrub beds", "4–8 in", "Blend with compost for better structure"],
          ["Raised beds for vegetables", "8–12 in", "Root vegetables like carrots may need up to 18 in"],
        ],
        note: "These are typical ranges. Match depth to your plants and to how much good soil is already on site.",
      },
    },
    {
      heading: "Worked example: a raised bed with a soil and compost blend",
      paragraphs: [
        `A 4 × 8 ft raised bed filled 12 in deep holds ${BED_YD.toFixed(2)} yd³ (32 ft³). Adding 10% for settling brings the order to ${BED_ORDER_YD.toFixed(2)} yd³. If you blend 70% topsoil with 30% compost by volume, that is about ${BED_TOPSOIL_YD.toFixed(2)} yd³ of topsoil and ${BED_COMPOST_YD.toFixed(2)} yd³ of compost.`,
        "Beds this small are often easier to fill from bags. Bagged soil usually comes in 0.75 to 1 ft³ sacks, so a full cubic yard takes about 27 to 36 of them, and bulk delivery is usually cheaper once you need more than a yard or two.",
      ],
    },
    {
      heading: "What good topsoil looks like",
      list: [
        "Screened, so it's free of large rocks, roots, and clumps. Squeeze a handful: loam should crumble, not form a hard ball or stay loose like sand.",
        "Dark and earthy-smelling. A sour or chemical smell suggests poor composting or contamination.",
        "Free of weeds and weed seeds. Ask the supplier where it is sourced, because soil stripped from construction sites can contain buried debris or clay subsoil.",
        "Close to neutral pH. Most lawns and garden plants prefer roughly 6.0 to 7.0, and a basic soil test from your local extension office costs little.",
        'Labeled honestly. "Topsoil", "garden soil", and "fill dirt" are not interchangeable; fill dirt is fine for grading but won\'t grow plants well.',
      ],
    },
    {
      heading: "Preparing, delivering, and spreading",
      paragraphs: [
        "Loosen the existing soil 2 to 3 in deep before you add topsoil, so the new layer bonds to the old one instead of sitting on a hard pan that water can't cross. Rake out stones and clear debris first.",
        "Grade the finished surface so water flows away from your house. A common building-code guideline is a drop of at least 6 in over the first 10 ft from the foundation. Ask the driver to dump on a tarp or on a hard surface away from storm drains, and cover the pile if rain is forecast so it doesn't wash into the street.",
        "A standard 6 ft³ wheelbarrow holds less than a quarter of a cubic yard, so a 1 yd³ pile is roughly five loads. Plan the route for the wheelbarrow and pick a dry day to spread, because wet topsoil is much heavier and compacts more easily when walked on.",
      ],
    },
  ],
  faqs: [
    {
      question: "My bed isn't a rectangle — can this calculator still handle it?",
      answer:
        "Yes. Use the \"Bed shape\" dropdown to switch to circle, triangle, circular ring, or trapezoid. Each shape shows the measurements it needs and the area formula used is shown in the breakdown.",
    },
    {
      question: "How much topsoil do I need for a raised garden bed?",
      answer:
        "Most raised beds use 6–12 inches of topsoil, often blended with compost. Deeper beds for root vegetables may need up to 18 inches.",
    },
    {
      question: "How much does a cubic yard of topsoil weigh?",
      answer:
        "Roughly 2,000–2,700 lb (about 1–1.35 tons) depending on moisture content — wet topsoil can weigh significantly more than dry.",
    },
    {
      question: "Should I mix topsoil with compost?",
      answer:
        "Yes, many gardeners blend topsoil with 20–30% compost by volume to improve nutrients and drainage, especially for vegetable beds.",
    },
    {
      question: "How is topsoil different from garden soil or fill dirt?",
      answer:
        "Topsoil is the nutrient-rich top layer suited for planting, garden soil is topsoil blended with amendments, and fill dirt is subsoil used mainly for grading and leveling, not growing.",
    },
    {
      question: "Will topsoil settle after it's placed?",
      answer:
        "Yes, expect 10–20% settling as the soil compacts and water drains, which is why a waste/settling buffer is recommended when ordering.",
    },
  ],
  related: [
    { slug: "mulch-calculator", title: "Mulch Calculator" },
    { slug: "sod-calculator", title: "Sod Calculator" },
    { slug: "gravel-calculator", title: "Gravel Calculator" },
  ],
};
