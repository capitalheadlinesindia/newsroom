import { defineType, defineField } from "sanity"

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "excerpt",
      type: "text"
    }),
    defineField({
      name: "mainImage",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt text" }
      ]
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }]
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }]
    }),
    defineField({
      name: "publishedAt",
      type: "datetime"
    }),
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false
    }),
    defineField({
      name: "hero",
      type: "boolean",
      initialValue: false
    }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }]
    })
  ]
})
