import { CalculatorConfig } from "./types";
import { SHAPES, shapeAreaSqFt, shapeAreaFormulaLabel, shapeLabel } from "./shapeArea";

const CUBIC_FT_PER_CUBIC_YD = 27;
const LBS_PER_CUBIC_YD_MULCH = 500; // ~18.5 lb/ft³, typical for shredded bark mulch
const CUBIC_FT_PER_BAG = 2; // standard 2 cu ft mulch bag

export const mulchCalculator: CalculatorConfig = {
  slug: "mulch-calculator",
  title: "Mulch Calculator",
  category: "Lawn & Garden",
  intro:
    "Estimate how many cubic yards or bags of mulch you need for a garden bed or landscaping area based on size and depth.",
  metaDescription:
    "Mulch calculator for garden beds and landscaping. Enter length, width, and depth to get cubic yards of bulk mulch or the number of 2 ft³ bags needed.",
  fields: [
    {
      key: "shape",
      label: "Bed shape",
      unit: "",
      type: "select",
      helperText: "Pick the shape that best matches your garden bed or landscaping area.",
      options: SHAPES.map((s) => ({ value: s.id, label: s.label })),
    },
    {
      key: "length",
      label: "Length",
      unit: "ft",
      type: "number",
      placeholder: "15",
      min: 0,
      step: 0.5,
      visibleIf: { field: "shape", equals: 1 },
    },
    {
      key: "width",
      label: "Width",
      unit: "ft",
      type: "number",
      placeholder: "8",
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
      helperText: "Measure straight across the widest point, e.g. a round tree ring or bed.",
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
      helperText: "Measure across the outside edge, e.g. a mulch ring around a tree.",
      visibleIf: { field: "shape", equals: 4 },
    },
    {
      key: "innerDiameter",
      label: "Inner diameter",
      unit: "ft",
      type: "number",
      placeholder: "2",
      min: 0,
      step: 0.5,
      helperText: "Measure across the inside edge, e.g. the trunk clearance you're leaving.",
      visibleIf: { field: "shape", equals: 4 },
    },
    {
      key: "lengthA",
      label: "Side A",
      unit: "ft",
      type: "number",
      placeholder: "15",
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
      placeholder: "3",
      min: 0,
      step: 0.5,
      helperText: "Most garden beds use 2–3 in of mulch depth.",
    },
  ],
  wastePercentOptions: [5, 10, 15],
  wastePercentDefault: 10,
  wasteHelperText: "Covers settling, uneven ground, and spillage. 10% works for most garden beds.",
  calculate: (inputs, wastePercent) => {
    const { shape, depth } = inputs;
    const areaSqFt = shapeAreaSqFt(shape, inputs);
    const depthFt = depth / 12;
    const volumeCubicFt = areaSqFt * depthFt;
    const volumeCubicYd = volumeCubicFt / CUBIC_FT_PER_CUBIC_YD;
    const withWasteCubicYd = volumeCubicYd * (1 + wastePercent / 100);
    const recommendedOrder = Math.ceil(withWasteCubicYd);
    const bagsNeeded = Math.ceil((volumeCubicFt * (1 + wastePercent / 100)) / CUBIC_FT_PER_BAG);
    const estimatedWeightLbs = withWasteCubicYd * LBS_PER_CUBIC_YD_MULCH;
    const volumeCubicM = volumeCubicYd * 0.7646;

    return {
      primaryValue: volumeCubicYd.toFixed(2),
      primaryUnit: "yd³",
      primaryExplanation: "Estimated mulch volume needed",
      secondary: [
        { label: `With ${wastePercent}% waste`, value: `${withWasteCubicYd.toFixed(2)} yd³` },
        { label: "Recommended order (bulk)", value: `${recommendedOrder} yd³` },
        { label: "2 ft³ bags (alternative)", value: `${bagsNeeded} bags` },
      ],
      breakdown: [
        { label: `${shapeAreaFormulaLabel(shape, inputs)} · ${shapeLabel(shape)}`, value: `${areaSqFt.toFixed(0)} ft²` },
        { label: `Volume (${areaSqFt.toFixed(0)} × ${depthFt.toFixed(2)} ft)`, value: `${volumeCubicFt.toFixed(1)} ft³` },
        { label: "Converted to yd³", value: `${volumeCubicYd.toFixed(2)} yd³` },
        { label: `With ${wastePercent}% waste`, value: `${withWasteCubicYd.toFixed(2)} yd³` },
        { label: "Recommended order", value: `${recommendedOrder} yd³`, note: "Rounded up to the nearest yard for bulk delivery" },
        { label: "Estimated weight", value: `~${estimatedWeightLbs.toFixed(0)} lb` },
      ],
      conversion: `= ${volumeCubicM.toFixed(2)} m³`,
    };
  },
  methodology:
    "Area is calculated from the shape you select — rectangle (length × width), circle (π × radius²), triangle (½ × base × height), circular ring (π × (outer radius² − inner radius²)) for a mulch ring around a tree, or trapezoid (average of the two parallel sides × width). That area is multiplied by depth to get volume, converted from cubic feet to cubic yards (27 ft³ per yd³). Weight assumes standard shredded bark mulch at approximately 500 lb per cubic yard — actual density varies with moisture and mulch type. The bag estimate assumes standard 2 cubic foot bags. We add your selected waste percentage to cover settling, uneven ground, and spillage, then round up to the nearest full yard for bulk orders.",
  example:
    "A 15 ft × 8 ft garden bed at 3 in deep needs 1.11 yd³ of mulch. With 10% waste that's 1.22 yd³, so order 2 yd³ in bulk — or about 17 bags of 2 ft³ mulch.",
  faqs: [
    {
      question: "My bed isn't a rectangle — can this calculator still handle it?",
      answer:
        "Yes. Use the \"Bed shape\" dropdown to switch to circle, triangle, circular ring (for a mulch ring around a tree), or trapezoid. Each shape shows the measurements it needs and the area formula used is shown in the breakdown.",
    },
    {
      question: "How deep should mulch be in a garden bed?",
      answer:
        "Most garden beds use 2–3 inches of mulch. Going deeper than 4 inches can suffocate roots and trap excess moisture against plant stems.",
    },
    {
      question: "How many bags of mulch equal a cubic yard?",
      answer:
        "About 13–14 bags of 2 cubic foot mulch are needed to equal one cubic yard (27 ft³).",
    },
    {
      question: "Is bulk mulch cheaper than bagged mulch?",
      answer:
        "For larger areas (more than about 2–3 cubic yards), bulk mulch delivered by the yard is usually significantly cheaper per cubic foot than bagged mulch.",
    },
    {
      question: "Should I mulch right up against tree trunks or house siding?",
      answer:
        "No — leave a few inches of clearance around tree trunks and siding to prevent rot and pest issues, and exclude that area from your measurement.",
    },
    {
      question: "Does mulch need to be replaced every year?",
      answer:
        "Organic mulch typically breaks down and needs topping off annually, while a full fresh layer is often only needed every 2–3 years depending on the material.",
    },
  ],
  related: [
    { slug: "topsoil-calculator", title: "Topsoil Calculator" },
    { slug: "gravel-calculator", title: "Gravel Calculator" },
    { slug: "sod-calculator", title: "Sod Calculator" },
  ],
  relatedGuides: [{ href: "/guides/mulch-depth", title: "Mulch depth by plant type" }],
};
