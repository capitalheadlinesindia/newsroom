require('dotenv').config()
const mongoose = require('mongoose')
const CategorySetting = require('../models/CategorySetting')

async function main(){
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')
  const res = await CategorySetting.updateMany({}, { $set: { showInNavbar: false, showInFooter: false, showInSidebar: false } })
  console.log('Updated', res.modifiedCount, 'documents')
  await mongoose.disconnect()
}

main().catch(err => { console.error(err); process.exit(1) })
