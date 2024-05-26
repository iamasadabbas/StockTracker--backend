const mongoose = require("mongoose");
const productTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  }
});
// productTypeSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("ProductType", productTypeSchema);
