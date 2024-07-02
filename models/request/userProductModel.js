const mongoose = require("mongoose");
const userProductSchema = new mongoose.Schema(
  {
    request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        requested_quantity: {
          type: Number,
          default: 1,
        },
        received_quantity: {
          type: Number,
        },
        comment: {
          type: String,
        },
        status: {
          type: String,
          enum: ["waiting", "assigned", "rejected"],
          default: "waiting",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User_Product", userProductSchema);
