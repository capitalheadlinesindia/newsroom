import { defineType, defineField } from "sanity"

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title (English)",
      type: "string",
      description: "Optional if a Hindi title is provided.",
      validation: (Rule) =>
        Rule.custom((val, { document }) => {
          return val || (document as any)?.titleHindi
            ? true
            : "Provide a title in English or Hindi."
        }),
    }),

    defineField({
      name: "titleHindi",
      title: "Title (Hindi)",
      type: "string",
      description:
        "Optional if an English title is provided. Can be used as slug source when English title is absent.",
      validation: (Rule) =>
        Rule.custom((val, { document }) => {
          return val || (document as any)?.title
            ? true
            : "Provide a title in English or Hindi."
        }),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc: any) => doc?.title || doc?.titleHindi,
        slugify: (input: string = "") =>
          input
            .toString()
            .normalize("NFKD")
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s-]/gu, "")
            .trim()
            .replace(/\s+/g, "-")
            .slice(0, 200),
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt (English)",
      type: "text",
    }),

    defineField({
      name: "excerptHindi",
      title: "Excerpt (Hindi) — Optional",
      type: "text",
    }),

    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
        },
      ],
    }),

    defineField({
      name: "body",
      title: "Body (English)",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "bodyHindi",
      title: "Body (Hindi) — Optional",
      description:
        "Upload the Hindi version of the article body here. If filled, readers will be able to toggle to Hindi on the article page.",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),

    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "hero",
      title: "Hero",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
  ],
})