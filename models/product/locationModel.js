const mongoose = require("mongoose");
const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
});
module.exports = mongoose.model("Location", locationSchema);
