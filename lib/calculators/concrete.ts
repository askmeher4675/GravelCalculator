import { CalculatorConfig } from "./types";
import { SHAPES, shapeAreaSqFt, shapeAreaFormulaLabel, shapeLabel } from "./shapeArea";

const CUBIC_FT_PER_CUBIC_YD = 27;
const LBS_PER_CUBIC_YD_CONCRETE = 4050; // ~150 lb/ft³ for standard concrete
const CUBIC_FT_PER_80LB_BAG = 0.6; // yield of one 80 lb bag of ready-mix

export const concreteCalculator: CalculatorConfig = {
  slug: "concrete-calculator",
  title: "Concrete Calculator",
  category: "Concrete & Masonry",
  intro:
    "Estimate how many cubic yards of ready-mix concrete — or how many 80 lb bags — you need for a slab, footing, or walkway.",
  metaDescription:
    "Concrete calculator for slabs, footings, and walkways. Enter length, width, and thickness to get cubic yards of ready-mix concrete or the number of 80 lb bags needed.",
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
  ],
  wastePercentOptions: [5, 10, 15],
  wastePercentDefault: 10,
  wasteHelperText: "Covers spillage, uneven forms, and over-excavation. 10% works for most slabs.",
  calculate: (inputs, wastePercent) => {
    const { shape, thickness } = inputs;
    const areaSqFt = shapeAreaSqFt(shape, inputs);
    const thicknessFt = thickness / 12;
    const volumeCubicFt = areaSqFt * thicknessFt;
    const volumeCubicYd = volumeCubicFt / CUBIC_FT_PER_CUBIC_YD;
    const withWasteCubicYd = volumeCubicYd * (1 + wastePercent / 100);
    const recommendedOrder = Math.ceil(withWasteCubicYd * 4) / 4; // ready-mix is ordered in quarter yards
    const bagsNeeded = Math.ceil((volumeCubicFt * (1 + wastePercent / 100)) / CUBIC_FT_PER_80LB_BAG);
    const estimatedWeightTons = (recommendedOrder * LBS_PER_CUBIC_YD_CONCRETE) / 2000;
    const volumeCubicM = volumeCubicYd * 0.7646;

    return {
      primaryValue: volumeCubicYd.toFixed(2),
      primaryUnit: "yd³",
      primaryExplanation: "Estimated concrete volume needed",
      secondary: [
        { label: `With ${wastePercent}% waste`, value: `${withWasteCubicYd.toFixed(2)} yd³` },
        { label: "Recommended order", value: `${recommendedOrder.toFixed(2)} yd³` },
        { label: "80 lb bags (alternative)", value: `${bagsNeeded} bags` },
      ],
      breakdown: [
        { label: `${shapeAreaFormulaLabel(shape, inputs)} · ${shapeLabel(shape)}`, value: `${areaSqFt.toFixed(0)} ft²` },
        { label: `Volume (${areaSqFt.toFixed(0)} × ${thicknessFt.toFixed(2)} ft)`, value: `${volumeCubicFt.toFixed(1)} ft³` },
        { label: "Converted to yd³", value: `${volumeCubicYd.toFixed(2)} yd³` },
        { label: `With ${wastePercent}% waste`, value: `${withWasteCubicYd.toFixed(2)} yd³` },
        { label: "Recommended order", value: `${recommendedOrder.toFixed(2)} yd³`, note: "Rounded up to the nearest quarter yard" },
        { label: "Estimated weight", value: `~${estimatedWeightTons.toFixed(2)} tons` },
      ],
      conversion: `= ${volumeCubicM.toFixed(2)} m³`,
    };
  },
  methodology:
    "Area is calculated from the shape you select — rectangle (length × width), circle (π × radius²), triangle (½ × base × height), circular ring (π × (outer radius² − inner radius²)), or trapezoid (average of the two parallel sides × width). That area is multiplied by thickness to get volume, converted from cubic feet to cubic yards (27 ft³ per yd³). Ready-mix trucks are typically ordered in quarter-yard increments, so the recommended order is rounded up accordingly. The bag estimate assumes standard 80 lb bags of concrete mix, each yielding about 0.6 ft³ once mixed. Weight assumes standard concrete at approximately 150 lb per cubic foot. We add your selected waste percentage to cover spillage, uneven forms, and over-excavation.",
  example:
    "A 10 ft × 10 ft slab at 4 in thick needs 1.23 yd³ of concrete. With 10% waste that's 1.36 yd³, so order 1.5 yd³ from a ready-mix truck — or about 62 bags of 80 lb mix.",
  faqs: [
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
  relatedGuides: [{ href: "/guides/concrete-slab-thickness", title: "Concrete slab thickness guide" }],
};
