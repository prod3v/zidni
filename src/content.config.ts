import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

// About collection schema
const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
    what_i_do: z.object({
      title: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
        }),
      ),
    }),
  }),
});

// Contact collection schema
const contactCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

// Authors collection schema
const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/authors" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    social: z
      .object({
        facebook: z.url().optional(),
        x: z.url().optional(),
        instagram: z.url().optional(),
        linkedin: z.url().optional(),
        github: z.url().optional(),
        website: z.url().optional(),
        youtube: z.url().optional(),
      })
      .optional(),
  }),
});

// Posts collection schema
const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/posts" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    image: z.string().optional(),
    categories: z.array(z.string()).default(() => ["أخرى"]),
    authors: z.array(z.string()).default(() => ["فريق زدني"]),
    tags: z.array(z.string()).default(() => ["أخرى"]),
    draft: z.boolean().optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

// Pages collection schema
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    illustration: z.string().optional(),
    whatsapp_text: z.string().optional(),
    layout: z.string().optional(),
    draft: z.boolean().optional(),
    // Structured service page fields
    feature_heading: z.string().optional(),
    feature_text: z.string().optional(),
    feature_illustration: z.string().optional(),
    advantages_illustration: z.string().optional(),
    process_steps: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
    advantages: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

// Export collections
export const collections = {
  posts: postsCollection,
  about: aboutCollection,
  contact: contactCollection,
  authors: authorsCollection,
  pages: pagesCollection,
};
