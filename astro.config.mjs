import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    mode: 'directory'
  }),
  integrations: [tailwind(), react()]
});
