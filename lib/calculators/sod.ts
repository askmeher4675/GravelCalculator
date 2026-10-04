import { CalculatorConfig } from "./types";
import { SHAPES, shapeAreaSqFt, shapeAreaFormulaLabel, shapeLabel } from "./shapeArea";

export const SQ_FT_PER_PALLET = 450; // standard sod pallet coverage
export const SQ_FT_PER_ROLL = 10; // standard large sod roll coverage
const SQ_FT_PER_SQ_YD = 9;

const LAWN_SIZES_SQ_FT = [500, 1000, 2500, 5000, 10000];

const LAWN_ROWS = LAWN_SIZES_SQ_FT.map((area) => {
  const withWaste = area * 1.05;
  return [
    `${area.toLocaleString("en-US")} ft²`,
    `${Math.round(withWaste / SQ_FT_PER_SQ_YD).toLocaleString("en-US")} yd²`,
    Math.ceil(withWaste / SQ_FT_PER_PALLET),
    Math.ceil(withWaste / SQ_FT_PER_ROLL),
  ];
});

export const sodCalculator: CalculatorConfig = {
  slug: "sod-calculator",
  title: "Sod Calculator",
  category: "Lawn & Garden",
  intro:
    "Estimate how much sod you need for a new lawn, in square feet, pallets, or rolls, based on the area's length and width.",
  metaDescription:
    "Sod calculator for new lawns. Enter your lawn's length and width to get the square footage, pallets, and rolls of sod you need.",
  fields: [
    {
      key: "shape",
      label: "Lawn shape",
      unit: "",
      type: "select",
      helperText: "Pick the shape that best matches your lawn or the area you're sodding.",
      options: SHAPES.map((s) => ({ value: s.id, label: s.label })),
    },
    {
      key: "length",
      label: "Length",
      unit: "ft",
      type: "number",
      placeholder: "40",
      min: 0,
      step: 0.5,
      visibleIf: { field: "shape", equals: 1 },
    },
    {
      key: "width",
      label: "Width",
      unit: "ft",
      type: "number",
      placeholder: "25",
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
      helperText: "Measure straight across the widest point of a round lawn area.",
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
      placeholder: "25",
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
      placeholder: "40",
      min: 0,
      step: 0.5,
      helperText: "Measure across the outside edge of the ring-shaped lawn area.",
      visibleIf: { field: "shape", equals: 4 },
    },
    {
      key: "innerDiameter",
      label: "Inner diameter",
      unit: "ft",
      type: "number",
      placeholder: "20",
      min: 0,
      step: 0.5,
      helperText: "Measure across the inside edge it circles, e.g. a driveway loop or bed.",
      visibleIf: { field: "shape", equals: 4 },
    },
    {
      key: "lengthA",
      label: "Side A",
      unit: "ft",
      type: "number",
      placeholder: "45",
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
      placeholder: "30",
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
      placeholder: "25",
      min: 0,
      step: 0.5,
      helperText: "Distance between side A and side B.",
      visibleIf: { field: "shape", equals: 5 },
    },
  ],
  wastePercentOptions: [5, 10],
  wastePercentDefault: 5,
  wasteHelperText: "Covers curves, obstacles, and edge trimming. 5% works for most rectangular lawns.",
  calculate: (inputs, wastePercent) => {
    const { shape } = inputs;
    const areaSqFt = shapeAreaSqFt(shape, inputs);
    const withWasteSqFt = areaSqFt * (1 + wastePercent / 100);
    const sqYd = withWasteSqFt / SQ_FT_PER_SQ_YD;
    const pallets = Math.ceil(withWasteSqFt / SQ_FT_PER_PALLET);
    const rolls = Math.ceil(withWasteSqFt / SQ_FT_PER_ROLL);

    return {
      primaryValue: areaSqFt.toFixed(0),
      primaryUnit: "ft²",
      primaryExplanation: "Lawn area to be sodded",
      secondary: [
        { label: `With ${wastePercent}% waste`, value: `${withWasteSqFt.toFixed(0)} ft²` },
        { label: "Pallets needed", value: `${pallets} pallet${pallets === 1 ? "" : "s"}` },
        { label: "Rolls needed (alternative)", value: `${rolls} rolls` },
      ],
      breakdown: [
        { label: `${shapeAreaFormulaLabel(shape, inputs)} · ${shapeLabel(shape)}`, value: `${areaSqFt.toFixed(0)} ft² (${sqYd.toFixed(1)} yd²)` },
        { label: `With ${wastePercent}% waste`, value: `${withWasteSqFt.toFixed(0)} ft²` },
        { label: "Pallets (≈450 ft² each)", value: `${pallets} pallet${pallets === 1 ? "" : "s"}`, note: "Rounded up to the nearest full pallet" },
        { label: "Large rolls (≈10 ft² each)", value: `${rolls} rolls` },
      ],
    };
  },
  methodology:
    "Area is calculated from the shape you select — rectangle (length × width), circle (π × radius²), triangle (½ × base × height), circular ring (π × (outer radius² − inner radius²)) for a lawn ring around a driveway loop or bed, or trapezoid (average of the two parallel sides × width). We add your selected waste percentage to cover irregular edges, curves, and cutting around obstacles like trees and beds. Pallet coverage assumes approximately 450 square feet per pallet and large-roll coverage assumes approximately 10 square feet per roll, though exact coverage varies by sod farm and grass variety.",
  example:
    "A 40 ft × 25 ft lawn is 1,000 ft². With 5% waste that's 1,050 ft², so order 3 pallets (up to 1,350 ft²) or 105 large rolls.",
  sections: [
    {
      heading: "Sod needed for common lawn sizes",
      paragraphs: [
        "Most suburban front and back lawns fall between a few hundred and several thousand square feet. The table uses the calculator's assumptions: 5% waste, about 450 ft² per pallet, and about 10 ft² per large roll. Always confirm coverage with your sod farm, since pallets and rolls differ by grower.",
      ],
      table: {
        headers: ["Lawn area", "Square yards (with 5% waste)", "Pallets", "Large rolls"],
        rows: LAWN_ROWS,
        note: "Pallets are always rounded up to a whole pallet, so you usually end up with some extra to use on edges and patches.",
      },
    },
    {
      heading: "Choosing a grass type",
      paragraphs: [
        "The right grass depends on your climate zone, how much sun the lawn gets, and how much traffic and maintenance you want. Ask your sod supplier which varieties are grown locally. Locally grown sod is fresher and usually already suited to your conditions.",
      ],
      table: {
        headers: ["Grass", "Type", "Best for", "Watch out for"],
        rows: [
          ["Kentucky bluegrass", "Cool-season", "Full sun, dense lawns, cold winters", "Needs regular water in summer heat"],
          ["Tall fescue", "Cool-season", "Mixed sun and light shade, drought tolerance", "Clumps instead of spreading"],
          ["Perennial ryegrass", "Cool-season", "Fast establishment, often blended", "Less tolerant of extreme cold or heat"],
          ["Bermuda", "Warm-season", "Full sun, heavy foot traffic, heat", "Goes dormant and brown in winter; poor in shade"],
          ["Zoysia", "Warm-season", "Dense turf, moderate shade", "Slow to establish"],
          ["St. Augustine", "Warm-season", "Shade tolerance, coastal areas", "Needs frequent water and doesn't tolerate heavy traffic"],
          ["Centipede", "Warm-season", "Low-maintenance lawns on acidic soil", "Doesn't recover well from heavy wear"],
        ],
        note: "Cool-season grasses grow best in the north and warm-season grasses in the south. A band of states in between, often called the transition zone, can grow either.",
      },
    },
    {
      heading: "When to lay sod",
      list: [
        "Cool-season grasses root best in early fall, when soil is warm and air is cool. Spring is the second-best window. Avoid midsummer heat.",
        "Warm-season grasses do best when laid in late spring through early summer, once soil temperatures stay warm. Laying them in late fall risks poor rooting before dormancy.",
        "Avoid frozen ground and drought periods, and don't lay sod if you can't water it consistently for the first two weeks.",
        "Schedule delivery for the morning you plan to lay it. Sod stacked on a pallet generates heat and can start to yellow within a day or two.",
      ],
    },
    {
      heading: "Preparing the soil and laying the sod",
      paragraphs: [
        "Good soil preparation does more than anything else to determine how fast sod roots. Kill or strip existing grass and weeds, then loosen the top 4 to 6 in of soil. Remove rocks and debris, and grade so the finished soil sits about 1 in below sidewalks and driveways. Sod is about an inch thick, and this keeps it flush with hard surfaces.",
        "Spread a thin layer of starter fertilizer and rake smooth. Lightly moisten the soil right before you lay the sod, but don't leave it muddy.",
        "Start along the longest straight edge, such as a driveway or walkway. Stagger the seams like bricks, push the edges tightly together without overlapping, and use a sharp knife to trim around beds and trees. Avoid stretching the pieces, and don't leave small slivers at the edges, since those dry out first. Roll the lawn lightly when you finish to press the roots against the soil.",
      ],
    },
    {
      heading: "Watering and first mowing",
      table: {
        headers: ["Time after installing", "What to do"],
        rows: [
          ["Right away", "Water thoroughly, until the soil underneath is wet to about 4 in"],
          ["Days 1–14", "Keep the sod and soil moist, usually by watering once or twice daily, more in hot or windy weather"],
          ["Weeks 2–3", "Reduce frequency but water more deeply. Gently tug a corner: if it resists, roots are taking hold"],
          ["Around week 2–3", "Mow for the first time once the grass is tall enough, and never remove more than one-third of the blade height"],
          ["After 4–6 weeks", "Switch to a normal deep, infrequent watering schedule and apply regular fertilizer"],
        ],
        note: "Keep foot traffic off for the first 2–3 weeks, and keep pets and mowers away until roots are anchored.",
      },
    },
    {
      heading: "Sod versus seed",
      table: {
        headers: ["", "Sod", "Seed"],
        rows: [
          ["Upfront cost", "Higher, often several times more per square foot", "Low"],
          ["Time to usable lawn", "Weeks", "Months, with careful watering"],
          ["Weeds and erosion on slopes", "Instantly covered", "Bare soil is vulnerable until it fills in"],
          ["Choice of grass types", "Limited to what farms grow", "Wide variety"],
          ["Best timing", "More flexible, apart from extreme heat or frost", "Narrow windows in spring or fall"],
        ],
        note: "Seed is a reasonable choice for large areas on a budget. Sod is worth the extra cost on slopes and high-visibility lawns.",
      },
    },
  ],
  faqs: [
    {
      question: "My lawn isn't a rectangle — can this calculator still handle it?",
      answer:
        "Yes. Use the \"Lawn shape\" dropdown to switch to circle, triangle, circular ring (for a lawn ring around a driveway loop or bed), or trapezoid. Each shape shows the measurements it needs and the area formula used is shown in the breakdown.",
    },
    {
      question: "How much does a pallet of sod cover?",
      answer:
        "Most sod pallets cover approximately 450 square feet, though this varies by supplier and grass type — always confirm coverage with your specific supplier before ordering.",
    },
    {
      question: "How much waste should I add for a lawn with curves or obstacles?",
      answer:
        "5% is typical for a simple rectangular lawn. Add 10% or more for yards with curved beds, trees, or irregular shapes that require more cutting.",
    },
    {
      question: "How soon after laying sod can I walk on it?",
      answer:
        "Avoid foot traffic for at least 2–3 weeks while roots establish. Light watering should begin immediately and continue daily for the first 1–2 weeks.",
    },
    {
      question: "Should I order sod as soon as I calculate my area?",
      answer:
        "No — sod is perishable and should be installed within 24 hours of harvest. Only order once you've prepared the soil and are ready to lay it the same day it arrives.",
    },
    {
      question: "How do I prepare the ground before laying sod?",
      answer:
        "Remove existing vegetation, till and level the soil, add 1–2 inches of topsoil or compost if needed, and lightly water the area right before installation.",
    },
  ],
  related: [
    { slug: "topsoil-calculator", title: "Topsoil Calculator" },
    { slug: "mulch-calculator", title: "Mulch Calculator" },
    { slug: "fence-calculator", title: "Fence Calculator" },
  ],
};
