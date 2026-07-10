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
  }),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
       external: ["node:fs", "node:path"],
    },
  },
  integrations: [react(), sitemap()],
  redirects: {
    '/works': '/',
  }
});
