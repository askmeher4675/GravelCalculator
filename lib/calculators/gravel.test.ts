import test from "node:test";
import assert from "node:assert/strict";
import { gravelCalculator } from "./gravel";
import { shapeAreaSqFt } from "./shapeArea";
import { rawVolume, withWaste, roundUpToIncrement } from "./volumeModel";

type Result = ReturnType<typeof gravelCalculator.calculate>;

const GRAVEL_DENSITY: Record<number, number> = {
  1: 2600, // Crushed Stone (#57)
  2: 2800, // Pea Gravel
  3: 2700, // Crushed Limestone
  4: 2650, // River Rock
  5: 2800, // Decomposed Granite
};
const CUBIC_FT_PER_BAG = 0.5;
const ORDER_INCREMENT_YD = 0.1;

function num(value: string): number {
  const n = parseFloat(value.replace(/[^0-9.\-]/g, ""));
  assert.ok(!Number.isNaN(n), `could not parse a number out of "${value}"`);
  return n;
}

function secondary(result: Result, label: string): number {
  const item = result.secondary.find((s) => s.label === label);
  assert.ok(item, `missing secondary item "${label}" (had: ${result.secondary.map((s) => s.label).join(", ")})`);
  return num(item.value);
}

function breakdown(result: Result, labelIncludes: string): number {
  const row = result.breakdown.find((r) => r.label.includes(labelIncludes));
  assert.ok(row, `missing breakdown row containing "${labelIncludes}" (had: ${result.breakdown.map((r) => r.label).join(", ")})`);
  return num(row.value);
}

interface Case {
  name: string;
  inputs: Record<string, number>;
  wastePercent: number;
  pricePerTon: number;
}

// The user's exact reported test case, plus 5 more spanning every shape, gravel type,
// waste %, and price the calculator supports.
const CASES: Case[] = [
  {
    name: "user-reported case: 156 ft^2 (13x12 rect), 4in depth, 10% waste, crushed stone",
    inputs: { shape: 1, length: 13, width: 12, depth: 4, gravelType: 1, pricePerTon: 55 },
    wastePercent: 10,
    pricePerTon: 55,
  },
  {
    name: "circle: 10ft diameter, 3in depth, 5% waste, pea gravel",
    inputs: { shape: 2, diameter: 10, depth: 3, gravelType: 2, pricePerTon: 60 },
    wastePercent: 5,
    pricePerTon: 60,
  },
  {
    name: "triangle: base 20 x height 10, 6in depth, 15% waste, crushed limestone",
    inputs: { shape: 3, base: 20, triangleHeight: 10, depth: 6, gravelType: 3, pricePerTon: 45 },
    wastePercent: 15,
    pricePerTon: 45,
  },
  {
    name: "trapezoid: sides 25/15, width 10, 4in depth, 10% waste, river rock",
    inputs: { shape: 5, lengthA: 25, lengthB: 15, trapWidth: 10, depth: 4, gravelType: 4, pricePerTon: 50 },
    wastePercent: 10,
    pricePerTon: 50,
  },
  {
    name: "circular ring: outer 20 / inner 14, 2in depth, 5% waste, decomposed granite",
    inputs: { shape: 4, outerDiameter: 20, innerDiameter: 14, depth: 2, gravelType: 5, pricePerTon: 70 },
    wastePercent: 5,
    pricePerTon: 70,
  },
  {
    name: "large rectangle: 100x50, 8in depth, 15% waste, crushed stone",
    inputs: { shape: 1, length: 100, width: 50, depth: 8, gravelType: 1, pricePerTon: 40 },
    wastePercent: 15,
    pricePerTon: 40,
  },
];

const TOLERANCE = 0.015; // formatted output is rounded to 1-2 decimals

