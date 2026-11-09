// Worker の実行時にだけある組み込みモジュール。バインディングの型は api.ts の Bindings が持つので、
// @cloudflare/workers-types は入れずに env の存在だけを宣言する
declare module 'cloudflare:workers' {
  export const env: unknown;
}
