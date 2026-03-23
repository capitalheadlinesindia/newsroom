const mongoose = require("mongoose")

const newsTickerSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    items: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length <= 30,
        message: "Ticker supports up to 30 items.",
      },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("NewsTicker", newsTickerSchema)
