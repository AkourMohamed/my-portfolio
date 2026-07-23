import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// IMPORTANT: set this to your real domain once you have one.
// It drives canonical URLs, sitemap.xml and RSS — all SEO-critical.
const SITE_URL = "https://mo-akour.dev";

export default defineConfig({
  site: SITE_URL,
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("/404/") && !page.endsWith("/404"),
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
