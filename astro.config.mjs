import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import { autoNewTabExternalLinks } from './src/autoNewTabExternalLinks';

import partytown from "@astrojs/partytown";
import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
export default defineConfig({
  site: 'https://jeeneee.dev',
  integrations: [mdx(), sitemap(), robotsTxt(), tailwind(), partytown()],
  markdown: {
    extendDefaultPlugins: true,
    rehypePlugins: [[autoNewTabExternalLinks, {
      domain: 'jeeneee.dev'
    }]]
  }
});