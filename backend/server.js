require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const authRoutes = require("./routes/auth")
const placementsRoutes = require("./routes/placements")
const categoriesRoutes = require("./routes/categories")
const homepageSectionsRoutes = require("./routes/homepageSections")
const sectionLabelsRoutes = require("./routes/sectionLabels")
const keepAliveRoutes = require("./routes/keepAlive")
const newsTickerRoutes = require("./routes/newsTicker")

const app = express()

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    // Allow any origin. Using `origin: true` will reflect the request
    // origin back in the CORS response which works together with
    // `credentials: true` (unlike a literal '*' when credentials are set).
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
)

// ── BODY PARSER ───────────────────────────────────────────────────────────────
app.use(express.json())

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes)
app.use("/api/placements", placementsRoutes)
app.use("/api/categories", categoriesRoutes)
app.use("/api/homepage-sections", homepageSectionsRoutes)
app.use("/api/section-labels", sectionLabelsRoutes)
app.use("/api/keepalive", keepAliveRoutes)
app.use("/api/news-ticker", newsTickerRoutes)

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }))

// ── MONGODB CONNECTION + SERVER START ─────────────────────────────────────────
const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected")
    const server = app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))

    const gracefulShutdown = (signal) => {
      console.log(`Received ${signal}. Closing server and MongoDB connection...`)
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed.')
          if (signal === 'SIGUSR2') {
            // nodemon restart
            process.kill(process.pid, 'SIGUSR2')
          } else {
            process.exit(0)
          }
        })
      })
    }

    // Listen for nodemon restart signal
    process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'))
    // Listen for app termination
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message)
    process.exit(1)
  })
