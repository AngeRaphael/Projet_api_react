const mongoose = require("mongoose")

const produitSchema = mongoose.Schema({
  _id : String,
  ean : String,
  product_name : String,
  brands : String,
  nutriscore_grade : String,
  api_category : String,
  image_url : String,
  category : String,
  note : String
})

module.exports = mongoose.model("produit", produitSchema)
