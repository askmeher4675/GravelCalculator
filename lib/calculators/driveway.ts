import { CalculatorConfig } from "./types";
import { SHAPES, shapeAreaSqFt, shapeAreaFormulaLabel, shapeLabel } from "./shapeArea";
import { CUBIC_FT_PER_CUBIC_YD, withWaste, roundUpToIncrement } from "./volumeModel";

const LBS_PER_CUBIC_YD_AGGREGATE = 2800; // ~1.4 tons per yd³, standard crushed base/gravel
const ORDER_INCREMENT_YD = 0.1; // suggested order rounds up to the nearest 0.1 yd³

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
  faqs: [
    {
      question: "My driveway isn't a simple rectangle — can this calculator still handle it?",
      answer:
        "Yes. Use the \"Driveway shape\" dropdown to switch to circle (a turnaround pad), triangle, circular ring (a loop driveway around an island), or trapezoid (a driveway that widens toward the street). Each shape shows the measurements it needs and the area formula used is shown in the breakdown.",
    },
    {
      question: "How many layers does a gravel driveway need?",
      answer:
        "Most gravel driveways use two layers: a 4–6 in compacted base of larger crushed stone (like 3-4 in road base) for structure, and a 2 in top layer of smaller, more finished gravel for a smooth driving surface.",
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
        "Yes — a slight crown or cross-slope (about 1 in per foot of width) helps water drain off the surface instead of pooling, which extends the driveway's lifespan.",
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
