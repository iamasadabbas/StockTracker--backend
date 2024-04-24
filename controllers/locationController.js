const catchAsyncError = require("../middlewares/catchAsyncError");
const Location =require ('../models/product/locationModel');
exports.getAllLocation = catchAsyncError(async (req, res, next) => {
    try {
      const allLocation = await Location.find()
      if (allLocation) {
        res.status(200).send({
          allLocation
        });
      } else {
        res.status()({ status: 404, message: "user not found" });
      }
    } catch (error) {
      console.error(error);
    }
  });