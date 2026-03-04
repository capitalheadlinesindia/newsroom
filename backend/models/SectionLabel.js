const mongoose = require("mongoose")

// Stores the display labels for placement section keys (e.g. winterOlympics → "Politics")
const SectionLabelSchema = new mongoose.Schema(
  {
    key:   { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model("SectionLabel", SectionLabelSchema)
