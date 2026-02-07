import { describe, it, expect } from "vitest";
import { getAllPosts, getPost } from "@/lib/posts";
import fs from "fs";
import path from "path";

const PII_PATTERNS = [
  /luciano\s*ayres/i,
  /lucianofarias@gmail/i,
  /\+558\d{10,}/,
  /@lafc2026/i,
  /linear\.app\/ai-bros-ftw/i,
  /neo_jan2026_bot/i,
];

describe("no PII in published content", () => {
  it("post markdown files contain no PII", () => {
    const postsDir = path.join(process.cwd(), "posts");
    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
      for (const pattern of PII_PATTERNS) {
        expect(content, `PII found in ${file} matching ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  it("rendered HTML contains no PII", async () => {
    const posts = getAllPosts();
    for (const { slug } of posts) {
      const { contentHtml } = await getPost(slug);
      for (const pattern of PII_PATTERNS) {
        expect(contentHtml, `PII in rendered ${slug} matching ${pattern}`).not.toMatch(pattern);
      }
    }
  });
});

describe("post images exist", () => {
  it("all referenced images have corresponding files", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      if (post.image) {
        const imgPath = path.join(process.cwd(), "public", post.image);
        expect(fs.existsSync(imgPath), `Missing image: ${post.image} for post ${post.slug}`).toBe(true);
      }
    }
  });
});

describe("deploy URLs are valid", () => {
  it("all deployUrl values are valid URLs", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      if (post.deployUrl) {
        expect(() => new URL(post.deployUrl!), `Invalid URL in ${post.slug}: ${post.deployUrl}`).not.toThrow();
      }
    }
  });

  it("no private URLs in deploy links", () => {
    const posts = getAllPosts();
    const privatePatterns = [/linear\.app/, /localhost/, /192\.168\./];
    for (const post of posts) {
      if (post.deployUrl) {
        for (const pattern of privatePatterns) {
          expect(post.deployUrl, `Private URL in ${post.slug}`).not.toMatch(pattern);
        }
      }
    }
  });
});
