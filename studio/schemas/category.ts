import { defineType, defineField } from "sanity"

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title (English)",
      type: "string",
      description: "Category title in English. Optional if Hindi title provided.",
      validation: (Rule) =>
        Rule.custom((val, { document }) => {
          return val || (document as any)?.titleHindi
            ? true
            : "Provide a category title in English or Hindi."
        }),
    }),

    defineField({
      name: "titleHindi",
      title: "Title (Hindi)",
      type: "string",
      description: "Optional Hindi title for this category.",
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
  ],
})