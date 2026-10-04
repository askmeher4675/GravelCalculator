import { CalculatorConfig } from "./types";

/** Pickets for a run, spaced edge to edge (gap in inches, 0 for a solid privacy fence). */
function picketsFor(lengthFt: number, picketWidthIn: number, gapIn: number) {
  return Math.ceil((lengthFt * 12) / (picketWidthIn + gapIn));
}

const PICKET_ROWS = [
  ["3.5 in (1×4)", 0, 3.5],
  ["5.5 in (1×6)", 0, 5.5],
  ["5.5 in (1×6) with 1/2 in gaps", 0.5, 5.5],
  ["3.5 in (1×4) with 2 in gaps (picket style)", 2, 3.5],
].map(([label, gap, width]) => [label as string, `${gap} in`, picketsFor(100, width as number, gap as number)]);

// Worked example: a 50 × 100 ft yard fenced on all four sides with posts every 8 ft.
const YARD_SIDES_FT = [50, 100, 50, 100];
const YARD_SECTIONS = YARD_SIDES_FT.reduce((n, side) => n + Math.ceil(side / 8), 0);
const YARD_PERIMETER_SECTIONS = Math.ceil(300 / 8);

export const fenceCalculator: CalculatorConfig = {
  slug: "fence-calculator",
  title: "Fence Calculator",
  category: "Fencing",
  intro:
    "Estimate how many posts, rails, and pickets you need for a fence based on its total length and post spacing.",
  metaDescription:
    "Fence calculator for wood, vinyl, and chain-link fences. Enter total length and post spacing to get the number of posts and rails you need.",
  fields: [
    { key: "length", label: "Fence length", unit: "ft", type: "number", placeholder: "150", min: 0, step: 1 },
    {
      key: "postSpacing",
      label: "Post spacing",
      unit: "ft",
      type: "number",
      placeholder: "8",
      min: 1,
      step: 0.5,
      helperText: "Most wood fences space posts 6–8 ft apart.",
    },
    {
      key: "railsPerSection",
      label: "Rails per section",
      unit: "rails",
      type: "number",
      placeholder: "3",
      min: 1,
      step: 1,
      helperText: "2 rails for short fences, 3 for standard privacy fences, 4+ for taller fences.",
    },
  ],
  wastePercentOptions: [5, 10],
  wastePercentDefault: 5,
  wasteHelperText: "Covers cutting waste and damaged rail pieces. 5% works for most standard runs.",
  calculate: (inputs, wastePercent) => {
    const { length, postSpacing, railsPerSection } = inputs;
    const sections = Math.ceil(length / postSpacing);
    const posts = sections + 1;
    const rails = sections * railsPerSection;
    const railsWithWaste = Math.ceil(rails * (1 + wastePercent / 100));
    const actualFenceLength = sections * postSpacing;

    return {
      primaryValue: posts.toString(),
      primaryUnit: "posts",
      primaryExplanation: "Fence posts needed",
      secondary: [
        { label: "Sections", value: `${sections}` },
        { label: "Rails needed", value: `${rails} rails` },
        { label: `Rails with ${wastePercent}% waste`, value: `${railsWithWaste} rails` },
      ],
      breakdown: [
        { label: "Fence length", value: `${length.toFixed(0)} ft` },
        { label: `Sections (${length.toFixed(0)} ÷ ${postSpacing.toFixed(1)} ft, rounded up)`, value: `${sections}` },
        { label: "Posts (sections + 1)", value: `${posts} posts` },
        { label: `Rails (${sections} × ${railsPerSection} per section)`, value: `${rails} rails` },
        { label: `With ${wastePercent}% waste`, value: `${railsWithWaste} rails`, note: "Covers cut waste and damaged pieces" },
        { label: "Actual fence length covered", value: `${actualFenceLength.toFixed(1)} ft`, note: "Sections are rounded up to whole posts" },
      ],
    };
  },
  methodology:
    "The fence run is divided into equal sections based on your post spacing, rounded up to the nearest whole section, which means the built fence may run slightly longer than the exact input length. Posts equal the number of sections plus one (for both end posts). Rails are the number of sections multiplied by rails per section. We add your selected waste percentage to the rail count to cover cutting waste and damaged pieces; pickets are not estimated since spacing and width vary widely by style.",
  example:
    "A 150 ft fence with posts every 8 ft needs 19 sections, 20 posts, and 57 rails (3 per section). With 5% waste, order 60 rails.",
  sections: [
    {
      heading: "Post spacing by fence type",
      paragraphs: [
        "Spacing is set by the rail or panel length and the load on each section. Use the typical ranges below as a starting point, then follow the manufacturer's installation guide for any pre-made system, because warranties often depend on it.",
      ],
      table: {
        headers: ["Fence type", "Typical post spacing", "Notes"],
        rows: [
          ["Wood privacy (rails and pickets)", "6–8 ft", "8 ft is common with 2×4 rails; 6 ft resists sagging on taller fences"],
          ["Vinyl privacy or picket", "6–8 ft", "Set by panel width, which is usually 6 ft or 8 ft"],
          ["Chain link", "Up to 10 ft", "Line posts between heavier terminal posts at ends, corners, and gates"],
          ["Ornamental aluminum or steel", "6–8 ft", "Pre-assembled panels, commonly 6 ft wide"],
          ["Split rail", "8–10 ft", "Rails span the full gap and are often 10 ft long"],
        ],
        note: "These are typical ranges, not code requirements. Wind exposure, fence height, and soil type can all justify closer spacing.",
      },
    },
    {
      heading: "Count each straight run separately",
      paragraphs: [
        "The calculator uses the rule posts = sections + 1, which is right for a single straight run with two ends. A fence with corners, gates, or a closed loop around a yard doesn't follow that rule, and measuring the total perimeter in one go can miscount posts and leave you with a post in the wrong place.",
        `Take a 50 × 100 ft yard fenced on all four sides with posts every 8 ft. Entering the 300 ft perimeter into the calculator gives ${YARD_PERIMETER_SECTIONS} sections. But each side has to land on a post at its corner, so you round each side up separately: 50 ft needs ${Math.ceil(50 / 8)} sections and 100 ft needs ${Math.ceil(100 / 8)}, for ${YARD_SECTIONS} sections in total. On a closed loop the number of posts equals the number of sections, so you need ${YARD_SECTIONS} posts, not ${YARD_PERIMETER_SECTIONS + 1}.`,
        "For an accurate order, sketch the fence, run the calculator for each straight segment, and add the results. Then adjust the post count for gates, corners, and any section where you can reuse an existing post such as a house wall or a neighbor's shared post.",
      ],
    },
    {
      heading: "Gates, corners, and end posts",
      list: [
        "Gate posts carry the swinging weight of the gate, so use a heavier post (often 6×6 for wide or heavy gates) and set it deeper than line posts.",
        "A single gate needs two posts, one for the hinges and one for the latch, with the gate opening between them. Subtract the gate width from the run before counting sections.",
        "Corner and end posts take the tension and pull of the fence, and are usually braced or set in more concrete than line posts.",
        "A double gate for vehicle access commonly needs 10 to 12 ft of clear opening, so plan the posts first and fit the fence around them.",
      ],
    },
    {
      heading: "Setting posts: depth, hole size, and concrete",
      paragraphs: [
        "A common rule is to bury at least one-third of the above-ground height with a 24 in minimum, and deeper where the soil freezes. A 6 ft privacy fence typically uses 8 ft posts set about 2 ft deep, and in cold climates posts should go below the local frost line so heaving doesn't lift them.",
        "A hole roughly three times the post width keeps enough concrete around it to hold the post straight. For a 10 in wide by 24 in deep hole around a 4×4 post, the concrete volume is about 0.9 ft³. A 60 lb bag yields about 0.45 ft³, so plan on two bags per post and multiply by the post count. For larger jobs the concrete calculator will size the order for you.",
        "Put 4 to 6 in of gravel at the bottom of each hole so water drains away from the end of the post, and slope the top of the concrete away from the wood so it sheds water rather than collecting around it.",
      ],
    },
    {
      heading: "Estimating pickets and fasteners",
      paragraphs: [
        "The calculator leaves pickets out because width and spacing vary so much by style. To estimate them yourself, divide the fence length in inches by the picket width plus the gap, and round up. The table shows picket counts for 100 ft of fence at several common widths.",
      ],
      table: {
        headers: ["Picket width", "Gap", "Pickets per 100 ft"],
        rows: PICKET_ROWS,
        note: "Add 5–10% for cuts, defects, and the last picket on each section.",
      },
      after: [
        "For fasteners, count two nails or screws per rail on every picket. With three rails, that is six fasteners per picket. Galvanized or stainless fasteners last far longer than bare steel, particularly with cedar or treated lumber that can corrode plain nails.",
      ],
    },
    {
      heading: "Slopes, property lines, and permits",
      paragraphs: [
        "On sloping ground you can step each section down in level increments or rack the pickets to follow the grade. Stepped fences leave gaps under the pickets that you may need to close, and racked fences usually require flexible rails. Measure the length along the ground when you count rails, and expect more waste on steep runs.",
        "Before you dig, confirm where your property line is. A recent survey or the plat from your closing documents is more reliable than a neighbor's existing fence. Many towns limit fence height, often to about 6 ft in rear yards and lower in front yards, and homeowner associations may add style and color rules. In the United States, call 811 a few days before digging so utilities can mark buried lines.",
      ],
    },
  ],
  faqs: [
    {
      question: "How far apart should fence posts be?",
      answer:
        "Wood fence posts are typically spaced 6–8 ft apart. Vinyl and chain-link fences often use manufacturer-specified spacing, commonly 8 ft, based on panel or rail length.",
    },
    {
      question: "How many rails does a privacy fence need?",
      answer:
        "Most 6 ft privacy fences use 3 rails per section (top, middle, bottom). Taller fences (8 ft+) often use 4 rails for extra rigidity.",
    },
    {
      question: "Why is the actual fence length longer than what I entered?",
      answer:
        "Since posts must land at even intervals, the number of sections is rounded up to the next whole number, which can extend the total fence length slightly beyond your input.",
    },
    {
      question: "How deep should fence post holes be?",
      answer:
        "A common rule is to set posts about 1/3 of their above-ground height into the ground, with a minimum of 24 in for most residential fences, set in concrete.",
    },
    {
      question: "Does this calculator include pickets or fence panels?",
      answer:
        "No — picket count depends heavily on picket width and gap spacing, and pre-made panels are sized by the manufacturer, so those should be calculated separately based on your chosen style.",
    },
  ],
  related: [
    { slug: "deck-calculator", title: "Deck Calculator" },
    { slug: "sod-calculator", title: "Sod Calculator" },
    { slug: "paint-calculator", title: "Paint Calculator" },
  ],
};
