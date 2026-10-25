// Display formatting: units, rounding at unit thresholds, and labels the HUD shows.

import { expect, test } from "bun:test";
import { aiLabel, fmtCountdown, fmtGdp, fmtPop, relationWord } from "../src/game/format.ts";

test("fmtGdp picks the unit for each size of economy", () => {
  expect(fmtGdp(4.25)).toBe("$4.3bn");
  expect(fmtGdp(842)).toBe("$842bn");
  expect(fmtGdp(1410)).toBe("$1.41tn");
  expect(fmtGdp(27_400)).toBe("$27.4tn");
  expect(fmtGdp(NaN)).toBe("—");
  expect(fmtGdp(Infinity)).toBe("—");
});

test("fmtGdp moves a value that rounds up into the next unit", () => {
  expect(fmtGdp(999.6)).toBe("$1.00tn");
  expect(fmtGdp(9.96)).toBe("$10bn");
  expect(fmtGdp(9_999.6)).toBe("$10.0tn");
  // Values that round down stay in the smaller unit.
  expect(fmtGdp(999.4)).toBe("$999bn");
  expect(fmtGdp(9.94)).toBe("$9.9bn");
  expect(fmtGdp(9_994)).toBe("$9.99tn");
});

test("fmtPop picks the unit for each size of population", () => {
  expect(fmtPop(0.54)).toBe("540k");
  expect(fmtPop(5.43)).toBe("5.4m");
  expect(fmtPop(83.2)).toBe("83m");
  expect(fmtPop(1410)).toBe("1.41bn");
  expect(fmtPop(NaN)).toBe("—");
});

test("fmtPop moves a value that rounds up into the next unit", () => {
  expect(fmtPop(999.7)).toBe("1.00bn");
  expect(fmtPop(0.9996)).toBe("1.0m");
  expect(fmtPop(9.96)).toBe("10m");
  // Values that round down stay in the smaller unit.
  expect(fmtPop(999.4)).toBe("999m");
  expect(fmtPop(0.9994)).toBe("999k");
  expect(fmtPop(9.94)).toBe("9.9m");
});

test("relationWord changes at each boundary", () => {
  expect(relationWord(100)).toBe("Allied");
  expect(relationWord(70)).toBe("Allied");
  expect(relationWord(69.9)).toBe("Friendly");
  expect(relationWord(35)).toBe("Friendly");
  expect(relationWord(34.9)).toBe("Cordial");
  expect(relationWord(10)).toBe("Cordial");
  expect(relationWord(9.9)).toBe("Neutral");
  expect(relationWord(0)).toBe("Neutral");
  expect(relationWord(-9.9)).toBe("Neutral");
  expect(relationWord(-10)).toBe("Cool");
  expect(relationWord(-34.9)).toBe("Cool");
  expect(relationWord(-35)).toBe("Hostile");
  expect(relationWord(-69.9)).toBe("Hostile");
  expect(relationWord(-70)).toBe("Enemies");
  expect(relationWord(-100)).toBe("Enemies");
});

test("fmtCountdown rounds up to whole seconds and never goes negative", () => {
  expect(fmtCountdown(0)).toBe("0:00");
  expect(fmtCountdown(-5_000)).toBe("0:00");
  expect(fmtCountdown(1)).toBe("0:01");
  expect(fmtCountdown(59_001)).toBe("1:00");
  expect(fmtCountdown(61_000)).toBe("1:01");
  expect(fmtCountdown(600_000)).toBe("10:00");
});

test("aiLabel names the mock or the configured backends", () => {
  expect(aiLabel({ provider: "mock" })).toBe("Mock AI");
  expect(aiLabel({ provider: "openrouter" })).toBe("OpenRouter");
  expect(aiLabel({ provider: "openrouter", backends: [] })).toBe("OpenRouter");
  expect(aiLabel({ provider: "anthropic", backends: ["anthropic"] })).toBe("Anthropic");
  expect(aiLabel({ provider: "openrouter", backends: ["openrouter", "anthropic", "local"] })).toBe("OpenRouter + Anthropic + Local");
  expect(aiLabel({ provider: "custom", backends: ["custom"] })).toBe("custom");
});
