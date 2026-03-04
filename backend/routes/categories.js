const express = require("express")
const router = express.Router()
const CategorySetting = require("../models/CategorySetting")
const authMiddleware = require("../middleware/authMiddleware")

/**
 * GET /api/categories
 * Public — returns visible categories sorted by order (used by Navbar & Footer)
 */
router.get("/", async (req, res) => {
  try {
    const { location } = req.query
    const filter = { visible: true }
    if (location === "navbar") filter.showInNavbar = true
    if (location === "footer") filter.showInFooter = true
    if (location === "sidebar") filter.showInSidebar = true
    const cats = await CategorySetting.find(filter).sort({ order: 1 })
    res.json(cats)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

/**
 * GET /api/categories/all
 * Protected — returns ALL categories (visible + hidden) for the admin panel
 */
router.get("/all", authMiddleware, async (_req, res) => {
  try {
    const cats = await CategorySetting.find().sort({ order: 1 })
    res.json(cats)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

/**
 * POST /api/categories/sync
 * Protected — called by admin dashboard on load.
 * Receives array of { slug, title } from Sanity.
 * Creates missing entries without touching existing settings.
 */
router.post("/sync", authMiddleware, async (req, res) => {
  try {
    const incoming = req.body // [{ slug, title }]
    if (!Array.isArray(incoming)) return res.status(400).json({ message: "Expected array" })

    // Find current max order so new items get appended
    const maxDoc = await CategorySetting.findOne().sort({ order: -1 })
    let nextOrder = maxDoc ? maxDoc.order + 1 : 0

    for (const { slug, title } of incoming) {
      const exists = await CategorySetting.findOne({ slug })
      if (!exists) {
        // Do NOT auto-enable categories for navbar/footer/sidebar. Admin should opt-in.
        await CategorySetting.create({
          slug,
          title,
          visible: true,
          order: nextOrder++,
          showInNavbar: false,
          showInFooter: false,
          showInSidebar: false,
        })
      } else if (exists.title !== title) {
        // Update title if changed in Sanity but keep other settings
        exists.title = title
        await exists.save()
      }
    }

    const all = await CategorySetting.find().sort({ order: 1 })
    res.json(all)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

/**
 * PUT /api/categories/:slug
 * Protected — update visibility and/or order for a single category
 */
router.put("/:slug", authMiddleware, async (req, res) => {
  try {
    const { visible, order, title, showInNavbar, showInFooter, showInSidebar } = req.body
    const cat = await CategorySetting.findOneAndUpdate(
      { slug: req.params.slug },
      {
        ...(visible !== undefined && { visible }),
        ...(order !== undefined && { order }),
        ...(title !== undefined && { title }),
        ...(showInNavbar !== undefined && { showInNavbar }),
        ...(showInFooter !== undefined && { showInFooter }),
        ...(showInSidebar !== undefined && { showInSidebar }),
      },
      { new: true }
    )
    if (!cat) return res.status(404).json({ message: "Category not found" })
    res.json(cat)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

/**
 * PUT /api/categories/reorder
 * Protected — bulk reorder: receives [{ slug, order }]
 */
router.put("/bulk/reorder", authMiddleware, async (req, res) => {
  try {
    const items = req.body // [{ slug, order }]
    if (!Array.isArray(items)) return res.status(400).json({ message: "Expected array" })

    await Promise.all(
      items.map(({ slug, order }) =>
        CategorySetting.findOneAndUpdate({ slug }, { order })
      )
    )
    const all = await CategorySetting.find().sort({ order: 1 })
    res.json(all)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
