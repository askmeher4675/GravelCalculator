import test from "node:test";
import assert from "node:assert/strict";
import { rawVolume, withWaste, roundUpToIncrement, CUBIC_FT_PER_CUBIC_YD } from "./volumeModel";

test("rawVolume: area x depth, and the yd3 conversion divides by 27", () => {
  const { cubicFt, cubicYd } = rawVolume(156, 4 / 12);
  assert.equal(cubicFt, 52);
  assert.ok(Math.abs(cubicYd - 52 / 27) < 1e-9);
  assert.ok(Math.abs(cubicYd * CUBIC_FT_PER_CUBIC_YD - cubicFt) < 1e-9);
});

test("withWaste: waste volume = raw volume x (1 + waste%)", () => {
  assert.ok(Math.abs(withWaste(100, 10) - 110) < 1e-9);
  assert.ok(Math.abs(withWaste(100, 0) - 100) < 1e-9);
  assert.ok(Math.abs(withWaste(52 / 27, 10) - (52 / 27) * 1.1) < 1e-9);
});

test("roundUpToIncrement: the user's exact reported case rounds 2.1185 -> 2.2", () => {
  assert.equal(roundUpToIncrement(2.1185185185185187, 0.1), 2.2);
});

test("roundUpToIncrement: 2.26 -> 2.3 per the requested display rounding", () => {
  assert.equal(roundUpToIncrement(2.26, 0.1), 2.3);
});

test("roundUpToIncrement: never rounds below the input value (order >= waste-adjusted volume)", () => {
  const cases = [0.01, 1, 1.99999, 2.000001, 2.1, 12.2222, 100 / 3];
  for (const value of cases) {
    const rounded = roundUpToIncrement(value, 0.1);
    assert.ok(rounded >= value - 1e-9, `${rounded} should be >= ${value}`);
  }
});

test("roundUpToIncrement: exact multiples of the increment are unchanged (no floating point drift)", () => {
  assert.equal(roundUpToIncrement(2.2, 0.1), 2.2);
  assert.equal(roundUpToIncrement(1.5, 0.25), 1.5);
  assert.equal(roundUpToIncrement(0.3, 0.1), 0.3); // classic float trap: 0.1+0.1+0.1 !== 0.3
});

test("roundUpToIncrement: quarter-yard increment used by the Concrete Calculator", () => {
  assert.equal(roundUpToIncrement(1.358, 0.25), 1.5);
  assert.equal(roundUpToIncrement(1.25, 0.25), 1.25);
});
