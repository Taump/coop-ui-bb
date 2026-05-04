import { describe, it, expect } from "vitest";
import { extractTopUsers } from "../useAllUsers";

function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    balance: 0,
    bytes_balance: 0,
    total_balance: 0,
    unlock_date: "2027-01-01",
    reg_date: "2026-01-01",
    reg_ts: 1700000000,
    last_ts: 1700000000,
    last_locked_emissions_per_vote: 0,
    last_liquid_emissions_per_vote: 0,
    last_locked_emissions_per_vb: 0,
    last_liquid_emissions_per_vb: 0,
    ...overrides,
  };
}

describe("extractTopUsers", () => {
  it("returns empty array for empty vars", () => {
    expect(extractTopUsers({})).toEqual([]);
  });

  it("filters only user_ keys", () => {
    const vars: Record<string, unknown> = {
      constants: { asset: "abc", launch_ts: 1700000000, governance_aa: "def" },
      state: { total_locked: 100 },
      vote_ADDR1_ADDR2: { votes: 5, ts: 1700000000 },
      user_ADDR1: makeUser({ total_balance: 1000, votes: 10 }),
      user_ADDR2: makeUser({ total_balance: 500 }),
    };

    const result = extractTopUsers(vars);
    expect(result).toHaveLength(2);
    expect(result.every((u) => u.address.length > 0)).toBe(true);
  });

  it("extracts address from key", () => {
    const vars: Record<string, unknown> = {
      user_ABCDEF123456: makeUser({ total_balance: 100 }),
    };

    const result = extractTopUsers(vars);
    expect(result[0].address).toBe("ABCDEF123456");
  });

  it("sorts by total_balance descending", () => {
    const vars: Record<string, unknown> = {
      user_A: makeUser({ total_balance: 100 }),
      user_B: makeUser({ total_balance: 500 }),
      user_C: makeUser({ total_balance: 300 }),
    };

    const result = extractTopUsers(vars);
    expect(result.map((u) => u.address)).toEqual(["B", "C", "A"]);
  });

  it("limits results to specified limit", () => {
    const vars: Record<string, unknown> = {};
    for (let i = 0; i < 10; i++) {
      vars[`user_ADDR${i}`] = makeUser({ total_balance: i * 100 });
    }

    const result = extractTopUsers(vars, 3);
    expect(result).toHaveLength(3);
    expect(result[0].total_balance).toBe(900);
  });

  it("defaults votes to 0 when undefined", () => {
    const vars: Record<string, unknown> = {
      user_A: makeUser({ total_balance: 100 }),
    };

    const result = extractTopUsers(vars);
    expect(result[0].votes).toBe(0);
  });

  it("preserves votes when present", () => {
    const vars: Record<string, unknown> = {
      user_A: makeUser({ total_balance: 100, votes: 42 }),
    };

    const result = extractTopUsers(vars);
    expect(result[0].votes).toBe(42);
  });

  it("includes balance and bytes_balance in output", () => {
    const vars: Record<string, unknown> = {
      user_A: makeUser({
        balance: 500,
        bytes_balance: 200,
        total_balance: 700,
      }),
    };

    const result = extractTopUsers(vars);
    expect(result[0].balance).toBe(500);
    expect(result[0].bytes_balance).toBe(200);
  });

  it("skips entries with invalid total_balance", () => {
    const vars: Record<string, unknown> = {
      user_A: makeUser({ total_balance: 100 }),
      user_B: { some: "garbage" },
      user_C: null,
    };

    const result = extractTopUsers(vars);
    expect(result).toHaveLength(1);
    expect(result[0].address).toBe("A");
  });

  it("defaults limit to 100", () => {
    const vars: Record<string, unknown> = {};
    for (let i = 0; i < 150; i++) {
      vars[`user_ADDR${String(i).padStart(3, "0")}`] = makeUser({
        total_balance: i,
      });
    }

    const result = extractTopUsers(vars);
    expect(result).toHaveLength(100);
    expect(result[0].total_balance).toBe(149);
  });
});
