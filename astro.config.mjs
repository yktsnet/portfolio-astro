import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ykts.net',
  output: 'static',
  adapter: cloudflare({
    imageService: 'compile',
    // PR の CI は Cloudflare の認証情報を持たない。静的出力の build は remote バインディングを読まないので、切って通す
    remoteBindings: process.env.CF_REMOTE_BINDINGS !== 'false',
  }),
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['hono', 'simple-icons'],
    },
    ssr: {
      external: ["node:fs", "node:path"],
    },
  },
  integrations: [sitemap()],
  redirects: {
    '/about': '/#about',
    // 消したページへの被リンク（Zenn の記事など）を切らないため、今の対応する場所へ送る
    '/impact': '/services/operations/',
    '/works': '/#services',
    '/principles': '/#about',
    '/services/education': '/services/ai-development/',
  },
});
