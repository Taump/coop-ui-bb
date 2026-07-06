import { describe, it, expect } from "vitest";

import { getDiscordUserId } from "../getDiscordUserId";
import { emptyAttestations } from "../parseAttestations";

const withDiscord = (profile: Record<string, unknown>) => ({
  ...emptyAttestations(),
  discord: profile,
});

describe("getDiscordUserId", () => {
  it("reads a string userId", () => {
    expect(
      getDiscordUserId(withDiscord({ userId: "411516467402506240" })),
    ).toBe("411516467402506240");
  });

  it("reads a numeric userId (normalized by getProfileField)", () => {
    expect(getDiscordUserId(withDiscord({ userId: 12345 }))).toBe("12345");
  });

  it("falls back to the legacy user_id key", () => {
    expect(getDiscordUserId(withDiscord({ user_id: "67890" }))).toBe("67890");
  });

  it("prefers userId over user_id when both are present", () => {
    expect(
      getDiscordUserId(withDiscord({ userId: "111", user_id: "222" })),
    ).toBe("111");
  });

  it("returns null without a discord profile", () => {
    expect(getDiscordUserId(emptyAttestations())).toBeNull();
    expect(getDiscordUserId(null)).toBeNull();
    expect(getDiscordUserId(undefined)).toBeNull();
  });

  it("rejects non-snowflake values", () => {
    expect(getDiscordUserId(withDiscord({ userId: "abc" }))).toBeNull();
    expect(
      getDiscordUserId(withDiscord({ userId: "1".repeat(21) })),
    ).toBeNull();
    expect(getDiscordUserId(withDiscord({ userId: "" }))).toBeNull();
  });
});
