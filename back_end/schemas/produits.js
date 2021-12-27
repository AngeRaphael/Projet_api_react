const mongoose = require("mongoose")
const category = require("./category")

const produitSchema = mongoose.Schema({
  _id : String,
  ean : String,
  product_name : String,
  brands : String,
  nutriscore_grade : String,
  api_category : String,
  image_url : String,
  category : {type: mongoose.Schema.Types.ObjectId,ref:category},
  note : String,
  date:String

})

module.exports = mongoose.model("produit", produitSchema)
