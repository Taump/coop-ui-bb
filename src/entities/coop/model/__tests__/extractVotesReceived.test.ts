import { describe, it, expect } from "vitest";

import { extractVotesReceived } from "../useVotesReceived";

describe("extractVotesReceived", () => {
  it("returns empty array when address is undefined", () => {
    const vars = {
      vote_A_B: { votes: 5, ts: 1 },
    };
    expect(extractVotesReceived(vars, undefined)).toEqual([]);
  });

  it("returns empty array when no matching votes", () => {
    const vars = {
      vote_A_B: { votes: 5, ts: 1 },
      user_C: { total_balance: 100 },
    };
    expect(extractVotesReceived(vars, "C")).toEqual([]);
  });

  it("finds votes by suffix match", () => {
    const vars = {
      vote_VOTER1_TARGET: { votes: 3, ts: 100 },
      vote_VOTER2_TARGET: { votes: 5, ts: 200 },
      vote_VOTER1_OTHER: { votes: 1, ts: 50 },
    };
    const result = extractVotesReceived(vars, "TARGET");
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.fromAddress).sort()).toEqual([
      "VOTER1",
      "VOTER2",
    ]);
  });

  it("extracts fromAddress correctly", () => {
    const vars = {
      vote_ABCDEF_TARGET: { votes: 2, ts: 100 },
    };
    const result = extractVotesReceived(vars, "TARGET");
    expect(result[0].fromAddress).toBe("ABCDEF");
    expect(result[0].votes).toBe(2);
    expect(result[0].ts).toBe(100);
  });

  it("sorts by timestamp ascending", () => {
    const vars = {
      vote_A_T: { votes: 1, ts: 300 },
      vote_B_T: { votes: 1, ts: 100 },
      vote_C_T: { votes: 1, ts: 200 },
    };
    const result = extractVotesReceived(vars, "T");
    expect(result.map((r) => r.fromAddress)).toEqual(["B", "C", "A"]);
  });

  it("ignores keys without vote_ prefix", () => {
    const vars = {
      user_X_T: { votes: 5, ts: 1 },
      other_A_T: { votes: 5, ts: 1 },
    };
    expect(extractVotesReceived(vars, "T")).toEqual([]);
  });

  it("ignores entries with missing/invalid votes", () => {
    const vars = {
      vote_A_T: { votes: 5, ts: 1 },
      vote_B_T: null,
      vote_C_T: { ts: 2 },
      vote_D_T: { votes: "bad", ts: 3 },
    };
    const result = extractVotesReceived(vars, "T");
    expect(result).toHaveLength(1);
    expect(result[0].fromAddress).toBe("A");
  });

  it("does not match partial address at the end", () => {
    const vars = {
      vote_X_LONGTARGET: { votes: 5, ts: 1 },
    };
    expect(extractVotesReceived(vars, "TARGET")).toEqual([]);
  });

  it("reads strength when present", () => {
    const vars = {
      vote_A_T: { votes: 5, strength: 2, ts: 1 },
      vote_B_T: { votes: 7, strength: 3, ts: 2 },
    };
    const result = extractVotesReceived(vars, "T");
    expect(result).toHaveLength(2);
    const a = result.find((r) => r.fromAddress === "A");
    const b = result.find((r) => r.fromAddress === "B");
    expect(a?.strength).toBe(2);
    expect(b?.strength).toBe(3);
  });

  it("leaves strength undefined when absent (legacy votes)", () => {
    const vars = {
      vote_A_T: { votes: 5, ts: 1 },
    };
    const result = extractVotesReceived(vars, "T");
    expect(result[0].strength).toBeUndefined();
  });

  it("ignores non-numeric strength values", () => {
    const vars = {
      vote_A_T: { votes: 5, strength: "high", ts: 1 },
    };
    const result = extractVotesReceived(vars, "T");
    expect(result[0].strength).toBeUndefined();
  });
});
