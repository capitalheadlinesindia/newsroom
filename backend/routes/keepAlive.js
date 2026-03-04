const express = require("express")
const router = express.Router()

// Target to ping — prefer explicit KEEPALIVE_TARGET, then BACKEND_URL, else localhost:5000
const TARGET = process.env.KEEPALIVE_TARGET || process.env.BACKEND_URL || `http://localhost:5000`

// GET /api/keepalive
// Pings a small set of endpoints on TARGET to keep them warm
router.get("/", async (_req, res) => {
  try {
    const paths = ["/", "/api/health"]
    const results = await Promise.all(
      paths.map(async (p) => {
        try {
          const url = `${TARGET.replace(/\/+$/, "")}${p}`
          const r = await fetch(url, { method: "GET" })
          const text = await r.text().catch(() => "")
          return { path: p, url, ok: r.ok, status: r.status, length: text.length }
        } catch (err) {
          return { path: p, ok: false, error: String(err) }
        }
      })
    )
    const ok = results.some((r) => r.ok)
    res.json({ ok, target: TARGET, results })
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) })
  }
})

module.exports = router
