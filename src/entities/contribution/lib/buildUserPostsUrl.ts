/**
 * Builds the contribution-log "user posts" URL: last N posts by activity.
 * The trailing-slash normalization keeps a path-prefixed base
 * (e.g. https://example.com/clog) working with the relative-path URL constructor.
 */
export function buildUserPostsUrl(
  baseUrl: string,
  discordUserId: string,
  limit: number,
): string {
  const base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  const url = new URL(`users/${encodeURIComponent(discordUserId)}/posts`, base);
  url.searchParams.set("sort", "activity");
  url.searchParams.set("order", "desc");
  url.searchParams.set("limit", String(limit));
  return url.toString();
}
