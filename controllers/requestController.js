const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const mongoose = require("mongoose");

const Request = require("../models/request/productRequestModel");
const UserProduct = require("../models/request/userProductModel");
const ProductType = require("../models/product/productTypeModel");
const { sendMessage } = require("./notificationController");
const { request } = require("express");

// get Product Request
/////////////////////////////////////////////////////////////////////////////////////////////
exports.getProductRequest = catchAsyncError(async (req, res, next) => {
  const id = req.params.user;

  try {
    // const request= await Request.find({user_id:id}).populate({path:"product_id._id",populate:{path:"company_id"}}).populate('user_id')
    const request = await Request.find({ user_id: id })
      .populate("user_id")
      .populate({
        path: "request_id",
        populate: {
          path: "product_id._id",
          model: "Product",
          populate: { path: "type_id", model: "ProductType" }, // Populate type_id
        },
      })
      .sort({ "date.getMonth()": 1 });
    if (request.length != 0) {
      res.status(200).json({
        success: true,
        request,
      });
    }
  } catch (error) {
    console.log(error);
  }
});
// get Product Request by requestId
/////////////////////////////////////////////////////////////////////////////////////////////
exports.getProductRequestByRequestId = catchAsyncError(
  async (req, res, next) => {
    const id = req.params.request_id;

    try {
      // const request= await Request.find({user_id:id}).populate({path:"product_id._id",populate:{path:"company_id"}}).populate('user_id')
      const request = await Request.find({ request_id: id })
        .populate("user_id")
        .populate({
          path: "request_id",
          populate: {
            path: "product_id._id",
            model: "Product",
            populate: { path: "type_id", model: "ProductType" }, // Populate type_id
          },
        })
        .sort({ "date.getMonth()": 1 });
      if (request.length != 0) {
        res.status(200).json({
          success: true,
          request,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

////////////getAll product request//////////////
exports.getAllProductRequest = catchAsyncError(async (req, res, next) => {
  try {
    // const request= await Request.find({user_id:id}).populate({path:"product_id._id",populate:{path:"company_id"}}).populate('user_id')
    const request = await Request.find()
      .populate("user_id")
      .populate({
        path: "request_id",
        populate: {
          path: "product_id._id",
          model: "Product",
          populate: { path: "type_id", model: "ProductType" }, // Populate type_id
        },
      })
      .sort({ "date.getMonth()": 1 });
    if (request.length != 0) {
      res.status(200).json({
        success: true,
        request,
      });
    }
  } catch (error) {
    console.log("error is " + error);
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////
exports.productRequest = catchAsyncError(async (req, res, next) => {
  const { user_id, product_id } = req.body;
  console.log(req.body);

  // Generate a unique request number
  const lastRequest = await Request.findOne(
    {},
    {},
    { sort: { createdAt: -1 } }
  );
  let requestNumber = "ST-0001";
  if (lastRequest) {
    const lastRequestNumber = lastRequest.request_number || "ST-0000";
    console.log(lastRequestNumber);
    const nextNumber = parseInt(lastRequestNumber.split("-")[1], 10) + 1;
    requestNumber = padZeros(nextNumber, 4);
  }

  const userProduct = await UserProduct.create({
    user_id,
    product_id,
  });

  if (userProduct) {
    const request = await Request.create({
      request_id: userProduct._id,
      user_id,
      request_number: requestNumber,
    });

    if (request) {
      console.log(requestNumber);
      res.status(200).json({
        success: true,
      });
      const title = "Muneeb Ur Rehman";
      const message = "Request Created Successfully";
      sendMessage(user_id, title, message);
    }
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////

const padZeros = (number, length) => {
  return `ST-${String(number).padStart(length, "0")}`;
};

/////////////////////////////////////////////////////////////////////////////////////////////
exports.getRequestByMonth = catchAsyncError(async (req, res, next) => {
  const userId = req.params.user; // Renamed id to userId for clarity
  console.log(userId);

  try {
    const requestsByMonth = await Request.aggregate([
      { $match: { user_id: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    const monthCounts = new Array(12).fill(0); // Initialize an array to hold counts for each month
    requestsByMonth.forEach((entry) => {
      monthCounts[entry._id - 1] = entry.count; // Subtract 1 to adjust for zero-based indexing
    });

    console.log(monthCounts);
    res.status(200).json({
      success: true,
      countsByMonth: monthCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////
exports.getRequestCategoryCount = catchAsyncError(async (req, res, next) => {
  const id = req.params.user;

  try {
    // Retrieve product types
    const products = await ProductType.find();
    const productTypes = products.map((product) => product.name); // Extract product names from the array of objects

    // Retrieve requests
    const requests = await Request.find({ user_id: id })
      .populate("user_id")
      .populate({
        path: "request_id",
        populate: {
          path: "product_id._id",
          model: "Product",
          populate: { path: "type_id", model: "ProductType" }, // Populate type_id
        },
      });

    // Initialize counts for each product type
    const productTypeCounts = new Array(productTypes.length).fill(0);

    // Count requests for each product type
    requests.forEach((request) => {
      request.request_id.product_id.forEach((product) => {
        const productTypeName = product._id.type_id.name; // Access populated field correctly
        const index = productTypes.indexOf(productTypeName);
        if (index !== -1) {
          productTypeCounts[index]++;
        }
      });
    });

    // Create pairs of product type and its count
    const result = productTypes.map((type, index) => ({
      product: type,
      request: productTypeCounts[index],
    }));
    const total = requests.length;
    console.log(result);
    res.status(200).json({
      success: true,
      productTypeCounts: result,
      totalCount: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

//////////update request status/////////////////

exports.updateRequestStatus = async (req, res) => {
  try {
    // Update the specific request
    let updatedRequest = await Request.findOneAndUpdate(
      { request_id: req.params.request_id },
      { $set: { status: req.body.status } },
      { new: true } // This option returns the updated document
    );

    // Fetch all requests with the updated status
    let requestsWithUpdatedStatus = await Request.find().populate("user_id");

    // Send the fetched requests as the response
    res.send(requestsWithUpdatedStatus);
  } catch (error) {
    // Handle any errors
    res
      .status(500)
      .send({ error: "An error occurred while updating the request status" });
  }
};

exports.getAllUserRequestedproduct = async (req, res) => {
  let result = await UserProduct.find();
  res.send(result);
};
exports.updateUserRequestByIds = async (req, res) => {
  let result = await UserProduct.findOneAndUpdate(
    {
      _id: req.params.request_id,
      "product_id._id": req.params.product_id,
    },
    {
      $set: {
        "product_id.$.status": req.body.status,
        "product_id.$.received_quantity": req.body.received_quantity,
      },
    },
    { new: true }
  );

  res.status(200).send(result);
};
/// Product receiving
exports.productReceiving = catchAsyncError(async (req, res, next) => {
  try {
    const result = await Request.updateOne(
      { request_id: req.body.Id },
      { $set: { status: "completed" } }
    );
    console.log(result);
    if (result.modifiedCount === 1) {
      // Successfully updated
      res.status(200).json({ success: true });
    } else {
      // No document found matching the criteria
      res.status(404).json({ success: false });
    }
  } catch (error) {
    console.log(error);
  }
});

exports.getRequestedProduct = catchAsyncError(async (req, res) => {
  const request_id = req.params.request_id;
  const request = await UserProduct.findOne({ _id: request_id }).populate(
    "product_id._id"
  );

  res.send({
    success: true,
    request,
  });
});
