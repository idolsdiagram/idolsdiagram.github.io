// @ts-check
import { defineConfig } from 'astro/config';
import { config } from 'dotenv';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

config();

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL,
  integrations: [react(), sitemap()],
  vite: {
    ssr: {
      noExternal: ['beercss', 'material-dynamic-colors']
    }
  },
});