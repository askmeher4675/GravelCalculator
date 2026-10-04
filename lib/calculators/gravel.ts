import { CalculatorConfig } from "./types";
import { SHAPES, shapeAreaSqFt, shapeAreaFormulaLabel, shapeLabel } from "./shapeArea";
import { rawVolume, withWaste, roundUpToIncrement } from "./volumeModel";

export const CUBIC_FT_PER_BAG = 0.5; // standard 0.5 ft³ bagged gravel
const LB_PER_KG = 0.45359237;
export const ORDER_INCREMENT_YD = 0.1; // suggested order rounds up to the nearest 0.1 yd³

// Approximate density by gravel type, in lb per cubic yard.
export const GRAVEL_TYPES = [
  { id: 1, label: "Crushed Stone (#57)", lbPerCubicYd: 2600 },
  { id: 2, label: "Pea Gravel", lbPerCubicYd: 2800 },
  { id: 3, label: "Crushed Limestone", lbPerCubicYd: 2700 },
  { id: 4, label: "River Rock", lbPerCubicYd: 2650 },
  { id: 5, label: "Decomposed Granite", lbPerCubicYd: 2800 },
];

const COVERAGE_ROWS = [2, 3, 4, 6].map((depthIn) => {
  const { cubicYd } = rawVolume(100, depthIn / 12);
  const tons = (type: number) => ((cubicYd * GRAVEL_TYPES[type - 1].lbPerCubicYd) / 2000).toFixed(2);
  return [`${depthIn} in`, `${cubicYd.toFixed(2)} yd³`, `${tons(1)} tons`, `${tons(2)} tons`];
});

const WEIGHT_ROWS = GRAVEL_TYPES.map((t) => [
  t.label,
  `${t.lbPerCubicYd.toLocaleString("en-US")} lb`,
  `${(t.lbPerCubicYd / 2000).toFixed(2)} tons`,
  `${(2000 / t.lbPerCubicYd).toFixed(2)} yd³`,
]);

const TON_PRICES = [20, 35, 50, 75];
const AVG_LB_PER_YD3 = 2700;
const PRICE_ROWS = TON_PRICES.map((p) => [`$${p} per ton`, `$${((p * AVG_LB_PER_YD3) / 2000).toFixed(0)} per yd³`]);

