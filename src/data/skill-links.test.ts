import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { skillLinks } from "./skill-links";

const page = readFileSync(
  new URL("../pages/services/ai-development/workflow.astro", import.meta.url),
  "utf8",
);

const tagsInArrays = [...page.matchAll(/tags: \[([^\]]*)\]/g)].flatMap((m) =>
  [...m[1].matchAll(/'([^']+)'/g)].map((t) => t[1]),
);
const tagsByName = [...page.matchAll(/<SkillTag name="([^"]+)">/g)].map((m) => m[1]);

describe("skillLinks", () => {
  it("ワークフローのページに出るスキル名はすべてリンク先を持つ", () => {
    const names = [...tagsInArrays, ...tagsByName];
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) expect(skillLinks[name], name).toBeDefined();
  });

  it("リンク先は sdlc-kit の main を指す", () => {
    for (const href of Object.values(skillLinks)) {
      expect(href.startsWith("https://github.com/yktsnet/sdlc-kit/blob/main/")).toBe(true);
    }
  });
});
