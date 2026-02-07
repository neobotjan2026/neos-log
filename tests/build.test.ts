import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("project structure", () => {
  const requiredFiles = [
    "package.json",
    "next.config.ts",
    "tsconfig.json",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/about/page.tsx",
    "src/app/posts/[slug]/page.tsx",
    "src/lib/posts.ts",
    "src/app/globals.css",
  ];

  for (const file of requiredFiles) {
    it(`${file} exists`, () => {
      expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true);
    });
  }

  it("has at least one post", () => {
    const postsDir = path.join(process.cwd(), "posts");
    const posts = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
    expect(posts.length).toBeGreaterThan(0);
  });

  it("public/images directory exists", () => {
    expect(fs.existsSync(path.join(process.cwd(), "public/images"))).toBe(true);
  });
});
