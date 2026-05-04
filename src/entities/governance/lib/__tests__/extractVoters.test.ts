import { describe, it, expect } from "vitest";

import { extractVoters } from "../extractVoters";
import { getValueKey } from "../getValueKey";

describe("extractVoters", () => {
  it("matches voters with the same short value", async () => {
    const vars = {
      votes_ALICE: {
        daily_locked_reward: { value: 0.005, sqrt_balance: 100 },
      },
      votes_BOB: {
        daily_locked_reward: { value: 0.005, sqrt_balance: 50 },
      },
      votes_CAROL: {
        daily_locked_reward: { value: 0.01, sqrt_balance: 200 },
      },
    };

    const voters = await extractVoters(vars, "daily_locked_reward", "0.005");

    expect(voters).toHaveLength(2);
    expect(voters.map((v) => v.address)).toEqual(["ALICE", "BOB"]);
  });

  it("sorts by sqrt_balance descending", async () => {
    const vars = {
      votes_A: { name: { value: "x", sqrt_balance: 10 } },
      votes_B: { name: { value: "x", sqrt_balance: 30 } },
      votes_C: { name: { value: "x", sqrt_balance: 20 } },
    };

    const voters = await extractVoters(vars, "name", "x");
    expect(voters.map((v) => v.address)).toEqual(["B", "C", "A"]);
    expect(voters.map((v) => v.sqrtBalance)).toEqual([30, 20, 10]);
  });

  it("ignores users that did not vote on this parameter", async () => {
    const vars = {
      votes_A: { other_param: { value: 1, sqrt_balance: 100 } },
      votes_B: { name: { value: "x", sqrt_balance: 50 } },
    };

    const voters = await extractVoters(vars, "name", "x");
    expect(voters).toHaveLength(1);
    expect(voters[0].address).toBe("B");
  });

  it("ignores entries with missing or invalid sqrt_balance", async () => {
    const vars = {
      votes_A: { name: { value: "x", sqrt_balance: 50 } },
      votes_B: { name: { value: "x" } },
      votes_C: { name: { value: "x", sqrt_balance: 0 } },
      votes_D: { name: { value: "x", sqrt_balance: "bad" } },
    };

    const voters = await extractVoters(vars, "name", "x");
    expect(voters).toHaveLength(1);
    expect(voters[0].address).toBe("A");
  });

  it("ignores non-votes_ keys", async () => {
    const vars = {
      votes_A: { name: { value: "x", sqrt_balance: 50 } },
      support_name_x: 50,
      user_A: { something: 1 },
      leader_name: "x",
    };

    const voters = await extractVoters(vars, "name", "x");
    expect(voters).toHaveLength(1);
    expect(voters[0].address).toBe("A");
  });

  it("skips entries whose value would be hashed when matching short valueKey", async () => {
    const longValue = "X".repeat(150);
    const vars = {
      votes_A: { name: { value: "x", sqrt_balance: 50 } },
      votes_B: { name: { value: longValue, sqrt_balance: 999 } },
    };

    const voters = await extractVoters(vars, "name", "x");
    expect(voters).toHaveLength(1);
    expect(voters[0].address).toBe("A");
  });

  it("matches hashed valueKey by sha256 of value", async () => {
    const longValue = "addr1:addr2:" + "Z".repeat(120);
    const expectedKey = await getValueKey(longValue);
    expect(expectedKey.startsWith("hash_")).toBe(true);

    const vars = {
      votes_A: { name: { value: longValue, sqrt_balance: 77 } },
      votes_B: { name: { value: "short", sqrt_balance: 999 } },
    };

    const voters = await extractVoters(vars, "name", expectedKey);
    expect(voters).toHaveLength(1);
    expect(voters[0].address).toBe("A");
    expect(voters[0].sqrtBalance).toBe(77);
  });

  it("returns empty array when nothing matches", async () => {
    const vars = {
      votes_A: { name: { value: "y", sqrt_balance: 50 } },
    };

    const voters = await extractVoters(vars, "name", "x");
    expect(voters).toEqual([]);
  });
});
