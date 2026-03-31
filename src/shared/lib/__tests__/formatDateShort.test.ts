import { describe, it, expect } from "vitest";
import { formatDateShort } from "../formatDateShort";

describe("formatDateShort", () => {
  it("returns a string containing the year", () => {
    const date = new Date(2027, 2, 15);
    const result = formatDateShort(date);
    expect(result).toContain("2027");
  });

  it("returns a string containing the day", () => {
    const date = new Date(2027, 2, 15);
    const result = formatDateShort(date);
    expect(result).toContain("15");
  });

  it("returns a non-empty string", () => {
    const date = new Date(2026, 0, 1);
    expect(formatDateShort(date).length).toBeGreaterThan(0);
  });
});
