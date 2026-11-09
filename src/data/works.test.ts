import { describe, expect, it } from "vitest";
import { services } from "./services";
import { works } from "./works";

describe("works", () => {
  it("has unique titles", () => {
    const titles = works.map((w) => w.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("links only to repositories under github.com/yktsnet", () => {
    for (const w of works) {
      expect(w.href).toBe(`https://github.com/yktsnet/${w.title}`);
    }
  });

  it("fills both ja and en for every description", () => {
    for (const w of works) {
      expect(w.description.ja, w.title).not.toBe("");
      expect(w.description.en, w.title).not.toBe("");
    }
  });

  // Services で見せているリポを Works に重ねると、受ける仕事と自分の道具の境目がぼやける
  it("does not repeat any repository linked from services", () => {
    const serviceRepos = new Set(services.flatMap((s) => s.offerings.flatMap((o) => o.repos.map((r) => r.name))));
    for (const w of works) {
      expect(serviceRepos.has(w.title), w.title).toBe(false);
    }
  });
});
