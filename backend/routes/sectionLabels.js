const express = require("express")
const router = express.Router()
const SectionLabel = require("../models/SectionLabel")
const authMiddleware = require("../middleware/authMiddleware")

// GET /api/section-labels
// Public — returns all labels as { [key]: label }
router.get("/", async (_req, res) => {
  try {
    const docs = await SectionLabel.find().lean()
    const map = {}
    docs.forEach((d) => { map[d.key] = d.label })
    res.json(map)
  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

// PUT /api/section-labels/:key
// Protected — upsert a label for a section key
router.put("/:key", authMiddleware, async (req, res) => {
  try {
    const { label } = req.body
    if (!label || !label.trim()) {
      return res.status(400).json({ message: "label is required" })
    }
    const doc = await SectionLabel.findOneAndUpdate(
      { key: req.params.key },
      { label: label.trim() },
      { upsert: true, new: true }
    )
    res.json(doc)
  } catch {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
