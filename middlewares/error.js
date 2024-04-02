const { object } = require("joi");
const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // wrong Mongodb id error
  if (err.name === "CastError") {
    const message = `Resoucrce not found: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyvalue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // JSON web Token error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web Token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  // JSON web Token Expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json web Token Expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
