const mongoose = require("mongoose")

const categorySettingSchema = new mongoose.Schema({
  slug:    { type: String, required: true, unique: true },
  title:   { type: String, required: true },
  visible: { type: Boolean, default: true },
  showInNavbar: { type: Boolean, default: false },
  showInFooter: { type: Boolean, default: false },
  showInSidebar: { type: Boolean, default: false },
  order:   { type: Number, default: 0 },
})

module.exports = mongoose.model("CategorySetting", categorySettingSchema)
