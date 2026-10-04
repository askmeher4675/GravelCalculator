import { CalculatorConfig } from "./types";
import { SHAPES, shapeAreaSqFt, shapeAreaFormulaLabel, shapeLabel } from "./shapeArea";
import { rawVolume, withWaste, roundUpToIncrement } from "./volumeModel";

export const LBS_PER_CUBIC_YD_MULCH = 500; // ~18.5 lb/ft³, typical for shredded bark mulch
export const CUBIC_FT_PER_BAG = 2; // standard 2 cu ft mulch bag
const ORDER_INCREMENT_YD = 0.1; // suggested order rounds up to the nearest 0.1 yd³

const fmt = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(1));

const COVERAGE_ROWS = [1, 2, 3, 4].map((depthIn) => {
  const sqFtPerYd = 27 / (depthIn / 12);
  const sqFtPerBag = CUBIC_FT_PER_BAG / (depthIn / 12);
  const yd3Per100 = (100 * (depthIn / 12)) / 27;
  return [
    `${depthIn} in`,
    `${fmt(sqFtPerYd)} ft²`,
    `${fmt(sqFtPerBag)} ft²`,
    `${yd3Per100.toFixed(2)} yd³`,
    `${Math.ceil((100 * (depthIn / 12)) / CUBIC_FT_PER_BAG)} bags`,
  ];
});

// Worked example: a mulch ring around a tree, 6 ft across outside and 1 ft across at the trunk, 3 in deep, 10% waste.
const RING_AREA = Math.PI * (3 * 3 - 0.5 * 0.5);
const RING_FT3 = RING_AREA * (3 / 12) * 1.1;
const RING_BAGS = Math.ceil(RING_FT3 / CUBIC_FT_PER_BAG);

