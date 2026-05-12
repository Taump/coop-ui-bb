import { useMemo } from "react";
import { useStore } from "@tanstack/react-store";

import { coopStore } from "./store";
import { parseCoopUser } from "./schemas";

export interface LeaderboardUser {
  address: string;
  balance: number;
  bytes_balance: number;
  total_balance: number;
  votes: number;
}

const USER_PREFIX = "user_";

export function extractTopUsers(
  vars: Record<string, unknown>,
  limit: number = 100,
): LeaderboardUser[] {
  const users: LeaderboardUser[] = [];

  for (const key in vars) {
    if (!key.startsWith(USER_PREFIX)) continue;

    const user = parseCoopUser(vars[key]);
    if (!user) continue;

    users.push({
      address: key.slice(USER_PREFIX.length),
      balance: user.balance,
      bytes_balance: user.bytes_balance,
      total_balance: user.total_balance,
      votes: user.votes ?? 0,
    });
  }

  users.sort((a, b) => b.total_balance - a.total_balance);

  return users.slice(0, limit);
}

export function useAllUsers(limit: number = 100): LeaderboardUser[] {
  const vars = useStore(coopStore, (s) => s.vars);

  return useMemo(() => extractTopUsers(vars, limit), [vars, limit]);
}
