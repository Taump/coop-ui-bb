import { useMemo } from "react";
import { useStore } from "@tanstack/react-store";

import { coopStore } from "./store";

export interface VoteRecord {
  fromAddress: string;
  votes: number;
  strength?: number;
  ts: number;
}

const VOTE_PREFIX = "vote_";

export function extractVotesReceived(
  vars: Record<string, unknown>,
  address: string | undefined,
): VoteRecord[] {
  if (!address) return [];
  const suffix = `_${address}`;
  const records: VoteRecord[] = [];

  for (const key in vars) {
    if (!key.startsWith(VOTE_PREFIX) || !key.endsWith(suffix)) continue;
    const val = vars[key] as
      | { votes: number; strength?: number; ts: number }
      | null;
    if (!val || typeof val.votes !== "number") continue;

    const fromAddress = key.slice(
      VOTE_PREFIX.length,
      key.length - suffix.length,
    );
    records.push({
      fromAddress,
      votes: val.votes,
      strength: typeof val.strength === "number" ? val.strength : undefined,
      ts: val.ts,
    });
  }

  records.sort((a, b) => a.ts - b.ts);
  return records;
}

export function useVotesReceived(address: string | undefined): VoteRecord[] {
  const vars = useStore(coopStore, (s) => s.vars);

  return useMemo(() => extractVotesReceived(vars, address), [vars, address]);
}
