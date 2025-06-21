import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  coverImage: String,
  additionalImages: [String],
})

const Item = mongoose.model('Item', itemSchema)

export default Item
