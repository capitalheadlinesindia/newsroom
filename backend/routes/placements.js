const express = require("express")
const Placement = require("../models/Placement")
const auth = require("../middleware/authMiddleware")

const router = express.Router()

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — used by the Next.js frontend to render the homepage
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/placements
// Returns all placements grouped by section
router.get("/", async (req, res) => {
  try {
    const all = await Placement.find().sort({ section: 1, order: 1 }).lean()

    // Group by section
    const grouped = all.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = []
      acc[item.section].push(item)
      return acc
    }, {})

    return res.json(grouped)
  } catch (err) {
    console.error("Get placements error:", err)
    return res.status(500).json({ message: "Server error." })
  }
})

// GET /api/placements/:section
// Returns placements for a single section
router.get("/:section", async (req, res) => {
  try {
    const items = await Placement.find({ section: req.params.section })
      .sort({ order: 1 })
      .lean()

    return res.json(items)
  } catch (err) {
    console.error("Get section placements error:", err)
    return res.status(500).json({ message: "Server error." })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PROTECTED — requires Bearer JWT token
// ─────────────────────────────────────────────────────────────────────────────

// PUT /api/placements/:section/:order
// Upsert (create or replace) a placement slot
router.put("/:section/:order", auth, async (req, res) => {
  try {
    const { section, order } = req.params
    const { articleId, articleTitle, articleSlug, articleImage, articleExcerpt, articleCategory } =
      req.body

    if (!articleId || !articleTitle || !articleSlug) {
      return res.status(400).json({ message: "articleId, articleTitle, and articleSlug are required." })
    }

    const placement = await Placement.findOneAndUpdate(
      { section, order: Number(order) },
      {
        section,
        order: Number(order),
        articleId,
        articleTitle,
        articleSlug,
        articleImage: articleImage || "",
        articleExcerpt: articleExcerpt || "",
        articleCategory: articleCategory || "",
      },
      { upsert: true, new: true, runValidators: true }
    )

    return res.json(placement)
  } catch (err) {
    console.error("Upsert placement error:", err)
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message })
    }
    return res.status(500).json({ message: "Server error." })
  }
})

// DELETE /api/placements/:section/:order
// Remove a single slot
router.delete("/:section/:order", auth, async (req, res) => {
  try {
    await Placement.findOneAndDelete({
      section: req.params.section,
      order: Number(req.params.order),
    })
    return res.json({ message: "Placement removed." })
  } catch (err) {
    console.error("Delete placement error:", err)
    return res.status(500).json({ message: "Server error." })
  }
})

// DELETE /api/placements/:section
// Clear all slots for a section
router.delete("/:section", auth, async (req, res) => {
  try {
    await Placement.deleteMany({ section: req.params.section })
    return res.json({ message: "Section cleared." })
  } catch (err) {
    console.error("Clear section error:", err)
    return res.status(500).json({ message: "Server error." })
  }
})

module.exports = router
