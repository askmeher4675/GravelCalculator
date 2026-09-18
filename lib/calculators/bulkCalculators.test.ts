import test from "node:test";
import assert from "node:assert/strict";
import { drivewayCalculator } from "./driveway";
import { concreteCalculator } from "./concrete";
import { mulchCalculator } from "./mulch";
import { topsoilCalculator } from "./topsoil";
import { shapeAreaSqFt } from "./shapeArea";
import { rawVolume, withWaste, roundUpToIncrement } from "./volumeModel";

function num(value: string): number {
  const n = parseFloat(value.replace(/[^0-9.\-]/g, ""));
  assert.ok(!Number.isNaN(n), `could not parse a number out of "${value}"`);
  return n;
}

const TOLERANCE = 0.02;

test("driveway calculator: weight uses the waste-adjusted volume, order rounds to 0.1 yd3", () => {
  const inputs = { shape: 1, length: 50, width: 12, baseDepth: 4, surfaceDepth: 2 };
  const wastePercent = 10;
  const result = drivewayCalculator.calculate(inputs, wastePercent);

  const area = shapeAreaSqFt(inputs.shape, inputs);
  const rawCubicFt = area * (inputs.baseDepth / 12) + area * (inputs.surfaceDepth / 12);
  const rawCubicYd = rawCubicFt / 27;
  const wasteCubicYd = withWaste(rawCubicYd, wastePercent);
  const expectedOrder = roundUpToIncrement(wasteCubicYd, 0.1);
  const expectedTons = (wasteCubicYd * 2800) / 2000;

  assert.ok(Math.abs(num(result.primaryValue) - rawCubicYd) < TOLERANCE, "primary value is the raw required volume");
  const wasteRow = result.secondary.find((s) => s.label.includes("waste"));
  assert.ok(wasteRow && Math.abs(num(wasteRow.value) - wasteCubicYd) < TOLERANCE);
  const orderRow = result.secondary.find((s) => s.label === "Suggested order");
  assert.ok(orderRow && Math.abs(num(orderRow.value) - expectedOrder) < TOLERANCE);
  const weightRow = result.secondary.find((s) => s.label === "Estimated weight");
  assert.ok(weightRow && Math.abs(num(weightRow.value) - expectedTons) < TOLERANCE, "weight must use waste-adjusted volume");
  assert.ok(expectedOrder >= wasteCubicYd - 1e-9, "order is never below what's needed");

  // Regression guard: weight must not be computed from the rounded order.
  const wrongTonsFromOrder = (expectedOrder * 2800) / 2000;
  assert.ok(Math.abs(expectedTons - wrongTonsFromOrder) > 0.01, "this case distinguishes the two bases");
  assert.ok(weightRow && Math.abs(num(weightRow.value) - wrongTonsFromOrder) > 0.01);
});

test("concrete calculator: weight and bags both use the waste-adjusted volume; order keeps quarter-yard rounding", () => {
  const inputs = { shape: 1, length: 10, width: 10, thickness: 4 };
  const wastePercent = 10;
  const result = concreteCalculator.calculate(inputs, wastePercent);

  const area = shapeAreaSqFt(inputs.shape, inputs);
  const { cubicFt: rawCubicFt, cubicYd: rawCubicYd } = rawVolume(area, inputs.thickness / 12);
  const wasteCubicYd = withWaste(rawCubicYd, wastePercent);
  const wasteCubicFt = withWaste(rawCubicFt, wastePercent);
  const expectedOrder = roundUpToIncrement(wasteCubicYd, 0.25);
  const expectedTons = (wasteCubicYd * 4050) / 2000;
  const expectedBags = Math.ceil(wasteCubicFt / 0.6);

  const orderRow = result.secondary.find((s) => s.label === "Suggested order");
  assert.ok(orderRow && Math.abs(num(orderRow.value) - expectedOrder) < TOLERANCE);
  assert.equal(expectedOrder, 1.5, "quarter-yard rounding is unchanged from before the fix");

  const weightRow = result.breakdown.find((r) => r.label.startsWith("Weight"));
  assert.ok(weightRow && Math.abs(num(weightRow.value) - expectedTons) < TOLERANCE, "weight uses waste-adjusted volume");
  const bagsRow = result.breakdown.find((r) => r.label.startsWith("Bags"));
  assert.ok(bagsRow && num(bagsRow.value) === expectedBags, "bags uses waste-adjusted volume");

  // Regression guard: weight must not be computed from the rounded quarter-yard order.
  const wrongTonsFromOrder = (expectedOrder * 4050) / 2000;
  assert.ok(Math.abs(expectedTons - wrongTonsFromOrder) > 0.01);
});

test("mulch calculator: weight and bags both use the waste-adjusted volume (already correct, now with 0.1 yd3 order)", () => {
  const inputs = { shape: 1, length: 15, width: 8, depth: 3 };
  const wastePercent = 10;
  const result = mulchCalculator.calculate(inputs, wastePercent);

  const area = shapeAreaSqFt(inputs.shape, inputs);
  const { cubicFt: rawCubicFt, cubicYd: rawCubicYd } = rawVolume(area, inputs.depth / 12);
  const wasteCubicYd = withWaste(rawCubicYd, wastePercent);
  const wasteCubicFt = withWaste(rawCubicFt, wastePercent);
  const expectedOrder = roundUpToIncrement(wasteCubicYd, 0.1);
  const expectedLbs = wasteCubicYd * 500;
  const expectedBags = Math.ceil(wasteCubicFt / 2);

  const orderRow = result.secondary.find((s) => s.label === "Suggested order (bulk)");
  assert.ok(orderRow && Math.abs(num(orderRow.value) - expectedOrder) < TOLERANCE);
  const weightRow = result.breakdown.find((r) => r.label.startsWith("Weight"));
  assert.ok(weightRow && Math.abs(num(weightRow.value) - expectedLbs) < 1, "weight uses waste-adjusted volume");
  const bagsRow = result.breakdown.find((r) => r.label.startsWith("Bags"));
  assert.ok(bagsRow && num(bagsRow.value) === expectedBags);
});

test("topsoil calculator: weight uses the waste-adjusted volume, order rounds to 0.1 yd3", () => {
  const inputs = { shape: 1, length: 12, width: 6, depth: 6 };
  const wastePercent = 10;
  const result = topsoilCalculator.calculate(inputs, wastePercent);

  const area = shapeAreaSqFt(inputs.shape, inputs);
  const { cubicYd: rawCubicYd } = rawVolume(area, inputs.depth / 12);
  const wasteCubicYd = withWaste(rawCubicYd, wastePercent);
  const expectedOrder = roundUpToIncrement(wasteCubicYd, 0.1);
  const expectedTons = (wasteCubicYd * 2200) / 2000;

  assert.ok(Math.abs(expectedTons - 1.6133) < 0.001, "matches the corrected 1.61-ton example");
  const orderRow = result.secondary.find((s) => s.label === "Suggested order");
  assert.ok(orderRow && Math.abs(num(orderRow.value) - expectedOrder) < TOLERANCE);
  const weightRow = result.secondary.find((s) => s.label === "Estimated weight");
  assert.ok(weightRow && Math.abs(num(weightRow.value) - expectedTons) < TOLERANCE);
});
