import { describe, it, expect } from "vitest";

import { buildUserPostsUrl } from "../buildUserPostsUrl";

describe("buildUserPostsUrl", () => {
  it("builds the users/{id}/posts path with sort/order/limit params", () => {
    const url = new URL(buildUserPostsUrl("http://localhost:3000", "123", 10));
    expect(url.pathname).toBe("/users/123/posts");
    expect(url.searchParams.get("sort")).toBe("activity");
    expect(url.searchParams.get("order")).toBe("desc");
    expect(url.searchParams.get("limit")).toBe("10");
  });

  it("handles a base URL with a trailing slash", () => {
    expect(buildUserPostsUrl("http://localhost:3000/", "123", 10)).toBe(
      buildUserPostsUrl("http://localhost:3000", "123", 10),
    );
  });

  it("preserves a path-prefixed base URL", () => {
    const url = new URL(
      buildUserPostsUrl("https://example.com/clog", "123", 10),
    );
    expect(url.pathname).toBe("/clog/users/123/posts");
  });

  it("URI-encodes the user id", () => {
    const url = buildUserPostsUrl("http://localhost:3000", "../doc", 10);
    expect(new URL(url).pathname).toBe("/users/..%2Fdoc/posts");
  });
});
