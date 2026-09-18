import { CalculatorConfig } from "./types";

const CUBIC_FT_PER_CUBIC_YD = 27;
const LBS_PER_CUBIC_YD_GRAVEL = 2800; // ~1.4 tons per yd³, standard crushed gravel density

export const gravelCalculator: CalculatorConfig = {
  slug: "gravel-calculator",
  title: "Gravel Calculator",
  category: "Landscaping",
  intro:
    "Estimate how many cubic yards of gravel you need for a driveway, walkway, or drainage bed based on the area's length, width, and depth.",
  fields: [
    { key: "length", label: "Length", unit: "ft", type: "number", placeholder: "20", min: 0, step: 0.5 },
    { key: "width", label: "Width", unit: "ft", type: "number", placeholder: "10", min: 0, step: 0.5 },
    {
      key: "depth",
      label: "Depth",
      unit: "in",
      type: "number",
      placeholder: "4",
      min: 0,
      step: 0.5,
      helperText: "Most driveways use 4–6 in of gravel depth.",
    },
  ],
  wastePercentOptions: [5, 10, 15],
  wastePercentDefault: 10,
  calculate: (inputs, wastePercent) => {
    const { length, width, depth } = inputs;
    const areaSqFt = length * width;
    const depthFt = depth / 12;
    const volumeCubicFt = areaSqFt * depthFt;
    const volumeCubicYd = volumeCubicFt / CUBIC_FT_PER_CUBIC_YD;
    const withWasteCubicYd = volumeCubicYd * (1 + wastePercent / 100);
    const recommendedOrder = Math.ceil(withWasteCubicYd);
    const estimatedWeightTons = (recommendedOrder * LBS_PER_CUBIC_YD_GRAVEL) / 2000;
    const volumeCubicM = volumeCubicYd * 0.7646;

    return {
      primaryValue: volumeCubicYd.toFixed(2),
      primaryUnit: "yd³",
      primaryExplanation: "Estimated gravel volume needed",
      secondary: [
        { label: `With ${wastePercent}% waste`, value: `${withWasteCubicYd.toFixed(2)} yd³` },
        { label: "Recommended order", value: `${recommendedOrder} yd³` },
        { label: "Estimated weight", value: `~${estimatedWeightTons.toFixed(1)} tons` },
      ],
      breakdown: [
        { label: "Area", value: `${areaSqFt.toFixed(0)} ft²` },
        { label: `Volume (${areaSqFt.toFixed(0)} × ${depthFt.toFixed(2)} ft)`, value: `${volumeCubicFt.toFixed(1)} ft³` },
        { label: "Converted to yd³", value: `${volumeCubicYd.toFixed(2)} yd³` },
        { label: `With ${wastePercent}% waste`, value: `${withWasteCubicYd.toFixed(2)} yd³` },
        { label: "Recommended order", value: `${recommendedOrder} yd³`, note: "Rounded up to the nearest yard" },
      ],
      conversion: `= ${volumeCubicM.toFixed(2)} m³`,
    };
  },
  methodology:
    "Volume is calculated as length × width × depth, converted from cubic feet to cubic yards (27 ft³ per yd³). Weight assumes standard crushed gravel at approximately 2,800 lb per cubic yard — actual density varies by material type and compaction. We add your selected waste percentage to cover uneven ground, spillage, and compaction, then round up to the nearest full yard since most suppliers sell by the yard.",
  example:
    "A 20 ft × 10 ft driveway at 4 in deep needs 2.47 yd³ of gravel. With 10% waste that's 2.72 yd³, so order 3 yd³ — about 4.2 tons.",
  faqs: [
    {
      question: "How deep should a gravel driveway be?",
      answer:
        "Most residential gravel driveways use 4–6 inches of gravel over a compacted base. Heavier vehicle traffic or soft soil may need 8–12 inches across multiple layers.",
    },
    {
      question: "How much does a cubic yard of gravel weigh?",
      answer:
        "Roughly 2,700–2,900 lb (about 1.35–1.45 tons), depending on the gravel type and how compacted it is.",
    },
    {
      question: "Why does the calculator round up my order?",
      answer:
        "Suppliers typically sell gravel by the full or half cubic yard, and a small buffer covers uneven sub-grade and settling after delivery.",
    },
    {
      question: "Does this work for other materials like sand or crushed stone?",
      answer:
        "The volume math is the same, but weight estimates assume standard gravel density. For sand or crushed stone, treat the weight figure as approximate.",
    },
    {
      question: "Should I subtract the area under structures like a shed?",
      answer:
        "Yes — measure only the area that will actually be covered in gravel, excluding any structures, plantings, or existing hardscape.",
    },
  ],
  related: [
    { slug: "driveway-calculator", title: "Driveway Calculator" },
    { slug: "topsoil-calculator", title: "Topsoil Calculator" },
    { slug: "paver-calculator", title: "Paver Calculator" },
  ],
};
