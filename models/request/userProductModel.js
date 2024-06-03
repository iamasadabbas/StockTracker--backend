const mongoose = require("mongoose");
const userProductSchema = new mongoose.Schema(
  {
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
        status: {
          type: String,
          enum: ["waiting", "assigned", "denied"],
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
