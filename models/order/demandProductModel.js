const { string, ref } = require("joi");
const mongoose = require("mongoose");
const demandProductSchema = new mongoose.Schema(
  {
    products: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        received_quantity: {
          type: Number,
          default:null
        },
      },
    ],
    subject: {
      type: String,
    },
    applicationId: {
      type: String,
    },

    date: {
      type: String,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'location'
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    signatureRecord_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "signatureRecord",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved","Partial Approved"],
      default: "Pending"
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Demand", demandProductSchema);