export const mulchCalculator: CalculatorConfig = {
  slug: "mulch-calculator",
  title: "Mulch Calculator",
  seoTitle: "Mulch Calculator: Cubic Yards & Bags for Any Bed",
  category: "Lawn & Garden",
  intro:
    "Estimate how many cubic yards or bags of mulch you need for a garden bed or landscaping area based on size and depth.",
  metaDescription:
    "Mulch calculator for garden beds and tree rings. Get cubic yards for bulk delivery or 2 ft³ bags at 2 to 4 inches deep, with coverage by depth.",
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

    // Single source of truth: raw volume -> waste-adjusted volume -> suggested order.
    // Weight and bags are BOTH derived from the waste-adjusted volume.
    const { cubicFt: rawVolumeCubicFt, cubicYd: rawVolumeCubicYd } = rawVolume(areaSqFt, depthFt);
    const wasteAdjustedCubicYd = withWaste(rawVolumeCubicYd, wastePercent);
    const wasteAdjustedCubicFt = withWaste(rawVolumeCubicFt, wastePercent);
    const suggestedOrderYd = roundUpToIncrement(wasteAdjustedCubicYd, ORDER_INCREMENT_YD);
    const bagsNeeded = Math.ceil(wasteAdjustedCubicFt / CUBIC_FT_PER_BAG);
    const estimatedWeightLbs = wasteAdjustedCubicYd * LBS_PER_CUBIC_YD_MULCH;
    const rawVolumeCubicM = rawVolumeCubicYd * 0.7646;

    return {
      primaryValue: rawVolumeCubicYd.toFixed(2),
      primaryUnit: "yd³",
      primaryExplanation: "Estimated mulch volume required",
      secondary: [
        { label: `With ${wastePercent}% waste`, value: `${wasteAdjustedCubicYd.toFixed(2)} yd³` },
        { label: "Suggested order (bulk)", value: `${suggestedOrderYd.toFixed(1)} yd³` },
        { label: "2 ft³ bags (alternative)", value: `${bagsNeeded} bags` },
      ],
      breakdown: [
        { label: `${shapeAreaFormulaLabel(shape, inputs)} · ${shapeLabel(shape)}`, value: `${areaSqFt.toFixed(0)} ft²` },
        { label: `Volume (${areaSqFt.toFixed(0)} × ${depthFt.toFixed(2)} ft)`, value: `${rawVolumeCubicFt.toFixed(1)} ft³` },
        { label: "Required (converted to yd³)", value: `${rawVolumeCubicYd.toFixed(2)} yd³` },
        { label: `With ${wastePercent}% waste`, value: `${wasteAdjustedCubicYd.toFixed(2)} yd³` },
        { label: "Weight (~500 lb/yd³, incl. waste)", value: `~${estimatedWeightLbs.toFixed(0)} lb` },
        { label: "Bags at 2 ft³ each (incl. waste)", value: `${bagsNeeded} bags` },
        { label: "Suggested order", value: `${suggestedOrderYd.toFixed(1)} yd³`, note: `Rounded up to the nearest ${ORDER_INCREMENT_YD} yd³ for bulk delivery` },
      ],
      conversion: `= ${rawVolumeCubicM.toFixed(2)} m³`,
    };
  },
  methodology:
    "Area is calculated from the shape you select — rectangle (length × width), circle (π × radius²), triangle (½ × base × height), circular ring (π × (outer radius² − inner radius²)) for a mulch ring around a tree, or trapezoid (average of the two parallel sides × width). That area is multiplied by depth to get the exact volume required, converted from cubic feet to cubic yards (27 ft³ per yd³). Your selected waste percentage is added to cover settling, uneven ground, and spillage, and weight and bag count are both calculated from that same waste-adjusted volume — weight assumes standard shredded bark mulch at approximately 500 lb per cubic yard (actual density varies with moisture and mulch type), and the bag estimate assumes standard 2 cubic foot bags. The suggested order then rounds that waste-adjusted volume up to the nearest 0.1 yd³ for bulk delivery.",
  example:
    "A 15 ft × 8 ft garden bed at 3 in deep needs 1.11 yd³ of mulch. With 10% waste that's 1.22 yd³ — about 611 lb, or 17 bags of 2 ft³ mulch — so suggested order is 1.3 yd³ in bulk.",
  sections: [
    {
      heading: "How much area mulch covers by depth",
      paragraphs: [
        "A cubic yard of mulch is 27 cubic feet. Spread 2 in deep it covers 162 ft², and at 3 in deep it covers 108 ft². The table also shows how far a standard 2 ft³ bag goes and how much you need for 100 ft², which makes a handy rule of thumb when you are shopping.",
      ],
      table: {
        headers: ["Depth", "1 yd³ covers", "One 2 ft³ bag covers", "Needed for 100 ft²", "Bags for 100 ft²"],
        rows: COVERAGE_ROWS,
        note: "Bag counts are before any waste allowance. Round up, because partial bags aren't sold.",
      },
    },
    {
      heading: "Choosing a type of mulch",
      table: {
        headers: ["Mulch", "Typical lifespan", "Best for", "Notes"],
        rows: [
          ["Shredded hardwood bark", "1–2 years", "General beds, slopes", "Knits together and stays put in rain"],
          ["Bark nuggets (pine or fir)", "2–4 years", "Foundation beds and tree rings", "Lasts longer but can float away in heavy rain"],
          ["Pine straw", "1–2 years", "Acid-loving plants, southern landscapes", "Lightweight and easy to spread on slopes"],
          ["Cedar or cypress", "2–3 years", "Visible beds", "Resists decay and has a distinct scent"],
          ["Compost", "Under a year", "Vegetable and flower beds", "Feeds the soil as it breaks down"],
          ["Rubber", "10+ years", "Play areas", "Doesn't improve soil and can get hot in direct sun"],
        ],
        note: "Lifespans are typical ranges. Organic mulches break down faster in hot, wet climates.",
      },
    },
    {
      heading: "Worked example: a mulch ring around a tree",
      paragraphs: [
        `A ring 6 ft across with a 1 ft clear zone around the trunk covers about ${RING_AREA.toFixed(1)} ft². At 3 in deep with 10% waste, that's ${RING_FT3.toFixed(1)} ft³, or ${RING_BAGS} bags of 2 ft³ mulch. Pick the circular ring option in the calculator and enter 6 ft outer and 1 ft inner diameter to get the same answer.`,
        "Mulch should never touch the trunk. Mounding mulch against the bark, sometimes called a mulch volcano, holds moisture against the tree and invites rot, insects, and girdling roots. Pull the mulch back a few inches so the root flare stays visible, and spread it wide rather than deep.",
      ],
    },
    {
      heading: "Bulk versus bagged mulch",
      paragraphs: [
        `It takes about ${Math.ceil(27 / CUBIC_FT_PER_BAG)} bags of 2 ft³ mulch to equal one cubic yard. For a few small beds, bags are convenient and you can buy only what you need. Past roughly two or three cubic yards, bulk delivery is almost always cheaper per cubic foot, and it's far less handling than carrying dozens of bags.`,
        "A bulk delivery lands in one pile, so choose a spot on a driveway or on a tarp near the beds, and plan to move it within a day or two. Wet mulch is heavier than the figure the calculator assumes, and a pile left in the rain can start to heat up and smell. If you are hauling it yourself, remember that a full-size pickup bed holds only about one to two cubic yards, depending on how high you pile it and how much weight the truck can carry.",
      ],
    },
    {
      heading: "Putting it down",
      list: [
        "Pull weeds first. Mulch slows them down but doesn't kill established ones, and cardboard or newspaper under the mulch can help smother stubborn patches.",
        "Edge the bed with a spade so the mulch has a clear border and doesn't spill onto the lawn.",
        "Spread 2 to 3 in deep for most beds. Fine mulches pack down, so keep them toward 2 in. Coarse bark can go to 3 in.",
        "Keep mulch a few inches away from tree trunks, plant stems, and house siding or foundation walls.",
        "Refresh each spring by raking the old mulch loose and topping up an inch or less, rather than adding a full new layer on top of a thick old one.",
      ],
    },
  ],
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
