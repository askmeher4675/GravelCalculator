import { CalculatorConfig } from "./types";

const CUBIC_FT_PER_CUBIC_YD = 27;
const LBS_PER_CUBIC_YD_TOPSOIL = 2200; // ~81 lb/ft³, typical for moist screened topsoil

export const topsoilCalculator: CalculatorConfig = {
  slug: "topsoil-calculator",
  title: "Topsoil Calculator",
  category: "Lawn & Garden",
  intro:
    "Estimate how many cubic yards of topsoil you need to fill a garden bed, raised bed, or level a section of lawn.",
  fields: [
    { key: "length", label: "Length", unit: "ft", type: "number", placeholder: "12", min: 0, step: 0.5 },
    { key: "width", label: "Width", unit: "ft", type: "number", placeholder: "6", min: 0, step: 0.5 },
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
  calculate: (inputs, wastePercent) => {
    const { length, width, depth } = inputs;
    const areaSqFt = length * width;
    const depthFt = depth / 12;
    const volumeCubicFt = areaSqFt * depthFt;
    const volumeCubicYd = volumeCubicFt / CUBIC_FT_PER_CUBIC_YD;
    const withWasteCubicYd = volumeCubicYd * (1 + wastePercent / 100);
    const recommendedOrder = Math.ceil(withWasteCubicYd);
    const estimatedWeightTons = (recommendedOrder * LBS_PER_CUBIC_YD_TOPSOIL) / 2000;
    const volumeCubicM = volumeCubicYd * 0.7646;

    return {
      primaryValue: volumeCubicYd.toFixed(2),
      primaryUnit: "yd³",
      primaryExplanation: "Estimated topsoil volume needed",
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
    "Volume is calculated as length × width × depth, converted from cubic feet to cubic yards (27 ft³ per yd³). Weight assumes moist, screened topsoil at approximately 2,200 lb per cubic yard — actual density varies with moisture content and soil composition. We add your selected waste percentage to cover settling and uneven grading, then round up to the nearest full yard since most suppliers sell topsoil by the yard.",
  example:
    "A 12 ft × 6 ft raised bed area at 6 in deep needs 1.33 yd³ of topsoil. With 10% waste that's 1.47 yd³, so order 2 yd³ — about 2.2 tons.",
  faqs: [
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
