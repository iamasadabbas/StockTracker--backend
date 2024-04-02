const mongoose = require("mongoose");
const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: [true, "Faculty Already Exist"],
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Faculty", facultySchema);
