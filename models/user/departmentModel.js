const mongoose = require("mongoose");
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: [true, "Department Already Register"],
  },
  description: {
    type: String,
  },
  faculty_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
});

module.exports = mongoose.model("Department", departmentSchema);
