// @ts-check
import { defineConfig } from 'astro/config';
import { config } from 'dotenv';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

config();

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL,
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
