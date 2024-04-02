const mongoose = require("mongoose");
const designationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Designation", designationSchema);
