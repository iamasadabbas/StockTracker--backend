const Demand = require("../models/order/demandProductModel");
const catchAsyncError = require("../middlewares/catchAsyncError");

exports.demandProduct = catchAsyncError(async (req, res, next) => {
  const {
    products,
    subject,
    applicationId,
    date,
    locationId,
    user_id,
    signatureRecord_id,
  } = req.body;
  // console.log(locationId);
  try {
    const demandedProduct = await Demand.create({
      products,
      subject,
      applicationId,
      date,
      locationId,
      user_id,
      signatureRecord_id,
    });

    if (demandedProduct) {
      res.status(200).send({ demandedProduct });
    }
  } catch (error) {
    console.log(error);
  }
});
exports.getAllDemand = catchAsyncError(async (req, res, next) => {
  try {
    const demandedProduct = await Demand.find({})
      .populate("products._id")
      .sort({ createdAt: -1 });

    if (demandedProduct) {
      res.status(200).send({ demandedProduct });
    }
  } catch (error) {
    console.log(error);
  }
});
exports.getDemandbyId = catchAsyncError(async (req, res, next) => {
  try {
    const demandedProduct = await Demand.findOne({ _id: req.params._id })
      .populate("products._id")
      .populate("signatureRecord_id")
      .sort({ createdAt: -1 });

    if (demandedProduct) {
      res.status(200).send({ demandedProduct });
    }
  } catch (error) {
    console.log(error);
  }
});
exports.updateDemandStatus = catchAsyncError(async (req, res, next) => {
  try {
    const demandedProduct = await Demand.findOneAndUpdate(
      { _id: req.params._id },
      { $set: { status: req.body.status } }
    );
    // console.log(demandedProduct);
    if (demandedProduct) {
      const alldemand = await Demand.find()
        .populate("products._id")
        .sort({ createdAt: -1 });
      res.status(200).send({ alldemand });
    }
  } catch (error) {
    console.log(error);
  }
});

exports.postReceivedQuantity = async (req, res) => {
  try {
    let result = await Demand.findOneAndUpdate(
      {
        _id: req.params.request_id,
        "products._id": req.params.product_id,
      },
      {
        $set: {
          "products.$.received_quantity": req.body.received_quantity,
        },
      },
      { new: true }
    );
    res.send(200, {
      message: "Success",
      result,
    });
  } catch (error) {
    res.send(error);
  }
};
