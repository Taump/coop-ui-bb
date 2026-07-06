import { describe, it, expect } from "vitest";

import { getDiscordThreadUrl } from "../getDiscordThreadUrl";

describe("getDiscordThreadUrl", () => {
  it("builds the discord channels URL from guild and post ids", () => {
    expect(getDiscordThreadUrl("111", "222")).toBe(
      "https://discord.com/channels/111/222",
    );
  });

  it("returns null without a guild id", () => {
    expect(getDiscordThreadUrl(null, "222")).toBeNull();
  });
});
