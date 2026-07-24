import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// Drives canonical URLs, sitemap.xml and RSS — all SEO-critical.
const SITE_URL = "https://makour.dev";

export default defineConfig({
  site: SITE_URL,
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("/404/") && !page.endsWith("/404"),
    }),
    tailwind({
      // Preflight would reset the hand-tuned typography/spacing already
      // in global.css (h1-h3, body line-height, etc.) — Tailwind is here
      // strictly for utility classes, not to own the base styles.
      applyBaseStyles: false,
    }),
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr", "ar"],
    routing: {
      prefixDefaultLocale: false, // English at "/", French at "/fr/", Arabic at "/ar/"
    },
  },
  output: "static", // fully static output: smallest attack surface, no server runtime to patch
  build: {
    inlineStylesheets: "auto",
  },
  compressHTML: true,
});
