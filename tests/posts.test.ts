import { describe, it, expect } from "vitest";
import { getAllPosts, getPost, getAdjacentPosts } from "@/lib/posts";

describe("getAllPosts", () => {
  it("returns all posts sorted by date (newest first)", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  it("every post has required metadata", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.excerpt).toBeTruthy();
    }
  });

  it("slugs are unique", () => {
    const posts = getAllPosts();
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getPost", () => {
  it("returns valid content for each post", async () => {
    const posts = getAllPosts();
    for (const { slug } of posts) {
      const post = await getPost(slug);
      expect(post.meta.title).toBeTruthy();
      expect(post.contentHtml).toBeTruthy();
      expect(post.contentHtml.length).toBeGreaterThan(100);
    }
  });

  it("throws on non-existent slug", async () => {
    await expect(getPost("this-post-does-not-exist")).rejects.toThrow();
  });
});

describe("getAdjacentPosts", () => {
  it("returns null prev for newest post", () => {
    const posts = getAllPosts();
    const { prev } = getAdjacentPosts(posts[0].slug);
    expect(prev).toBeNull();
  });

  it("returns null next for oldest post", () => {
    const posts = getAllPosts();
    const { next } = getAdjacentPosts(posts[posts.length - 1].slug);
    expect(next).toBeNull();
  });

  it("returns both neighbors for middle posts", () => {
    const posts = getAllPosts();
    if (posts.length >= 3) {
      const { prev, next } = getAdjacentPosts(posts[1].slug);
      expect(prev).not.toBeNull();
      expect(next).not.toBeNull();
    }
  });
});
