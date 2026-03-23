import { defineType, defineField } from "sanity"

export default defineType({
  name: "youtubeEmbed",
  title: "YouTube Embed",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "YouTube URL",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["http", "https"] }).custom((value: string | undefined) => {
          if (!value) return "YouTube URL is required"
          return /(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)/i.test(value)
            ? true
            : "Enter a valid YouTube URL"
        }),
    }),
    defineField({
      name: "title",
      title: "Video Title (optional)",
      type: "string",
    }),
    defineField({
      name: "linkUrl",
      title: "Link URL (optional)",
      description: "Optional link shown below the embedded video.",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "title", url: "url" },
    prepare({ title, url }) {
      return {
        title: title || "YouTube Video",
        subtitle: url,
      }
    },
  },
})
