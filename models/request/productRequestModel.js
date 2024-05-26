const mongoose = require("mongoose");
const productRequestSchema = new mongoose.Schema(
  {
    request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User_Product",
    },
    request_number: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["waiting", "processing", "receiving", "completed", "rejected"],
      default: "waiting",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Request", productRequestSchema);
