import { z } from "zod";

import { contributionPostSchema } from "../model/schemas";
import type { UserContributions } from "../model/schemas";

const envelopeSchema = z.object({
  total: z.number().int().nonnegative().catch(0),
  posts: z.array(z.unknown()),
});

/**
 * Parses a contribution-log user-posts response. Envelope check plus per-post
 * salvage: one malformed post drops that row, not the whole card. Returns
 * `null` only when the response isn't recognizable at all.
 */
export function parseUserPosts(data: unknown): UserContributions | null {
  const envelope = envelopeSchema.safeParse(data);
  if (!envelope.success) return null;

  const posts = envelope.data.posts.flatMap((post) => {
    const parsed = contributionPostSchema.safeParse(post);
    return parsed.success ? [parsed.data] : [];
  });

  return { total: envelope.data.total, posts };
}
