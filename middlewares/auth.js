const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/user/userModel");
const roleModel = require("../models/user/roleModel");
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this Resouce", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  
  return async (req, res, next) => {
    const role= await roleModel.findById(req.user.role);
    if (!roles.includes(role.name)) {
      return next(
        new ErrorHandler(
          `Role:${role.name} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
