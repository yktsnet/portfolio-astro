import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// 図の部品は en を渡さないと日本語だけを出し、エラーにならない。md 以上の図で英語を書き忘れると、
// 英語の表示に日本語が混ざるだけで気づけないので、ここで弾く。md 未満の図は日本語だけで出す（MainLayout）ので、逆に英語を持たせない
const DIAGRAM_DIRS = ["src/components/services", "src/components/workflow"];
// DgText・DgNode・DgLane と、DevDiagram で付けている別名
const PARTS = /<(DgText|N|Lane)\s[\s\S]*?\/>/g;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : name.endsWith(".astro") ? [path] : [];
  });

// <svg ごとに切り、開きのタグに md:hidden があるものを md 未満の図とみなす
const svgs = DIAGRAM_DIRS.flatMap(walk).flatMap((file) =>
  readFileSync(file, "utf8")
    .split(/(?=<svg[\s\n])/)
    .slice(1)
    .map((chunk) => ({
      file,
      mobile: /md:hidden/.test(chunk.slice(0, chunk.indexOf(">"))),
      parts: [...chunk.matchAll(PARTS)].map((m) => ({ name: m[1], tag: m[0] })),
    }))
    .filter((svg) => svg.parts.length > 0),
);

const missingEn = (name: string, tag: string) => {
  const has = (attr: string) => new RegExp(`\\s${attr}=`).test(tag);
  const lacks = [];
  if (!has("en")) lacks.push("en");
  if ((name === "N" && has("subJa")) || name === "Lane") if (!has("subEn")) lacks.push("subEn");
  return lacks;
};

describe("diagram languages", () => {
  it("md 以上の図と md 未満の図の両方がある", () => {
    expect(svgs.some((s) => s.mobile)).toBe(true);
    expect(svgs.some((s) => !s.mobile)).toBe(true);
  });

  it("md 以上の図の文字はすべて英語を持つ", () => {
    const hits = svgs
      .filter((s) => !s.mobile)
      .flatMap((s) =>
        s.parts.flatMap(({ name, tag }) => {
          const lacks = missingEn(name, tag);
          return lacks.length ? [`${s.file}: ${lacks.join(",")} が無い ${tag.replace(/\s+/g, " ")}`] : [];
        }),
      );
    expect(hits).toEqual([]);
  });

  it("md 未満の図の文字は英語を持たない", () => {
    const hits = svgs
      .filter((s) => s.mobile)
      .flatMap((s) =>
        s.parts.filter(({ tag }) => /\s(en|subEn)=/.test(tag)).map(({ tag }) => `${s.file}: ${tag.replace(/\s+/g, " ")}`),
      );
    expect(hits).toEqual([]);
  });
});
