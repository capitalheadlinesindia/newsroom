import { defineType, defineField } from "sanity"

export default defineType({
  name: "category",
  title: "Category",
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
    })
  ]
})
