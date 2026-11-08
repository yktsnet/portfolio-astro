// SVG の <text> は折り返さず幅も測れないので、ビルド時に字幅を見積もって配置を決める。
// 本文は等幅フォントなので、半角は 0.6em、全角（かな・漢字・全角記号）は 1em で数える。
// — や → のような記号は等幅フォント側に字形があり、半角と同じ幅になる。
const isWide = (code: number) =>
  (code >= 0x3000 && code <= 0x9fff) || (code >= 0xff00 && code <= 0xffef);

export const textWidth = (s: string, fontSize: number): number =>
  [...s].reduce((n, c) => n + (isWide(c.codePointAt(0) ?? 0) ? fontSize : fontSize * 0.6), 0);
