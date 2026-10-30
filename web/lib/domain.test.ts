import assert from "node:assert/strict";
import test from "node:test";
import { evaluateEvent, type ColdChainEvent } from "./domain.ts";
import fixture from "../data/demo/excursion-01.json" with { type: "json" };

function fixtureCopy(): ColdChainEvent {
  return structuredClone(fixture as ColdChainEvent);
}

test("fixture yields a visible high excursion and two candidate lots", () => {
  const result = evaluateEvent(fixtureCopy());
  assert.equal(result.assessment, "EXCURSION_OBSERVED");
  assert.equal(result.state, "REVIEW_REQUIRED");
  assert.equal(result.excursions.length, 1);
  assert.equal(result.excursions[0].kind, "HIGH");
  assert.equal(result.excursions[0].endAt, "2026-10-30T09:37:00Z");
  assert.deepEqual(result.candidateLots.map((lot) => lot.scope), ["CANDIDATE", "CANDIDATE", "EXCLUDED"]);
  assert.ok(result.unknowns.some((item) => item.includes("Calibration reference")));
  assert.ok(result.draft.citations.includes("SRC-DEMO-POLICY-02"));
});

test("a large sampling gap splits excursions without inventing intermediate readings", () => {
  const event = fixtureCopy();
  event.productPolicy.maxSampleGapMinutes = 10;
  event.readings = [
    { readingId: "GAP-A", observedAt: "2026-10-30T09:00:00Z", value: 9, unit: "C" },
    { readingId: "GAP-B", observedAt: "2026-10-30T09:45:00Z", value: 10, unit: "C" },
  ];
  const result = evaluateEvent(event);
  assert.equal(result.excursions.length, 2);
  assert.ok(result.warnings.some((item) => item.includes("no values were interpolated")));
  assert.equal(result.readings.length, 2);
});

test("policy boundary readings are in range", () => {
  const event = fixtureCopy();
  event.readings = [
    { readingId: "BOUND-LOW", observedAt: "2026-10-30T09:00:00Z", value: 2, unit: "C" },
    { readingId: "BOUND-HIGH", observedAt: "2026-10-30T09:10:00Z", value: 8, unit: "C" },
  ];
  const result = evaluateEvent(event);
  assert.equal(result.assessment, "NO_EXCURSION_OBSERVED");
  assert.deepEqual(result.readings.map((reading) => reading.band), ["IN", "IN"]);
});

test("Fahrenheit input normalizes to Celsius while preserving source values", () => {
  const event = fixtureCopy();
  event.productPolicy = { ...event.productPolicy, lowerBound: 35.6, upperBound: 46.4, unit: "F" };
  event.readings = [
    { readingId: "F-32", observedAt: "2026-10-30T09:00:00Z", value: 32, unit: "F" },
    { readingId: "F-50", observedAt: "2026-10-30T09:10:00Z", value: 50, unit: "F" },
  ];
  const result = evaluateEvent(event);
  assert.ok(Math.abs(result.policy.lowerBound - 2) < 1e-9);
  assert.equal(result.readings[0].normalizedCelsius, 0);
  assert.equal(result.readings[0].value, 32);
  assert.equal(result.readings[0].unit, "F");
  assert.equal(result.readings[1].band, "HIGH");
});

test("out-of-order source readings remain visible and mark coverage incomplete", () => {
  const event = fixtureCopy();
  event.readings.reverse();
  const result = evaluateEvent(event);
  assert.equal(result.readings[0].readingId, "RD-DEMO-004");
  assert.ok(result.warnings.some((item) => item.includes("out-of-order")));
  assert.equal(result.coverage, "INCOMPLETE");
});

test("missing inventory makes candidate scope incomplete", () => {
  const event = fixtureCopy();
  event.inventorySnapshot = [];
  const result = evaluateEvent(event);
  assert.equal(result.state, "SCOPE_INCOMPLETE");
  assert.ok(result.unknowns.some((item) => item.includes("Inventory snapshot is missing")));
});

test("rejects timestamps without an explicit timezone", () => {
  const event = fixtureCopy();
  event.readings[0].observedAt = "2026-10-30T09:00:00";
  assert.throws(() => evaluateEvent(event), /UTC offset or Z timezone/);
});

test("does not apply a policy outside its effective period", () => {
  const event = fixtureCopy();
  event.readings = [
    { readingId: "BEFORE-POLICY", observedAt: "2026-09-30T23:59:00Z", value: 40, unit: "C" },
    { readingId: "IN-POLICY", observedAt: "2026-10-02T00:00:00Z", value: 5, unit: "C" },
  ];
  const result = evaluateEvent(event);
  assert.equal(result.readings[0].band, "OUTSIDE_POLICY_PERIOD");
  assert.equal(result.readings[0].outOfRange, false);
  assert.equal(result.assessment, "POLICY_COVERAGE_INCOMPLETE");
  assert.ok(result.unknowns.some((item) => item.includes("falls outside policy")));
  assert.ok(result.draft.text.includes("policy coverage incomplete"));
  assert.ok(result.draft.text.includes("policy-applicable peak of 5.0°C"));
});
