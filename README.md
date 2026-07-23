# Mo Akour — Portfolio & Resume

Static site built with [Astro](https://astro.build), deployed to Azure Static Web Apps
via GitHub Actions.

## Stack

- **Astro** — static output, ships ~0 JS by default (fast, great Core Web Vitals → good for SEO)
- **Content Collections** — resume and blog data are validated against a schema at build time
- **Azure Static Web Apps** — free tier, CDN, managed TLS, preview environments per PR

## Getting started

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-checks then builds to dist/
npm run preview   # serve the production build locally
```

## Editing your resume

Everything on the homepage comes from **`src/content/resume/resume.json`**.
Edit that file, commit, push to `main` — CI rebuilds and deploys automatically.

The shape of that file is enforced by `src/content/config.ts`. If you typo a
field or drop a required one, `npm run build` fails locally and in CI *before*
anything broken ships — that's the whole safety net, no admin UI required.

Replace the `TODO-...` placeholders in `resume.json` with your real GitHub/LinkedIn
URLs, public email, and dates before your first deploy.

## Writing blog posts

Add a Markdown file to `src/content/blog/`, e.g. `src/content/blog/my-post.md`:

```markdown
---
title: "My post title"
description: "One-line summary for SEO and the blog index."
pubDate: 2026-08-01
tags: ["azure", "devops"]
---

Body content in normal Markdown.
```

Set `draft: true` to keep it out of the build until ready. The post appears
automatically at `/blog/my-post/`, in the blog index, the sitemap, and the RSS feed.

## SEO

- Per-page `<title>`, meta description, canonical URL, Open Graph, Twitter Card
- `Person` and `BlogPosting` JSON-LD structured data
- Auto-generated `sitemap-index.xml` (via `@astrojs/sitemap`)
- `robots.txt` pointing at the sitemap
- RSS feed at `/rss.xml`

Before going live: set the real `SITE_URL` at the top of `astro.config.mjs` —
canonical URLs, the sitemap, and RSS all derive from it.

## Security

Enforced at the CDN edge via `staticwebapp.config.json`:

- Content-Security-Policy (script-src limited to same-origin — no inline scripts)
- Strict-Transport-Security (HSTS, 2-year, preload)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY (blocks clickjacking)
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy disabling camera/mic/geolocation/FLoC

Static output means there's no server runtime, no database, and no user input
being processed — the biggest attack surfaces of a typical web app just don't
exist here. Dependabot is configured to open weekly PRs for npm and GitHub
Actions updates; review and merge those regularly.

## Deploying to Azure Static Web Apps

1. In the Azure Portal, create a **Static Web App** resource, connect it to
   this GitHub repo, branch `main`, app location `/`, output location `dist`.
   Azure will commit a workflow file — you can replace it with
   `.github/workflows/azure-static-web-apps.yml` in this repo (same shape,
   adds the type-check step).
2. Copy the deployment token Azure generates into a GitHub Actions secret
   named `AZURE_STATIC_WEB_APPS_API_TOKEN` (Settings → Secrets and variables → Actions).
3. Push to `main` — the workflow builds and deploys. Pull requests get their
   own preview URL automatically; closing the PR tears it down.
4. Add your custom domain in the Static Web App's **Custom domains** blade
   once you have one (free managed certificate).

## Project structure

```
src/
  content/
    config.ts          # schema for resume + blog (the validation layer)
    resume/resume.json  # <-- the file you edit to update your resume
    blog/*.md            # <-- one file per blog post
  components/           # Seo, header, footer, DeployLog (experience timeline)
  layouts/               # BaseLayout, BlogPostLayout
  pages/                 # index, blog/index, blog/[slug], rss.xml, 404
staticwebapp.config.json # security headers + routing for Azure SWA
```
