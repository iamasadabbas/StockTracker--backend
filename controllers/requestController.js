const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const mongoose = require("mongoose");
const moment = require("moment");
const Request = require("../models/request/productRequestModel");
const UserProduct = require("../models/request/userProductModel");
const ProductType = require("../models/product/productTypeModel");
const { sendMessage } = require("./notificationController");
const { request, response } = require("express");
const User = require("../models/user/userModel");

// get Product Request
/////////////////////////////////////////////////////////////////////////////////////////////
exports.getProductRequest = catchAsyncError(async (req, res, next) => {
  const id = req.params.user;
  try {
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
      .sort({ updatedAt: -1 });

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
        .sort({ updatedAt: -1 });
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
    const allRequest = await Request.find()
      .populate("user_id")
      .populate({
        path: "request_id",
        populate: {
          path: "product_id._id",
          model: "Product",
          populate: { path: "type_id", model: "ProductType" }, // Populate type_id
        },
      })
      .sort({ createdAt: -1 }); // Sort by date in descending order (newest first)

    if (allRequest.length !== 0) {
      // console.log(request);
      res.status(200).json({
        success: true,
        allRequest,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No requests found",
      });
    }
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

exports.getLast7daysProductRequest = catchAsyncError(async (req, res, next) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to start of the current day in UTC

    let NoOfRequest = [];

    for (let index = 0; index < 7; index++) {
      const startOfDay = new Date(today);
      startOfDay.setUTCDate(today.getUTCDate() - index);
      for (let index = 0; index < 7; index++) {
        const startOfDay = new Date(today);
        startOfDay.setUTCDate(today.getUTCDate() - index);

        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // console.log(startOfDay);
        // console.log(endOfDay);
        const requests = await Request.find({
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        });
        // console.log(`Requests on day ${index}:`, requests.length);
        NoOfRequest.push(requests.length);
      }

      res.send({
        status: 200,
        requestCounts: NoOfRequest.reverse(), // Reverse the array to get the counts in chronological order
      });
    }
  } catch (error) {
    console.error("Error finding requests:", error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

exports.getWaitingProductRequest = catchAsyncError(async (req, res, next) => {
  try {
    // const request= await Request.find({user_id:id}).populate({path:"product_id._id",populate:{path:"company_id"}}).populate('user_id')
    const request = await Request.find({ status: "waiting" })
      .populate("user_id")
      .populate({
        path: "request_id",
        populate: {
          path: "product_id._id",
          model: "Product",
          populate: { path: "type_id", model: "ProductType" }, // Populate type_id
        },
      });
    if (request.length != 0) {
      const waitingRequestCount = request.length;
      res.status(200).json({
        success: true,
        waitingRequestCount,
        request,
      });
    }
  } catch (error) {
    console.log("error is " + error);
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////

// Add Product Request
/////////////////////////////////////////////////////////////////////////////////////////////
exports.productRequest = catchAsyncError(async (req, res, next) => {
  const { user_id, product_id, comment } = req.body;
  console.log(req.body);

  const user = await User.findOne({ _id: user_id });
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
      comment,
    });

    if (request) {
      console.log(requestNumber);
      res.status(200).json({
        success: true,
      });
      const user_id = user._id;
      const title = user.name;
      const message = "Your request has been created successfully";
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
  // console.log(userId);

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

    // console.log(monthCounts);
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
    // console.log(result);
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
    if(updatedRequest){
      let requestsWithUpdatedStatus = await Request.find().populate('user_id').sort({ createdAt: -1 });
      res.send(requestsWithUpdatedStatus);

    }

    // Send the fetched requests as the response
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
  try {
    // Update the specific product in the request
    let result = await UserProduct.findOneAndUpdate(
      {
        "_id": req.params.request_id,
        "product_id._id": req.params.product_id
      },
      {
        $set: {
          "product_id.$.status": req.body.status,
          "product_id.$.received_quantity": req.body.received_quantity,
          "product_id.$.comment": req.body.comment,
          "product_id.$.received_quantity": req.body.received_quantity,
          "product_id.$.comment": req.body.comment
        }
      },
      { new: true }
    );

    if (result) {
      // Retrieve the updated request with populated fields
      const data = await Request.find({ "request_id": req.params.request_id }).populate("user_id")
        .populate({
          path: "request_id",
          populate: {
            path: "product_id._id",
            model: "Product",
            populate: { path: "type_id", model: "ProductType" },
          },
        });

      // Check the status of all products
      const allRejected = data[0].request_id.product_id.every(item => item.status === "Rejected");
      let partialUpdateMade = false;

      if (allRejected) {
        // Update request status to "rejected" if all products are rejected
        await Request.findOneAndUpdate(
          { request_id: req.params.request_id },
          { $set: { status: "Completed" } }
        );
      } else {
        // Check for any product with "waiting" status
        for (const item of data[0].request_id.product_id) {
          if (item.status === "Pending") {
            await Request.findOneAndUpdate(
              { request_id: req.params.request_id },
              { $set: { status: "processing" } }
            );
            partialUpdateMade = true;
            break; 
            break; 
          }
        }

        if (!partialUpdateMade) {
          await Request.findOneAndUpdate(
            { request_id: req.params.request_id },
            { $set: { status: "Pending Approval" } }
          );
        }
      }

      // Retrieve the updated request to send in response
      const newData = await Request.find({ "request_id": req.params.request_id }).populate("user_id")
        .populate({
          path: "request_id",
          populate: {
            path: "product_id._id",
            model: "Product",
            populate: { path: "type_id", model: "ProductType" },
          },
        });
        if(newData){
          const allRequest=await Request.find().populate("user_id")
          .populate({
            path: "request_id",
            populate: {
              path: "product_id._id",
              model: "Product",
              populate: { path: "type_id", model: "ProductType" }, // Populate type_id
            },
          })
          .sort({ createdAt: -1 });
        res.status(200).send({newData,allRequest});
        }

        if(newData){
          const allRequest=await Request.find().populate("user_id")
          .populate({
            path: "request_id",
            populate: {
              path: "product_id._id",
              model: "Product",
              populate: { path: "type_id", model: "ProductType" }, // Populate type_id
            },
          })
          .sort({ createdAt: -1 });
        res.status(200).send({newData,allRequest});
        }

    } else {
      res.status(404).send({ message: "Request not found" });
    }
  } catch (error) {
    console.error('Error updating user request:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

/// Product receiving
exports.productReceiving = catchAsyncError(async (req, res, next) => {
  try {
    const result = await Request.updateOne(
      { request_id: req.body.Id },
      { $set: { status: "completed" } }
    );
    // console.log(result);
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
    request
  })
})
// requestController.js
exports.getRequestById = catchAsyncError(async (req, res, next) => {
  const currentRequestId = req.params.currentRequestId;
  
  const request = await Request.findOne({ _id: currentRequestId }).populate({
    path: 'request_id',
    populate: [
      { path: 'user_id' },
      { path: 'product_id._id', model: 'Product' }
    ]
  })
  .populate('user_id')
  .exec();
  
  if (!request) {
    // Throw an error if the request is not found
    const error = new Error('Request not found');
    error.status = 404;
    throw error;
  }
  
  res.send({
    success: true,
    request
  });
});





///Request Invoice Notification////////
exports.getRecentRequestNotification = catchAsyncError(async (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  try {
    const request = await Request.find({ user_id: id }).populate("user_id");
    const sortedRequests = request.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    const recentRequest = sortedRequests.slice(0, 10);
    const notifications = recentRequest.map((Invoice) => {
      const updatedAt = new Date(Invoice.updatedAt);
      const timeElapsed = moment(updatedAt).fromNow();
      return {
        noti: `Your Request No (${Invoice.request_number}) is in ${Invoice.status} stage.`,
        time: timeElapsed,
        status: Invoice.status,
      };
    });

    res.json({
      notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
