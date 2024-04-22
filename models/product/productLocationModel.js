const mongoose = require("mongoose");
const productLoactionSchema = new mongoose.Schema({
  location_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  quantity: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("Product_Loaction", productLoactionSchema);
