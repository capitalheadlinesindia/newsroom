const mongoose = require("mongoose")

/**
 * HomepageSection — a dynamic section on the homepage.
 * Each section has a display label, is linked to a Sanity category slug,
 * and renders the latest articles from that category automatically.
 */
const homepageSectionSchema = new mongoose.Schema(
  {
    label:        { type: String, required: true },          // display name e.g. "Technology"
    categorySlug: { type: String, required: true },          // Sanity category slug
    order:        { type: Number, required: true, default: 0 },
    maxArticles:  { type: Number, default: 4 },              // how many articles to show
    visible:      { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model("HomepageSection", homepageSectionSchema)
