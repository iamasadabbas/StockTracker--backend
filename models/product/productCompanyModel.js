const mongoose = require("mongoose");
const productCompanySchema = new mongoose.Schema({
  name: {
    type: String,
    unique:true,
    required:true,
  },
  description:{
    type:String
  }
});
module.exports = mongoose.model("Company", productCompanySchema);
