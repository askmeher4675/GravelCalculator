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
