const { required } = require("joi");
const mongoose = require("mongoose");
const signatureRecordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:true,
      unique:true,
    },
    designation: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("signatureRecord", signatureRecordSchema);
