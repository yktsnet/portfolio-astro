import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ykts.net',
  output: 'static',
  adapter: cloudflare({
    mode: 'directory',
    imageService: 'compile'
  }),
  vite: {
    ssr: {
       external: ["node:fs", "node:path"],
    },
  },
  integrations: [tailwind(), react(), sitemap()]
});
