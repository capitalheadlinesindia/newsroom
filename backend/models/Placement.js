const mongoose = require("mongoose")

/**
 * Placement model — tracks which Sanity article is pinned to which
 * section/slot on the homepage.
 *
 * Each document represents a single slot.
 * section examples: "hero", "featured", "sidebar", "newsroom",
 *   "winterOlympics", "technology", "moreNews_left",
 *   "moreNews_center", "moreNews_right", "mustWatch"
 * order: 0-based position within that section  (0 = first)
 */
const placementSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      // No enum — sections are now dynamic
    },
    order: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    // Sanity document fields
    articleId: { type: String, required: true },   // Sanity _id
    articleTitle: { type: String, required: true },
    articleSlug: { type: String, required: true },
    articleImage: { type: String, default: "" },   // pre-built image URL
    articleExcerpt: { type: String, default: "" },
    articleCategory: { type: String, default: "" },
  },
  { timestamps: true }
)

// Composite unique index – only one article per (section, order) pair
placementSchema.index({ section: 1, order: 1 }, { unique: true })

module.exports = mongoose.model("Placement", placementSchema)
