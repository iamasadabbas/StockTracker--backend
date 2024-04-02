const { string } = require("joi");
const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter role name"],
    unique: true
  },
  description:{
    type:String
  }
});

module.exports = mongoose.model("Role", roleSchema);
