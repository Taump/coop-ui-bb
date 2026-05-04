import { describe, it, expect } from "vitest";

import { extractVotesGiven } from "../useVotesGiven";

describe("extractVotesGiven", () => {
  it("returns empty array when address is undefined", () => {
    const vars = {
      vote_A_B: { votes: 5, ts: 1 },
    };
    expect(extractVotesGiven(vars, undefined)).toEqual([]);
  });

  it("returns empty array when no matching votes", () => {
    const vars = {
      vote_A_B: { votes: 5, ts: 1 },
      user_C: { total_balance: 100 },
    };
    expect(extractVotesGiven(vars, "C")).toEqual([]);
  });

  it("finds votes cast by address", () => {
    const vars = {
      vote_VOTER_TARGET1: { votes: 3, ts: 100 },
      vote_VOTER_TARGET2: { votes: 5, ts: 200 },
      vote_OTHER_TARGET1: { votes: 1, ts: 50 },
    };
    const result = extractVotesGiven(vars, "VOTER");
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.toAddress).sort()).toEqual([
      "TARGET1",
      "TARGET2",
    ]);
  });

  it("extracts toAddress correctly", () => {
    const vars = {
      vote_VOTER_XYZ123: { votes: 2, ts: 100 },
    };
    const result = extractVotesGiven(vars, "VOTER");
    expect(result[0].toAddress).toBe("XYZ123");
    expect(result[0].votes).toBe(2);
    expect(result[0].ts).toBe(100);
  });

  it("sorts by timestamp ascending", () => {
    const vars = {
      vote_V_A: { votes: 1, ts: 300 },
      vote_V_B: { votes: 1, ts: 100 },
      vote_V_C: { votes: 1, ts: 200 },
    };
    const result = extractVotesGiven(vars, "V");
    expect(result.map((r) => r.toAddress)).toEqual(["B", "C", "A"]);
  });

  it("ignores keys without vote_ prefix", () => {
    const vars = {
      user_V_T: { votes: 5, ts: 1 },
      other_V_T: { votes: 5, ts: 1 },
    };
    expect(extractVotesGiven(vars, "V")).toEqual([]);
  });

  it("ignores entries with missing/invalid votes", () => {
    const vars = {
      vote_V_A: { votes: 5, ts: 1 },
      vote_V_B: null,
      vote_V_C: { ts: 2 },
      vote_V_D: { votes: "bad", ts: 3 },
    };
    const result = extractVotesGiven(vars, "V");
    expect(result).toHaveLength(1);
    expect(result[0].toAddress).toBe("A");
  });

  it("does not match when address is a prefix of another", () => {
    const vars = {
      vote_VOTERX_T: { votes: 5, ts: 1 },
    };
    expect(extractVotesGiven(vars, "VOTER")).toEqual([]);
  });

  it("reads strength when present", () => {
    const vars = {
      vote_V_A: { votes: 5, strength: 1, ts: 1 },
      vote_V_B: { votes: 7, strength: 3, ts: 2 },
    };
    const result = extractVotesGiven(vars, "V");
    expect(result).toHaveLength(2);
    const a = result.find((r) => r.toAddress === "A");
    const b = result.find((r) => r.toAddress === "B");
    expect(a?.strength).toBe(1);
    expect(b?.strength).toBe(3);
  });

  it("leaves strength undefined when absent (legacy votes)", () => {
    const vars = {
      vote_V_A: { votes: 5, ts: 1 },
    };
    const result = extractVotesGiven(vars, "V");
    expect(result[0].strength).toBeUndefined();
  });

  it("ignores non-numeric strength values", () => {
    const vars = {
      vote_V_A: { votes: 5, strength: "low", ts: 1 },
    };
    const result = extractVotesGiven(vars, "V");
    expect(result[0].strength).toBeUndefined();
  });
});
