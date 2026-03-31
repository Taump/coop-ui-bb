import { describe, it, expect } from "vitest";
import { tooManyDecimals } from "../tooManyDecimals";

describe("tooManyDecimals", () => {
  it("returns false for integer", () => {
    expect(tooManyDecimals("100", 9)).toBe(false);
  });

  it("returns false when decimals equal max", () => {
    expect(tooManyDecimals("1.123456789", 9)).toBe(false);
  });

  it("returns false when decimals less than max", () => {
    expect(tooManyDecimals("1.12", 9)).toBe(false);
  });

  it("returns true when decimals exceed max", () => {
    expect(tooManyDecimals("1.1234567890", 9)).toBe(true);
  });

  it("returns true for 1 decimal when max is 0", () => {
    expect(tooManyDecimals("1.1", 0)).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(tooManyDecimals("", 9)).toBe(false);
  });

  it("returns false for no decimal point", () => {
    expect(tooManyDecimals("12345", 2)).toBe(false);
  });
});