export const gravelCalculator: CalculatorConfig = {
  slug: "gravel-calculator",
  title: "Gravel Calculator",
  seoTitle: "Gravel Calculator: Cost, Tons & Cubic Yards",
  category: "Landscaping",
  intro:
    "Calculate how much gravel you need — and what it will cost — for a driveway, walkway, or drainage bed. Enter your area, gravel type, and price per ton to get cubic yards, tons, and total estimated cost.",
  metaDescription:
    "Free gravel cost calculator. Enter area, depth, gravel type and price per ton to get cubic yards, tons, bags and total cost, with waste included.",
  fields: [
    {
      key: "shape",
      label: "Area shape",
      unit: "",
      type: "select",
      helperText: "Pick the shape that best matches the area you're covering.",
      options: SHAPES.map((s) => ({ value: s.id, label: s.label })),
    },
    {
      key: "length",
      label: "Length",
      unit: "ft",
      type: "number",
      placeholder: "20",
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
      placeholder: "12",
      min: 0,
      step: 0.5,
      helperText: "Measure straight across the widest point.",
      visibleIf: { field: "shape", equals: 2 },
    },
    {
      key: "base",
      label: "Base",
      unit: "ft",
      type: "number",
      placeholder: "15",
      min: 0,
      step: 0.5,
      visibleIf: { field: "shape", equals: 3 },
    },
    {
      key: "triangleHeight",
      label: "Height",
      unit: "ft",
      type: "number",
      placeholder: "10",
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
      placeholder: "20",
      min: 0,
      step: 0.5,
      helperText: "Measure across the outside edge of the ring or path.",
      visibleIf: { field: "shape", equals: 4 },
    },
    {
      key: "innerDiameter",
      label: "Inner diameter",
      unit: "ft",
      type: "number",
      placeholder: "14",
      min: 0,
      step: 0.5,
      helperText: "Measure across the inside edge (e.g. the planting bed the path circles).",
      visibleIf: { field: "shape", equals: 4 },
    },
    {
      key: "lengthA",
      label: "Side A",
      unit: "ft",
      type: "number",
      placeholder: "25",
      min: 0,
      step: 0.5,
      helperText: "The longer parallel side, e.g. the street end of a tapered driveway.",
      visibleIf: { field: "shape", equals: 5 },
    },
    {
      key: "lengthB",
      label: "Side B",
      unit: "ft",
      type: "number",
      placeholder: "15",
      min: 0,
      step: 0.5,
      helperText: "The shorter parallel side, e.g. the garage end.",
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
      key: "depth",
      label: "Depth",
      unit: "in",
      type: "number",
      placeholder: "4",
      min: 0,
      step: 0.5,
      helperText: "Most driveways use 4–6 in of gravel depth.",
    },
    {
      key: "gravelType",
      label: "Gravel type",
      unit: "",
      type: "select",
      helperText: "Density affects how many tons your order weighs.",
      options: GRAVEL_TYPES.map((t) => ({ value: t.id, label: t.label })),
    },
    {
      key: "pricePerTon",
      label: "Price per ton",
      unit: "$/ton",
      type: "number",
      placeholder: "55",
      min: 0,
      step: 1,
      helperText: "Check with your local supplier — gravel typically runs $15–$75 per ton.",
    },
  ],
  wastePercentOptions: [5, 10, 15],
  wastePercentDefault: 10,
  wasteHelperText: "Covers uneven sub-grade, spillage, and compaction. 10% works for most driveways.",
  calculate: (inputs, wastePercent) => {
    const { shape, depth, gravelType, pricePerTon } = inputs;
    const gravel = GRAVEL_TYPES.find((t) => t.id === gravelType) ?? GRAVEL_TYPES[0];
    const area = shapeAreaSqFt(shape, inputs);
    const depthFt = depth / 12;

    // Single source of truth: raw volume -> waste-adjusted volume -> suggested order.
    // Weight, bags, and cost are ALL derived from the waste-adjusted volume below —
    // never from the rounded suggested order, which is a separate purchasing figure.
    const { cubicFt: rawVolumeCubicFt, cubicYd: rawVolumeCubicYd } = rawVolume(area, depthFt);
    const wasteAdjustedCubicYd = withWaste(rawVolumeCubicYd, wastePercent);
    const wasteAdjustedCubicFt = withWaste(rawVolumeCubicFt, wastePercent);
    const suggestedOrderYd = roundUpToIncrement(wasteAdjustedCubicYd, ORDER_INCREMENT_YD);

    const estimatedTons = (wasteAdjustedCubicYd * gravel.lbPerCubicYd) / 2000;
    const totalCost = estimatedTons * pricePerTon;
    const bagsNeeded = Math.ceil(wasteAdjustedCubicFt / CUBIC_FT_PER_BAG);
    const wasteAdjustedCubicM = wasteAdjustedCubicYd * 0.7646;
    const estimatedKg = estimatedTons * 2000 * LB_PER_KG;

    return {
      primaryValue: `$${totalCost.toFixed(2)}`,
      primaryUnit: "",
      primaryExplanation: "Estimated total cost for materials (includes waste)",
      secondary: [
        { label: "Required", value: `${rawVolumeCubicYd.toFixed(2)} yd³`, description: "Volume needed before waste" },
        { label: `With ${wastePercent}% waste`, value: `${wasteAdjustedCubicYd.toFixed(2)} yd³`, description: "Total volume to order" },
        { label: "Suggested order", value: `${suggestedOrderYd.toFixed(1)} yd³`, description: "Rounded up for ordering" },
      ],
      breakdown: [
        { label: `${shapeAreaFormulaLabel(shape, inputs)} · ${shapeLabel(shape)}`, value: `${area.toFixed(0)} ft²` },
        { label: `Volume (${area.toFixed(0)} × ${depthFt.toFixed(2)} ft)`, value: `${rawVolumeCubicFt.toFixed(1)} ft³` },
        { label: "Required (converted to yd³)", value: `${rawVolumeCubicYd.toFixed(2)} yd³` },
        { label: `With ${wastePercent}% waste`, value: `${wasteAdjustedCubicYd.toFixed(2)} yd³` },
        { label: "Suggested order", value: `${suggestedOrderYd.toFixed(1)} yd³`, note: `Rounded up to the nearest ${ORDER_INCREMENT_YD} yd³` },
        { label: `Weight (${gravel.label}, ~${gravel.lbPerCubicYd} lb/yd³, incl. waste)`, value: `${estimatedTons.toFixed(2)} tons` },
        { label: `Bags at ${CUBIC_FT_PER_BAG} ft³ each (incl. waste)`, value: `${bagsNeeded} bags`, note: "Alternative for small orders instead of bulk delivery" },
        { label: `Cost (${estimatedTons.toFixed(2)} tons × $${pricePerTon.toFixed(2)}/ton)`, value: `$${totalCost.toFixed(2)}` },
      ],
      conversion: `With waste: ${wasteAdjustedCubicM.toFixed(2)} m³ · Weight ≈ ${estimatedKg.toFixed(0)} kg`,
    };
  },
  methodology:
    "Area is calculated from the shape you select — rectangle (length × width), circle (π × radius²), triangle (½ × base × height), circular ring (π × (outer radius² − inner radius²)) for paths around a bed, or trapezoid (average of the two parallel sides × width) for tapered driveways. That area is multiplied by depth to get the exact volume required, converted from cubic feet to cubic yards (27 ft³ per yd³). We add your selected waste percentage to that required volume to get the waste-adjusted volume — the actual amount of material to buy — and every other figure (weight, bags, and cost) is calculated from that same waste-adjusted volume, so they always agree with each other. The suggested order then rounds that waste-adjusted volume up to the nearest 0.1 yd³, since most suppliers sell gravel in small fractional-yard increments. Weight uses the selected gravel type's typical density — crushed stone, pea gravel, limestone, river rock, and decomposed granite all pack differently, from about 2,600 to 2,800 lb per cubic yard. Total cost multiplies that weight by your entered price per ton. For small orders, we also estimate the equivalent number of standard 0.5 ft³ bags, and show the waste-adjusted volume and weight converted to metric (m³ and kg).",
  example:
    "A 20 ft × 10 ft driveway at 4 in deep needs 2.47 yd³ of gravel. With 10% waste that's 2.72 yd³ of crushed stone — about 3.53 tons — so suggested order is 2.8 yd³. At $55/ton, that's roughly $194.20.",
  sections: [
    {
      heading: "How much gravel per 100 square feet",
      paragraphs: [
        "A fast way to check your result is to work from 100 ft². The table shows the volume at common depths, and the weight of crushed stone and pea gravel using the same densities as the calculator. Multiply by your area divided by 100 to scale up. These figures are before the waste allowance.",
      ],
      table: {
        headers: ["Depth", "Volume per 100 ft²", "Crushed stone", "Pea gravel"],
        rows: COVERAGE_ROWS,
        note: "A 20 × 10 ft area is 200 ft², so double the figures in the row for your depth.",
      },
    },
    {
      heading: "Weight and volume by gravel type",
      paragraphs: [
        "Suppliers quote gravel both by the ton and by the cubic yard, and the two aren't interchangeable because stone types differ in density and moisture. The table shows what a cubic yard weighs for each type in the calculator, and how much volume a ton gives you.",
      ],
      table: {
        headers: ["Gravel type", "Weight per yd³", "Tons per yd³", "Volume per ton"],
        rows: WEIGHT_ROWS,
        note: "Densities are typical. Wet stone weighs more, and a load can be heavier than the figure shown in rainy weather.",
      },
    },
    {
      heading: "Converting price per ton to price per yard",
      paragraphs: [
        "Some quarries price by the ton and others by the cubic yard. To compare them, multiply the price per ton by the weight of a cubic yard in tons. At an average of about 2,700 lb per cubic yard (1.35 tons), the conversion looks like this.",
      ],
      table: {
        headers: ["Price per ton", "Equivalent price per yd³"],
        rows: PRICE_ROWS,
        note: "Delivery is usually extra and is often a flat fee per load, so a small order costs more per ton than a full truck.",
      },
    },
    {
      heading: "How deep to spread gravel by project",
      table: {
        headers: ["Project", "Typical depth", "Notes"],
        rows: [
          ["Decorative beds and mulch-style covering", "2–3 in", "Pea gravel or river rock over fabric"],
          ["Walkways and garden paths", "2–4 in", "Compact the base first, with edging to hold the stone in"],
          ["Patio, shed, or play-area base", "4–6 in", "Angular stone that compacts and drains well"],
          ["French drain or drainage trench", "6–12 in", "Washed stone around a perforated pipe, wrapped in fabric"],
          ["Driveway", "4–8 in in layers", "Use the driveway calculator for base and surface layers"],
        ],
        note: "Match the stone to the job: rounded stone like pea gravel stays loose and shifts under tires and feet, while angular crushed stone locks together.",
      },
    },
    {
      heading: "Preparing the site",
      list: [
        "Mark the area, strip sod and organic material, and remove roots. Gravel laid over topsoil sinks and mixes in.",
        "Compact the exposed soil with a plate compactor or hand tamper so the stone has a firm bed.",
        "Lay landscape fabric to separate the soil from the stone and stop weeds from growing through. Overlap seams by 6 in.",
        "Install edging, such as steel, plastic, or stone, to keep the gravel in place and make a clean border.",
        "Slope the surface slightly away from buildings so water doesn't pool, and spread the stone in even layers with a rake.",
      ],
    },
    {
      heading: "Ordering and delivery tips",
      paragraphs: [
        `A bag of 0.5 ft³ holds about 50 lb of stone, and it takes ${Math.ceil(27 / CUBIC_FT_PER_BAG)} bags to make one cubic yard. Bags make sense for small jobs, such as a single path or a few planters, but for anything over about a yard, bulk delivery costs much less.`,
        "Most delivery trucks are limited by weight rather than volume, so ask what the supplier's minimum is and how many tons a truck can carry. Pick a spot for the dump that the truck can reach without crossing soft ground, and put down a tarp or plywood to protect a lawn or driveway. If you can't be home, tell the driver where to drop the load and mark it with stakes or paint.",
        "Always ask the supplier about local product names. A stone called #57 in one place is sold as something else elsewhere, and it's easier to describe the size you want, such as three-quarter-inch angular crushed stone, than to rely on a number.",
      ],
    },
  ],
  faqs: [
    {
      question: "My area isn't a rectangle — can this calculator still handle it?",
      answer:
        "Yes. Use the \"Area shape\" dropdown to switch to circle, triangle, circular ring (for a path around a bed or tree), or trapezoid (for a driveway that's wider at one end). Each shape shows the specific measurements it needs and the area formula is shown in the breakdown.",
    },
    {
      question: "How deep should a gravel driveway be?",
      answer:
        "Most residential gravel driveways use 4–6 inches of gravel over a compacted base. Heavier vehicle traffic or soft soil may need 8–12 inches across multiple layers.",
    },
    {
      question: "How much does a ton of gravel cost?",
      answer:
        "Gravel typically costs $15–$75 per ton depending on type, region, and delivery distance. Crushed stone and recycled materials tend to be cheaper; decorative gravel like river rock or decomposed granite costs more.",
    },
    {
      question: "How much does a cubic yard of gravel weigh?",
      answer:
        "Roughly 2,600–2,800 lb (about 1.3–1.4 tons), depending on the gravel type and how compacted it is. This calculator adjusts the weight estimate based on the gravel type you select.",
    },
    {
      question: "Should I buy gravel by the ton or by the cubic yard?",
      answer:
        "Suppliers sell both ways — cubic yards describe volume, tons describe weight. This calculator gives you both, plus the total cost, so you can compare supplier pricing however it's quoted.",
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
  relatedGuides: [
    { href: "/guides/gravel-driveway", title: "How much gravel for a driveway" },
    { href: "/guides/gravel-cost-per-ton", title: "How much does gravel cost?" },
    { href: "/guides/gravel-coverage-chart", title: "Gravel coverage chart" },
    { href: "/guides/gravel-types-and-sizes", title: "Types of gravel and sizes" },
  ],
};
