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
    comment: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "Requested",
        "Processing",
        "Pending Approvel",
        "Acknowledge",
        "Not Acknowledge",
        "Completed",
        "Rejected",
      ],
      default: "Requested",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Request", productRequestSchema);
