import { describe, expect, it } from "vitest";
import { skillLinks } from "./skill-links";
import { downstreamSteps, upstreamCols } from "./workflow";

const steps = [...upstreamCols.flatMap((c) => c.items), ...downstreamSteps];
const tags = steps.flatMap((st) => st.tags);

describe("skillLinks", () => {
  it("ワークフローのページに出るスキル名はすべてリンク先を持つ", () => {
    const names = tags;
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) expect(skillLinks[name], name).toBeDefined();
  });

  it("リンク先は sdlc-kit の main を指す", () => {
    for (const href of Object.values(skillLinks)) {
      expect(href.startsWith("https://github.com/yktsnet/sdlc-kit/blob/main/")).toBe(true);
    }
  });
});
