import { describe, it, expect } from "vitest";

import { parseUserPosts } from "../parseUserPosts";

const validPost = (overrides: Record<string, unknown> = {}) => ({
  postId: "1234567890",
  guildId: "1122334455667788990",
  title: "My contribution",
  description: "Post body",
  reactions: [
    { emoji: "👍", count: 3 },
    { emoji: "🎉", count: 1 },
  ],
  createdAt: "2026-06-26T12:00:00.000Z",
  lastActivityAt: "2026-06-26T12:34:00.000Z",
  ...overrides,
});

describe("parseUserPosts", () => {
  it("parses a valid response and preserves post order", () => {
    const result = parseUserPosts({
      total: 2,
      posts: [validPost(), validPost({ postId: "222", title: "Second" })],
    });
    expect(result).not.toBeNull();
    expect(result?.total).toBe(2);
    expect(result?.posts.map((p) => p.postId)).toEqual(["1234567890", "222"]);
  });

  it("returns null for unrecognizable responses", () => {
    expect(parseUserPosts(null)).toBeNull();
    expect(parseUserPosts("x")).toBeNull();
    expect(parseUserPosts({})).toBeNull();
    expect(parseUserPosts({ total: 1 })).toBeNull();
  });

  it("salvages valid posts when one is malformed", () => {
    const result = parseUserPosts({
      total: 3,
      posts: [validPost(), { postId: "333" }, validPost({ postId: "444" })],
    });
    expect(result?.posts.map((p) => p.postId)).toEqual(["1234567890", "444"]);
  });

  it("keeps a post with broken reactions, degraded to an empty list", () => {
    const result = parseUserPosts({
      total: 1,
      posts: [validPost({ reactions: "broken" })],
    });
    expect(result?.posts).toHaveLength(1);
    expect(result?.posts[0]?.reactions).toEqual([]);
  });

  it("degrades a non-snowflake guildId to null instead of dropping the post", () => {
    const result = parseUserPosts({
      total: 1,
      posts: [validPost({ guildId: "javascript:alert(1)" })],
    });
    expect(result?.posts).toHaveLength(1);
    expect(result?.posts[0]?.guildId).toBeNull();
  });

  it("drops a post with a non-snowflake postId (unsafe for URLs)", () => {
    const result = parseUserPosts({
      total: 1,
      posts: [validPost({ postId: "../../doc" })],
    });
    expect(result?.posts).toEqual([]);
  });

  it("accepts multi-codepoint emoji", () => {
    const result = parseUserPosts({
      total: 1,
      posts: [validPost({ reactions: [{ emoji: "👍🏽", count: 2 }] })],
    });
    expect(result?.posts[0]?.reactions).toEqual([{ emoji: "👍🏽", count: 2 }]);
  });

  it("degrades a broken total to 0 while keeping posts", () => {
    const result = parseUserPosts({ total: -5, posts: [validPost()] });
    expect(result?.total).toBe(0);
    expect(result?.posts).toHaveLength(1);
  });
});
