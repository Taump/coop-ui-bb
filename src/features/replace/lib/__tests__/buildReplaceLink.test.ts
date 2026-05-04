import { describe, it, expect } from "vitest";

import { buildReplaceLink } from "../buildReplaceLink";

const coopAsset = "abc123def456ghi789jkl012mno345pq";

const defaults = {
  coopAsset,
  coopDecimals: 9,
};

describe("buildReplaceLink", () => {
  it("returns null for empty amount", () => {
    expect(buildReplaceLink({ amount: "", ...defaults })).toBeNull();
  });

  it("returns null for zero amount", () => {
    expect(buildReplaceLink({ amount: "0", ...defaults })).toBeNull();
  });

  it("returns null for negative amount", () => {
    expect(buildReplaceLink({ amount: "-5", ...defaults })).toBeNull();
  });

  it("returns null for non-numeric amount", () => {
    expect(buildReplaceLink({ amount: "abc", ...defaults })).toBeNull();
  });

  it("returns null when too many decimals", () => {
    expect(
      buildReplaceLink({ amount: "1.1234567890", ...defaults }),
    ).toBeNull();
  });

  it("returns null when coopAsset is undefined", () => {
    expect(
      buildReplaceLink({ amount: "1", coopAsset: undefined, coopDecimals: 9 }),
    ).toBeNull();
  });

  it("returns null when amount rounds to zero atomic units", () => {
    expect(
      buildReplaceLink({ amount: "0.0000000001", ...defaults }),
    ).toBeNull();
  });

  it("generates a valid obyte link with COOP asset", () => {
    const link = buildReplaceLink({ amount: "1", ...defaults });
    expect(link).not.toBeNull();
    expect(link).toContain("obyte");
    expect(link).toContain(`asset=${encodeURIComponent(coopAsset)}`);
    expect(link).toContain("base64data");
  });

  it("uses correct atomic amount (no bounce fee)", () => {
    const link = buildReplaceLink({ amount: "1", ...defaults });
    // 1 COOP × 10^9 = 1_000_000_000 atomic, no bounce-fee added because asset is COOP
    expect(link).toContain("amount=1000000000");
  });

  it("encodes replace: 1 in base64 data", () => {
    const link = buildReplaceLink({ amount: "1", ...defaults })!;
    const url = new URL(link);
    const b64 = url.searchParams.get("base64data");
    expect(b64).toBeTruthy();
    const decoded = JSON.parse(
      Buffer.from(b64!, "base64").toString("utf8"),
    ) as { replace: number };
    expect(decoded.replace).toBe(1);
  });

  it("rounds atomic amount to integer", () => {
    const link = buildReplaceLink({
      amount: "0.123456789",
      ...defaults,
    });
    expect(link).toContain("amount=123456789");
  });
});
