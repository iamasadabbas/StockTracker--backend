const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    specifications: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
      required: true,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", productSchema);
