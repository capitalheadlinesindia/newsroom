const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const NewsTicker = require("../models/NewsTicker")

function sanitizeItems(items) {
  if (!Array.isArray(items)) return []
  return items
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean)
    .slice(0, 30)
}

// GET /api/news-ticker
// Public — ticker config for homepage rendering
router.get("/", async (_req, res) => {
  try {
    const doc = await NewsTicker.findOne().lean()
    if (!doc) return res.json({ enabled: false, items: [] })
    return res.json({ enabled: !!doc.enabled, items: sanitizeItems(doc.items) })
  } catch {
    return res.status(500).json({ message: "Server error" })
  }
})

// PUT /api/news-ticker
// Protected — update ticker enabled flag and text items
router.put("/", authMiddleware, async (req, res) => {
  try {
    const items = sanitizeItems(req.body?.items)
    const enabled = Boolean(req.body?.enabled)

    const updated = await NewsTicker.findOneAndUpdate(
      {},
      { enabled, items },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    ).lean()

    return res.json({ enabled: !!updated.enabled, items: sanitizeItems(updated.items) })
  } catch {
    return res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
