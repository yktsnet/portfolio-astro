import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
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
      include: ['hono', 'hono/cors', 'simple-icons', '@folio-agent/handler'],
    },
    ssr: {
      external: ["node:fs", "node:path"],
    },
  },
  integrations: [react(), sitemap()],
  redirects: {
    '/works': '/',
  }
});
