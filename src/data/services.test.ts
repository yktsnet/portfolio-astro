import { describe, expect, it } from "vitest";
import { services } from "./services";

// 日英どちらかが空のまま出ると、片方の言語で文言が消える
const collectTexts = (value: unknown, path: string, out: [string, unknown][]) => {
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if ("ja" in obj && "en" in obj) {
      out.push([path, obj]);
      return;
    }
    for (const [k, v] of Object.entries(obj)) collectTexts(v, `${path}.${k}`, out);
  }
};

describe("services", () => {
  it("has unique slugs", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("links only to repositories under github.com/yktsnet", () => {
    for (const s of services) {
      for (const o of s.offerings) {
        for (const r of o.repos) {
          expect(r.href).toBe(`https://github.com/yktsnet/${r.name}`);
        }
      }
    }
  });

  it("fills both ja and en for every text", () => {
    const texts: [string, unknown][] = [];
    collectTexts(services, "services", texts);
    for (const [path, t] of texts) {
      const { ja, en } = t as { ja: string; en: string };
      expect(ja, path).not.toBe("");
      expect(en, path).not.toBe("");
    }
  });
});
