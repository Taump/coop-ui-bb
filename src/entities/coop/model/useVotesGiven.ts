import { useMemo } from "react";
import { useStore } from "@tanstack/react-store";

import { coopStore } from "./store";

export interface VoteGivenRecord {
  toAddress: string;
  votes: number;
  ts: number;
}

const VOTE_PREFIX = "vote_";

export function extractVotesGiven(
  vars: Record<string, unknown>,
  address: string | undefined,
): VoteGivenRecord[] {
  if (!address) return [];
  const prefix = `${VOTE_PREFIX}${address}_`;
  const records: VoteGivenRecord[] = [];

  for (const key in vars) {
    if (!key.startsWith(prefix)) continue;
    const val = vars[key] as { votes: number; ts: number } | null;
    if (!val || typeof val.votes !== "number") continue;

    const toAddress = key.slice(prefix.length);
    records.push({
      toAddress,
      votes: val.votes,
      ts: val.ts,
    });
  }

  records.sort((a, b) => a.ts - b.ts);
  return records;
}

export function useVotesGiven(
  address: string | undefined,
): VoteGivenRecord[] {
  const vars = useStore(coopStore, (s) => s.vars);

  return useMemo(() => extractVotesGiven(vars, address), [vars, address]);
}
