const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const Product = require("../models/product/productModel");
const ProductType = require("../models/product/productTypeModel");
const ProductCompany = require("../models/product/productCompanyModel");
const Location = require("../models/product/locationModel");
const ProductLocation = require("../models/product/productLocationModel");
const mongoose = require("mongoose");

/////////////////////////////////////////////////////////////////////////////////////////////////

//Add Product
exports.addProduct = catchAsyncError(async (req, res, next) => {
  // const { name, specifications, type_id, location_id, description,quantity } = req.body;
  const { name, specifications,description, type_id, company_id } = req.body;
  console.log(req.body);

  try {

    const product = await Product.create({
      name,
      specifications,
      type_id,
      company_id,
      company_id,
      description,
    });

    if (product) {
      const allProduct=await Product.find().populate('type_id').populate('company_id')
      res.send({
        status: 200,
        message: "Product created successfully",
        allProduct
      });
    }
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

//Add Product Type
///////////////////////////////////////////////////////////////////////////////////////////////
exports.addProductType = catchAsyncError(async (req, res, next) => {
  const { productType,typeDescription } = req.body;
  // console.log(req.body);

  try {
    const product = await ProductType.create({
      name:productType,
      description:typeDescription
    });
    if (product) {
      res.send({ status: 200, message: "Product Type Add Successfully" });
    }
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        status: 409,
        message: `Duplicate ${duplicateField}: ${error.keyValue[duplicateField]}`,
      });
    } else {
      res.status(500).json({ status: 500, error: "Internal server error" });
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////

//Add Product Company
///////////////////////////////////////////////////////////////////////////////////////////////
exports.addProductCompany = catchAsyncError(async (req, res, next) => {
  const { name, description } = req.body;
  // console.log(req.body);

  const productTypeExists = await ProductCompany.findOne({ name: name });
  try {
    // console.log(productTypeExists);
    if (productTypeExists) {
      res.send({ status: 409 });
    } else {
      const product = await ProductCompany.create({
        name,
        description,
      });
      res.send({ status: 200, message: "Product Company Add Successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

// Get All Product
/////////////////////////////////////////////////////////////////////////////////////////////
exports.getAllProductById = catchAsyncError(async (req, res, next) => {
  try {
    const typeId = mongoose.Types.ObjectId(req.params.id); // Convert string to ObjectId
    console.log("Type ID:", typeId);

    // Aggregate to match products by type_id and populate related fields
    const product = await ProductLocation.aggregate([
      {
        $lookup: {
          from: "products", // Assuming the collection name is 'products'
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" }, // Unwind the populated product array
      {
        $match: {
          "product.type_id": typeId,
        },
      },
    ]);

    console.log("Filtered Products:", product);

    if (product.length === 0) {
      res.json({ success: false, product: "No Item Found" });
    } else {
      res.status(200).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

exports.getAllProduct = catchAsyncError(async (req, res, next) => {
  try {
    const product = await Product.find().populate('type_id').populate('company_id')
    if (product == "") {
      res.json({ success: false, product: "No Item Found" });
    } else {
      res.send({
        product,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////

// Get Product Type
/////////////////////////////////////////////////////////////////////////////////////////////
exports.getProductCompany = catchAsyncError(async (req, res, next) => {
  try {
    const product = await ProductCompany.find();

    if (product.length != 0) {
      res.send({
        status: 200,
        product,
      });
    }
  } catch (error) {
    res.send({
      status: 400,
      message: "Error",
    });
  }
});

///////////////update Product quantity by product Id/////////////

exports.updateProductQuantity = async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params._id },
    { $set: req.body }
  ).populate("taskId");
  return res.send(result);
};

exports.getProductType = catchAsyncError(async (req, res, next) => {
  try {
    const product = await ProductType.find();

    if (product.length != 0) {
      res.status(200).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////

///////////////Add Location/////////////

exports.addLocation = async (req, res) => {
  try {
    const { name, description } = req.body;

    const location = await Location.create({
      name,
      description,
    });

    if (location.length != 0) {
      res.status(200).json({
        success: true,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////