for (const { name, inputs, wastePercent, pricePerTon } of CASES) {
  test(`gravel calculator: ${name}`, () => {
    const result = gravelCalculator.calculate(inputs, wastePercent);

    const areaSqFt = shapeAreaSqFt(inputs.shape, inputs);
    const depthFt = inputs.depth / 12;
    const { cubicFt: rawCubicFt, cubicYd: rawCubicYd } = rawVolume(areaSqFt, depthFt);
    const wasteCubicYd = withWaste(rawCubicYd, wastePercent);
    const wasteCubicFt = withWaste(rawCubicFt, wastePercent);
    const expectedOrder = roundUpToIncrement(wasteCubicYd, ORDER_INCREMENT_YD);
    const density = GRAVEL_DENSITY[inputs.gravelType];
    const expectedTons = (wasteCubicYd * density) / 2000;
    const expectedCost = expectedTons * pricePerTon;
    const expectedBags = Math.ceil(wasteCubicFt / CUBIC_FT_PER_BAG);

    // --- Displayed figures match the single source of truth model ---
    assert.ok(Math.abs(secondary(result, "Required") - rawCubicYd) < TOLERANCE, "Required (raw volume)");
    assert.ok(
      Math.abs(secondary(result, `With ${wastePercent}% waste`) - wasteCubicYd) < TOLERANCE,
      "With waste (waste-adjusted volume)",
    );
    assert.ok(Math.abs(secondary(result, "Suggested order") - expectedOrder) < TOLERANCE, "Suggested order");
    assert.ok(
      Math.abs(breakdown(result, "Weight (") - expectedTons) < TOLERANCE,
      "Weight breakdown row uses the waste-adjusted volume",
    );
    assert.equal(breakdown(result, "Bags at"), expectedBags, "Bag count uses the waste-adjusted volume");
    assert.ok(Math.abs(num(result.primaryValue) - expectedCost) < TOLERANCE, "Primary cost value");

    // --- Cross-field invariants (never mix raw and waste-adjusted volumes) ---
    // volume x 27 = cubic feet
    assert.ok(Math.abs(rawCubicYd * 27 - rawCubicFt) < 1e-9, "yd3 x 27 = ft3");
    // waste volume = raw volume x (1 + waste%)
    assert.ok(Math.abs(wasteCubicYd - rawCubicYd * (1 + wastePercent / 100)) < 1e-9, "waste formula");
    // recommended order >= waste-adjusted volume
    assert.ok(expectedOrder >= wasteCubicYd - 1e-9, "order is never below what's actually needed");
    // volume x density = weight (both computed from the SAME waste-adjusted volume)
    assert.ok(Math.abs(expectedTons - (wasteCubicYd * density) / 2000) < 1e-9, "volume x density = weight");
    // weight x price = cost
    assert.ok(Math.abs(expectedCost - expectedTons * pricePerTon) < 1e-9, "weight x price = cost");
    // bags and weight/cost are derived from the SAME waste-adjusted volume, not the rounded order
    const bagsFromOrderInstead = Math.ceil((expectedOrder * 27) / CUBIC_FT_PER_BAG);
    if (expectedOrder !== wasteCubicYd) {
      assert.notEqual(
        expectedBags,
        bagsFromOrderInstead,
        "sanity check: this case actually distinguishes waste-adjusted vs. rounded-order volume",
      );
    }
  });
}

test("gravel calculator: bags and weight never mix raw/rounded volume with waste-adjusted volume", () => {
  // Regression guard for the original bug report: bags used waste-adjusted ft3 while
  // weight/cost used the rounded whole-yard order, producing figures for two different
  // physical quantities.
  const inputs = { shape: 1, length: 13, width: 12, depth: 4, gravelType: 1, pricePerTon: 55 };
  const wastePercent = 10;
  const result = gravelCalculator.calculate(inputs, wastePercent);

  const weightTons = breakdown(result, "Weight (");
  const bags = breakdown(result, "Bags at");
  const order = secondary(result, "Suggested order");

  // If weight/cost were (incorrectly) derived from the rounded order instead of the
  // waste-adjusted volume, tons would be order(2.2) * 2600 / 2000 = 2.86, not ~2.75.
  const wrongTonsFromOrder = (order * 2600) / 2000;
  assert.ok(Math.abs(weightTons - wrongTonsFromOrder) > 0.01, "weight must not be computed from the rounded order");

  // If bags were (incorrectly) derived from the rounded order instead of the
  // waste-adjusted volume, bags would be ceil(order * 27 / 0.5) = 119, not 115.
  const wrongBagsFromOrder = Math.ceil((order * 27) / 0.5);
  assert.notEqual(bags, wrongBagsFromOrder, "bags must not be computed from the rounded order");
});
