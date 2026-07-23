import { defineCollection, z } from "astro:content";

// The resume is a single JSON "collection" of one entry.
// Astro validates it against this schema at BUILD TIME — if you
// typo a field or forget a required one, the build fails loudly
// instead of shipping a broken page. This is what makes
// "just edit the file and push" safe without an admin UI.
const resume = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    role: z.string(),
    location: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    summary: z.string(),
    links: z.array(
      z.object({
        label: z.string(),
        url: z.string().url(),
      }),
    ),
    skills: z.array(
      z.object({
        category: z.string(),
        items: z.array(z.string()),
      }),
    ),
    experience: z.array(
      z.object({
        company: z.string(),
        title: z.string(),
        start: z.string(), // e.g. "2021-03"
        end: z.string(), // e.g. "Present"
        location: z.string().optional(),
        highlights: z.array(z.string()),
      }),
    ),
    impact: z
      .array(
        z.object({
          metric: z.string(),
          title: z.string(),
          description: z.string(),
          tags: z.array(z.string()).default([]),
        }),
      )
      .default([]),
    education: z
      .array(
        z.object({
          degree: z.string(),
          institution: z.string(),
          start: z.string(),
          end: z.string(),
          location: z.string().optional(),
        }),
      )
      .default([]),
    projects: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
          url: z.string().url().optional(),
          tags: z.array(z.string()).default([]),
        }),
      )
      .default([]),
    certifications: z
      .array(
        z.object({
          name: z.string(),
          issuer: z.string(),
          date: z.string().optional(),
          url: z.string().url().optional(),
        }),
      )
      .default([]),
    training: z.array(z.string()).default([]),
    languages: z
      .array(
        z.object({
          name: z.string(),
          level: z.string(),
        }),
      )
      .default([]),
    interests: z.array(z.string()).default([]),
  }),
});

// Blog posts: one Markdown file per post under src/content/blog/.
// Front-matter is validated the same way.
const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { resume, blog };
