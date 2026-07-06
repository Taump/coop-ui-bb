/**
 * URL of a Discord forum thread (a contribution post), or `null` when the
 * guild id is unknown (rows ingested before the API exposed it). Both ids are
 * snowflake-validated by the schema, so the resulting URL is inert.
 */
export function getDiscordThreadUrl(
  guildId: string | null,
  postId: string,
): string | null {
  if (!guildId) return null;
  return `https://discord.com/channels/${guildId}/${postId}`;
}
