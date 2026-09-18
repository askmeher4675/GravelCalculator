import { CalculatorConfig } from "./types";
import { gravelCalculator } from "./gravel";

export const calculators: Record<string, CalculatorConfig> = {
  [gravelCalculator.slug]: gravelCalculator,
};
