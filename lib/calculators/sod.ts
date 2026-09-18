import { CalculatorConfig } from "./types";

const SQ_FT_PER_PALLET = 450; // standard sod pallet coverage
const SQ_FT_PER_ROLL = 10; // standard large sod roll coverage
const SQ_FT_PER_SQ_YD = 9;

export const sodCalculator: CalculatorConfig = {
  slug: "sod-calculator",
  title: "Sod Calculator",
  category: "Lawn & Garden",
  intro:
    "Estimate how much sod you need for a new lawn, in square feet, pallets, or rolls, based on the area's length and width.",
  fields: [
    { key: "length", label: "Length", unit: "ft", type: "number", placeholder: "40", min: 0, step: 0.5 },
    { key: "width", label: "Width", unit: "ft", type: "number", placeholder: "25", min: 0, step: 0.5 },
  ],
  wastePercentOptions: [5, 10],
  wastePercentDefault: 5,
  calculate: (inputs, wastePercent) => {
    const { length, width } = inputs;
    const areaSqFt = length * width;
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
        { label: "Area", value: `${areaSqFt.toFixed(0)} ft² (${sqYd.toFixed(1)} yd²)` },
        { label: `With ${wastePercent}% waste`, value: `${withWasteSqFt.toFixed(0)} ft²` },
        { label: "Pallets (≈450 ft² each)", value: `${pallets} pallet${pallets === 1 ? "" : "s"}`, note: "Rounded up to the nearest full pallet" },
        { label: "Large rolls (≈10 ft² each)", value: `${rolls} rolls` },
      ],
    };
  },
  methodology:
    "Area is calculated as length × width. We add your selected waste percentage to cover irregular edges, curves, and cutting around obstacles like trees and beds. Pallet coverage assumes approximately 450 square feet per pallet and large-roll coverage assumes approximately 10 square feet per roll, though exact coverage varies by sod farm and grass variety.",
  example:
    "A 40 ft × 25 ft lawn is 1,000 ft². With 5% waste that's 1,050 ft², so order 3 pallets (up to 1,350 ft²) or 105 large rolls.",
  faqs: [
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
