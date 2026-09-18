import { CalculatorConfig } from "./types";

const CUBIC_FT_PER_CUBIC_YD = 27;
const LBS_PER_CUBIC_YD_AGGREGATE = 2800; // ~1.4 tons per yd³, standard crushed base/gravel

export const drivewayCalculator: CalculatorConfig = {
  slug: "driveway-calculator",
  title: "Driveway Calculator",
  category: "Landscaping",
  intro:
    "Estimate the total gravel volume for a driveway built with a compacted base layer and a top surface layer.",
  fields: [
    { key: "length", label: "Length", unit: "ft", type: "number", placeholder: "50", min: 0, step: 0.5 },
    { key: "width", label: "Width", unit: "ft", type: "number", placeholder: "12", min: 0, step: 0.5 },
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
  calculate: (inputs, wastePercent) => {
    const { length, width, baseDepth, surfaceDepth } = inputs;
    const areaSqFt = length * width;
    const baseVolumeCubicFt = areaSqFt * (baseDepth / 12);
    const surfaceVolumeCubicFt = areaSqFt * (surfaceDepth / 12);
    const totalVolumeCubicFt = baseVolumeCubicFt + surfaceVolumeCubicFt;
    const totalVolumeCubicYd = totalVolumeCubicFt / CUBIC_FT_PER_CUBIC_YD;
    const withWasteCubicYd = totalVolumeCubicYd * (1 + wastePercent / 100);
    const recommendedOrder = Math.ceil(withWasteCubicYd);
    const estimatedWeightTons = (recommendedOrder * LBS_PER_CUBIC_YD_AGGREGATE) / 2000;

    return {
      primaryValue: totalVolumeCubicYd.toFixed(2),
      primaryUnit: "yd³",
      primaryExplanation: "Total material needed (base + surface)",
      secondary: [
        { label: `With ${wastePercent}% waste`, value: `${withWasteCubicYd.toFixed(2)} yd³` },
        { label: "Recommended order", value: `${recommendedOrder} yd³` },
        { label: "Estimated weight", value: `~${estimatedWeightTons.toFixed(1)} tons` },
      ],
      breakdown: [
        { label: "Driveway area", value: `${areaSqFt.toFixed(0)} ft²` },
        { label: `Base layer (${baseDepth.toFixed(1)} in)`, value: `${(baseVolumeCubicFt / CUBIC_FT_PER_CUBIC_YD).toFixed(2)} yd³` },
        { label: `Surface layer (${surfaceDepth.toFixed(1)} in)`, value: `${(surfaceVolumeCubicFt / CUBIC_FT_PER_CUBIC_YD).toFixed(2)} yd³` },
        { label: "Total volume", value: `${totalVolumeCubicYd.toFixed(2)} yd³` },
        { label: `With ${wastePercent}% waste`, value: `${withWasteCubicYd.toFixed(2)} yd³` },
        { label: "Recommended order", value: `${recommendedOrder} yd³`, note: "Rounded up to the nearest yard, base and surface combined" },
      ],
    };
  },
  methodology:
    "Base and surface layer volumes are calculated separately (area × depth in feet) and then summed, since driveways are typically built with a compacted crushed-stone base topped by a finer surface layer. Both layers are converted to cubic yards (27 ft³ per yd³). Weight assumes standard crushed aggregate at approximately 2,800 lb per cubic yard. We add your selected waste percentage to cover compaction, spillage, and uneven sub-grade, then round the combined total up to the nearest full yard.",
  example:
    "A 50 ft × 12 ft driveway with a 4 in base and 2 in surface layer needs 3.33 yd³ total. With 10% waste that's 3.67 yd³, so order 4 yd³ — about 5.6 tons.",
  faqs: [
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
};
