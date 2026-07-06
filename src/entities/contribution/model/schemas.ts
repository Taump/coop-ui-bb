import { z } from "zod";

// Discord snowflake: digits only. Doubles as a safety check — thread links are
// built as https://discord.com/channels/<guildId>/<postId>, so both components
// must be inert in a URL even if the API is compromised.
export const snowflakeSchema = z.string().regex(/^\d{1,20}$/);

// Deliberately looser than the server's z.emoji(): multi-codepoint sequences
// (skin tones, flags) must not drop a post.
export const reactionCountSchema = z.object({
  emoji: z.string().min(1),
  count: z.number().int().nonnegative(),
});

// Only the fields the UI consumes; extra server keys pass through unvalidated
// (zod objects are non-strict), so the schema survives API evolution.
// Secondary fields degrade instead of failing: broken reactions → no chips,
// bad guildId → no link — never "no post".
export const contributionPostSchema = z.object({
  postId: snowflakeSchema,
  guildId: snowflakeSchema.nullable().catch(null),
  title: z.string(),
  description: z.string(),
  reactions: z.array(reactionCountSchema).catch([]),
  createdAt: z.iso.datetime(),
  lastActivityAt: z.iso.datetime(),
});

export type ReactionCount = z.infer<typeof reactionCountSchema>;
export type ContributionPost = z.infer<typeof contributionPostSchema>;

export interface UserContributions {
  total: number;
  posts: ContributionPost[];
}
