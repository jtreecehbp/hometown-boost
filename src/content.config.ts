import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const resources = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resources" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { resources };
