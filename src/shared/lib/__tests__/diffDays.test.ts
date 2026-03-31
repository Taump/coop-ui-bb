import { describe, it, expect } from "vitest";
import { diffDays } from "../diffDays";

describe("diffDays", () => {
  it("returns 0 for the same date", () => {
    const d = new Date(2026, 0, 1);
    expect(diffDays(d, d)).toBe(0);
  });

  it("returns positive for future date", () => {
    const from = new Date(2026, 0, 1);
    const to = new Date(2026, 0, 11);
    expect(diffDays(from, to)).toBe(10);
  });

  it("returns negative for past date", () => {
    const from = new Date(2026, 0, 11);
    const to = new Date(2026, 0, 1);
    expect(diffDays(from, to)).toBe(-10);
  });

  it("handles exactly 365 days", () => {
    const from = new Date(2026, 0, 1);
    const to = new Date(2027, 0, 1);
    expect(diffDays(from, to)).toBe(365);
  });

  it("rounds to nearest day", () => {
    const from = new Date(2026, 0, 1, 0, 0, 0);
    const to = new Date(2026, 0, 2, 12, 0, 0);
    expect(diffDays(from, to)).toBe(2);
  });
});
