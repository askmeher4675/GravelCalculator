import { CalculatorConfig } from "./types";
import { gravelCalculator } from "./gravel";
import { concreteCalculator } from "./concrete";
import { mulchCalculator } from "./mulch";
import { topsoilCalculator } from "./topsoil";
import { paverCalculator } from "./paver";
import { sodCalculator } from "./sod";
import { fenceCalculator } from "./fence";
import { paintCalculator } from "./paint";
import { deckCalculator } from "./deck";
import { drivewayCalculator } from "./driveway";

export const calculators: Record<string, CalculatorConfig> = {
  [gravelCalculator.slug]: gravelCalculator,
  [concreteCalculator.slug]: concreteCalculator,
  [mulchCalculator.slug]: mulchCalculator,
  [topsoilCalculator.slug]: topsoilCalculator,
  [paverCalculator.slug]: paverCalculator,
  [sodCalculator.slug]: sodCalculator,
  [fenceCalculator.slug]: fenceCalculator,
  [paintCalculator.slug]: paintCalculator,
  [deckCalculator.slug]: deckCalculator,
  [drivewayCalculator.slug]: drivewayCalculator,
};

/** One-line summaries for compact listings (nav menu, index grid, homepage tiles). */
export const calculatorTaglines: Record<string, string> = {
  "gravel-calculator": "Calculate tons, cubic yards and cost for any area.",
  "driveway-calculator": "Estimate gravel for your driveway.",
  "concrete-calculator": "Calculate concrete for slabs, footings and more.",
  "mulch-calculator": "Find out how much mulch you need.",
  "topsoil-calculator": "Estimate topsoil volume for beds and lawns.",
  "paver-calculator": "Plan pavers for patios and walkways.",
  "sod-calculator": "Work out sod rolls or pallets for your lawn.",
  "fence-calculator": "Estimate posts, rails, and panels needed.",
  "paint-calculator": "Calculate paint cans for walls and rooms.",
  "deck-calculator": "Plan decking boards and materials.",
};

/** Calculators grouped by category, in registry order. */
export function calculatorsByCategory(): [string, CalculatorConfig[]][] {
  const byCategory = new Map<string, CalculatorConfig[]>();
  for (const config of Object.values(calculators)) {
    const list = byCategory.get(config.category) ?? [];
    list.push(config);
    byCategory.set(config.category, list);
  }
  return Array.from(byCategory.entries());
}
