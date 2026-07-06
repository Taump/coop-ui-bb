import { queryOptions, useQuery } from "@tanstack/react-query";

import { env } from "#/shared/config/env";

import { buildUserPostsUrl } from "../lib/buildUserPostsUrl";
import { parseUserPosts } from "../lib/parseUserPosts";
import type { UserContributions } from "./schemas";

export const CONTRIBUTIONS_LIMIT = 10;

// Posts change slowly; together with retry: 1 this keeps a busy profile page
// far under the API's 120 req/min/IP rate limit.
const STALE_TIME = 5 * 60 * 1000;

export function contributionsQueryOptions(
  discordUserId: string | null | undefined,
) {
  const baseUrl = env.VITE_CONTRIBUTION_LOG_URL;
  return queryOptions({
    queryKey: ["contributions", discordUserId, CONTRIBUTIONS_LIMIT] as const,
    enabled: Boolean(baseUrl) && Boolean(discordUserId),
    staleTime: STALE_TIME,
    retry: 1,
    queryFn: async ({ signal }): Promise<UserContributions> => {
      // never fires thanks to `enabled`; narrows types
      if (!baseUrl || !discordUserId) throw new Error("contributions disabled");

      const res = await fetch(
        buildUserPostsUrl(baseUrl, discordUserId, CONTRIBUTIONS_LIMIT),
        { signal, headers: { accept: "application/json" } },
      );
      if (!res.ok) throw new Error(`contribution-log responded ${res.status}`);

      const json: unknown = await res.json();
      const parsed = parseUserPosts(json);
      if (!parsed) {
        throw new Error("contribution-log response failed validation");
      }
      return parsed;
    },
  });
}

export function useContributions(discordUserId: string | null | undefined) {
  return useQuery(contributionsQueryOptions(discordUserId));
}
