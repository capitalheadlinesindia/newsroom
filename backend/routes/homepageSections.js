const express = require("express")
const router = express.Router()
const HomepageSection = require("../models/HomepageSection")
const authMiddleware = require("../middleware/authMiddleware")

// GET /api/homepage-sections
// Public — returns all visible sections sorted by order
router.get("/", async (_req, res) => {
  try {
    const sections = await HomepageSection.find({ visible: true }).sort({ order: 1 }).lean()
    res.json(sections)
  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

// GET /api/homepage-sections/all
// Protected — returns ALL sections including hidden (for admin)
router.get("/all", authMiddleware, async (_req, res) => {
  try {
    const sections = await HomepageSection.find().sort({ order: 1 }).lean()
    res.json(sections)
  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

// POST /api/homepage-sections
// Protected — create a new section
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { label, categorySlug, maxArticles } = req.body
    if (!label || !categorySlug) {
      return res.status(400).json({ message: "label and categorySlug are required" })
    }
    // Append to end
    const maxDoc = await HomepageSection.findOne().sort({ order: -1 })
    const order = maxDoc ? maxDoc.order + 1 : 0
    const section = await HomepageSection.create({
      label,
      categorySlug,
      maxArticles: maxArticles || 4,
      order,
      visible: true,
    })
    res.status(201).json(section)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// PUT /api/homepage-sections/:id
// Protected — update label, categorySlug, maxArticles, visible, order
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { label, categorySlug, maxArticles, visible, order } = req.body
    const section = await HomepageSection.findByIdAndUpdate(
      req.params.id,
      {
        ...(label !== undefined && { label }),
        ...(categorySlug !== undefined && { categorySlug }),
        ...(maxArticles !== undefined && { maxArticles }),
        ...(visible !== undefined && { visible }),
        ...(order !== undefined && { order }),
      },
      { new: true }
    )
    if (!section) return res.status(404).json({ message: "Section not found" })
    res.json(section)
  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

// PUT /api/homepage-sections/bulk/reorder
// Protected — batch reorder [{ id, order }]
router.put("/bulk/reorder", authMiddleware, async (req, res) => {
  try {
    const items = req.body
    if (!Array.isArray(items)) return res.status(400).json({ message: "Expected array" })
    await Promise.all(items.map(({ id, order }) =>
      HomepageSection.findByIdAndUpdate(id, { order })
    ))
    const all = await HomepageSection.find().sort({ order: 1 }).lean()
    res.json(all)
  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

// DELETE /api/homepage-sections/:id
// Protected — delete a section
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await HomepageSection.findByIdAndDelete(req.params.id)
    res.json({ message: "Deleted" })
  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
