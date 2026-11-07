import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// ページごとに文字の大きさを直書きすると、同じ役割の文字がページ間でずれる。大きさは global.css の type-* だけで指定する
const RAW_SIZE = /(?<![\w-])(?:[a-z]+:)*text-(?:xs|sm|base|lg|[2-9]?xl|\[[^\]]+\])(?![\w-])/g;
const TARGET = /\.astro$/;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : TARGET.test(name) ? [path] : [];
  });

describe("type scale", () => {
  it("text-* で文字の大きさを直書きしていない", () => {
    const hits = walk("src").flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .flatMap((line, i) => [...line.matchAll(RAW_SIZE)].map((m) => `${file}:${i + 1} ${m[0]}`)),
    );
    expect(hits).toEqual([]);
  });
});
