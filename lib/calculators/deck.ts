import { CalculatorConfig } from "./types";

const JOIST_SPACING_IN = 16; // standard on-center joist spacing
const BOARD_LENGTH_FT = 12; // common stocked decking board length

export const deckCalculator: CalculatorConfig = {
  slug: "deck-calculator",
  title: "Deck Calculator",
  category: "Decks & Outdoor Projects",
  intro:
    "Estimate the square footage, decking boards, and joists you need to build a deck based on its length, width, and board width.",
  metaDescription:
    "Deck calculator for decking boards and joists. Enter deck length, width, and board width to get square footage, boards, and joist count.",
  fields: [
    { key: "length", label: "Deck length", unit: "ft", type: "number", placeholder: "16", min: 0, step: 0.5 },
    { key: "width", label: "Deck width", unit: "ft", type: "number", placeholder: "12", min: 0, step: 0.5 },
    {
      key: "boardWidth",
      label: "Board width",
      unit: "in",
      type: "number",
      placeholder: "5.5",
      min: 0,
      step: 0.25,
      helperText: "Standard 5/4 decking boards are about 5.5 in wide after milling.",
    },
  ],
  wastePercentOptions: [10, 15],
  wastePercentDefault: 10,
  wasteHelperText: "Covers angled cuts, staggered seams, and defects. 10% works for most simple decks.",
  calculate: (inputs, wastePercent) => {
    const { length, width, boardWidth } = inputs;
    const areaSqFt = length * width;
    const boardWidthFt = boardWidth / 12;
    const linearFtNeeded = areaSqFt / boardWidthFt;
    const linearFtWithWaste = linearFtNeeded * (1 + wastePercent / 100);
    const boardsNeeded = Math.ceil(linearFtWithWaste / BOARD_LENGTH_FT);
    const joists = Math.ceil((width * 12) / JOIST_SPACING_IN) + 1;

    return {
      primaryValue: areaSqFt.toFixed(0),
      primaryUnit: "ft²",
      primaryExplanation: "Deck surface area",
      secondary: [
        { label: "Decking linear feet", value: `${linearFtWithWaste.toFixed(0)} ft` },
        { label: `${BOARD_LENGTH_FT} ft boards needed`, value: `${boardsNeeded} boards` },
        { label: `Joists (${JOIST_SPACING_IN} in on-center)`, value: `${joists} joists` },
      ],
      breakdown: [
        { label: `Deck area (${length.toFixed(1)} × ${width.toFixed(1)} ft)`, value: `${areaSqFt.toFixed(0)} ft²` },
        { label: `Decking linear feet (area ÷ ${boardWidthFt.toFixed(3)} ft board width)`, value: `${linearFtNeeded.toFixed(0)} ft` },
        { label: `With ${wastePercent}% waste`, value: `${linearFtWithWaste.toFixed(0)} ft` },
        { label: `Boards at ${BOARD_LENGTH_FT} ft each`, value: `${boardsNeeded} boards`, note: "Rounded up to the nearest whole board" },
        { label: `Joists spanning the width, every ${JOIST_SPACING_IN} in`, value: `${joists} joists`, note: "Assumes joists run along the length, spaced across the width" },
      ],
    };
  },
  methodology:
    "Deck area is length × width. Decking linear footage is the area divided by the board's actual face width, which approximates board count while ignoring the small gaps typically left between boards for drainage. We add your selected waste percentage for angled cuts, staggered seams, and defects, then convert to a board count assuming standard 12 ft boards. Joist count assumes standard 16 in on-center spacing across the deck's width, with joists running the full length — actual framing should be confirmed against local building code and span tables for your joist size and species.",
  example:
    "A 16 ft × 12 ft deck is 192 ft². With 5.5 in boards and 10% waste, that's about 461 linear feet, or 39 boards at 12 ft each, plus 10 joists at 16 in on-center.",
  faqs: [
    {
      question: "How much waste should I add for decking?",
      answer:
        "10% is typical for a simple rectangular deck. Diagonal patterns, picture-frame borders, or decks with many cutouts often need 15% or more.",
    },
    {
      question: "What joist spacing should I use?",
      answer:
        "16 in on-center is standard for most composite and wood decking. Some composite manufacturers require 12 in spacing for diagonal installs or specific board types — always check the manufacturer's span table.",
    },
    {
      question: "Does this calculator include the substructure — posts, beams, and footings?",
      answer:
        "No, this calculator covers decking boards and joist count only. Posts, beams, and footings are sized separately based on deck height, span, and local building code.",
    },
    {
      question: "Should I leave gaps between decking boards?",
      answer:
        "Yes — typically 1/8 to 1/4 in between boards for drainage and material expansion, which this calculator does not subtract but is small enough to be absorbed by the waste allowance.",
    },
    {
      question: "How do I reduce seams in long deck runs?",
      answer:
        "Use the longest boards available for your run length and stagger the seams between rows so they don't line up, which also affects total board count slightly.",
    },
  ],
  related: [
    { slug: "fence-calculator", title: "Fence Calculator" },
    { slug: "concrete-calculator", title: "Concrete Calculator" },
    { slug: "paint-calculator", title: "Paint Calculator" },
  ],
};
