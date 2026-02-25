import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://ykts.net',
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
    imageService: 'compile'
  }),
  integrations: [tailwind(), react()]
});
