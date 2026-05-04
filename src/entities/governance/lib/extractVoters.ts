import { getValueKey, needsHash } from "./getValueKey";

export interface Voter {
  address: string;
  sqrtBalance: number;
  value: string | number;
}

interface VoteEntry {
  value?: string | number;
  sqrt_balance?: number;
}

const VOTES_PREFIX = "votes_";

export async function extractVoters(
  vars: Record<string, unknown>,
  name: string,
  valueKey: string,
): Promise<Voter[]> {
  const isHashedKey = valueKey.startsWith("hash_");
  const voters: Voter[] = [];

  for (const key in vars) {
    if (!key.startsWith(VOTES_PREFIX)) continue;
    const address = key.slice(VOTES_PREFIX.length);
    const raw = vars[key];
    if (!raw || typeof raw !== "object") continue;
    const userVotes = raw as Record<string, VoteEntry>;

    const vote = userVotes[name] as VoteEntry | undefined;
    if (!vote || vote.value === undefined) continue;
    if (typeof vote.sqrt_balance !== "number" || vote.sqrt_balance <= 0)
      continue;

    let key2: string;
    if (isHashedKey) {
      if (!needsHash(vote.value)) continue;
      key2 = await getValueKey(vote.value);
    } else {
      if (needsHash(vote.value)) continue;
      key2 = String(vote.value);
    }

    if (key2 === valueKey) {
      voters.push({
        address,
        sqrtBalance: vote.sqrt_balance,
        value: vote.value,
      });
    }
  }

  voters.sort((a, b) => b.sqrtBalance - a.sqrtBalance);
  return voters;
}
