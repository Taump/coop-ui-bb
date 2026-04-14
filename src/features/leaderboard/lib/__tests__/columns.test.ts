import { describe, it, expect } from "vitest";
import { getColumns } from "../columns";

const defaultOptions = {
  coopDecimals: 9,
  gbyteDecimals: 9,
  coopSymbol: "COOP",
  connectedAddress: undefined,
};

describe("getColumns", () => {
  it("returns 4 columns", () => {
    const columns = getColumns(defaultOptions);
    expect(columns).toHaveLength(4);
  });

  it("has correct column ids", () => {
    const columns = getColumns(defaultOptions);
    expect(columns.map((c) => c.id)).toEqual([
      "rank",
      "address",
      "total_balance",
      "votes",
    ]);
  });

  it("disables sorting for rank and address", () => {
    const columns = getColumns(defaultOptions);
    const rank = columns.find((c) => c.id === "rank");
    const address = columns.find((c) => c.id === "address");
    expect(rank?.enableSorting).toBe(false);
    expect(address?.enableSorting).toBe(false);
  });

  it("enables sorting for total_balance and votes by default", () => {
    const columns = getColumns(defaultOptions);
    const balance = columns.find((c) => c.id === "total_balance");
    const votes = columns.find((c) => c.id === "votes");
    expect(balance?.enableSorting).not.toBe(false);
    expect(votes?.enableSorting).not.toBe(false);
  });
});
