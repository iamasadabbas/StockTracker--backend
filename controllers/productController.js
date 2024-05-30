const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const Product = require("../models/product/productModel");
const ProductType = require("../models/product/productTypeModel");
const ProductCompany = require("../models/product/productCompanyModel");
const Location = require("../models/product/locationModel");

/////////////////////////////////////////////////////////////////////////////////////////////////

//Add Product
exports.addProduct = catchAsyncError(async (req, res, next) => {
  // const { name, specifications, type_id, location_id, description,quantity } = req.body;
  const { name, specifications, type_id, description } = req.body;

  try {
    // const alreadyExist=await Product.findOne({name:name})
    // if(alreadyExist){
    //   res.send({
    //     status:409,
    //     message:"Product Already Exists",
    //   })
    // }else {

    const product = await Product.create({
      name,
      specifications,
      type_id,
      // company_id,
      description,
    });

    if (product) {
      res.send({
        status: 200,
        message: "Product created successfully",
      });
    }
    // }

    // if (product) {
    //   const productLocation = await ProductLocation.create({
    //     product_id: product._id,
    //     location_id: location_id,
    //     quantity
    //   });

    // if (productLocation) {
    //   return res.status(200).json({
    //     success: true,
    //     message: "Product added successfully.",
    //   });
    // } else {
    //   return res.status(500).json({
    //     success: false,
    //     error: "Failed to add product location.",
    //   });
    // }
    // } else {
    //   return res.status(500).json({
    //     success: false,
    //     error: "Failed to add product.",
    //   });
    // }
  } catch (error) {
    // Handle errors here
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
  const { name } = req.body;

  try {
    const product = await ProductType.create({
      name,
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
      res.send({ status: 200, message: "Product Type Add Successfully" });
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
    const id = req.params.id;
    console.log(id);
    const product = await Product.find({ type_id: id }).populate("type_id");
    console.log(product);
    if (product == "") {
      res.json({ success: false, product: "No Item Found" });
    } else {
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
exports.getAllProduct = catchAsyncError(async (req, res, next) => {
  try {
    const product = await Product.find();
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
