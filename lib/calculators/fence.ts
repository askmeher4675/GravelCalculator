import { CalculatorConfig } from "./types";

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
