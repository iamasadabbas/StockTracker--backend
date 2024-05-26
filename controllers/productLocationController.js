const productLocation = require("../models/product/productLocationModel");
const catchAsyncError = require("../middlewares/catchAsyncError");
exports.getProductLocationById = catchAsyncError(async (req, res, next) => {
    try {
      const request = await productLocation.findOne({ product_id:req.params.product_id })
      if (request.length != 0) {
        res.send({status:200,request})
        
      }
    } catch (error) {
      console.log(error);
    }
  });

  exports.getProductByLocationId = catchAsyncError(async (req, res, next) => {
    try {
      const request = await productLocation.find({location_id:req.params.location_id}).populate('product_id')
      if (request.length != 0) {
        res.send({status:200,request})
        
      }
    } catch (error) {
      console.log(error);
    }
  });

  exports.getTotalProductCount = catchAsyncError(async (req, res, next) => {
    try {
      const request = await productLocation.find()
      console.log(request);
      if (request.length != 0) {
        
        console.log('enter');
        let lowStockProduct=0;
        let outOfStockProduct=0;
        request.map(item=>{
          if(item.quantity < 5){
            lowStockProduct++
          }else if(item.quantity === 0){
            outOfStockProduct++
          }
        })
        const productCount=request.length
        console.log(productCount);
        res.send({status:200,productCount,lowStockProduct,outOfStockProduct})
        
      }
    } catch (error) {
      console.log(error);
    }
  });
  exports.updateAvailableQuantity = async (req, res) => {
    try {
        const { product_id } = req.params;
        const { quantity } = req.body;

        let result = await productLocation.findOne({ product_id })

        if (!result) {
            return res.status(404).send("Product not found");
        }

        // Update the quantity field
        result.quantity = quantity;
        await result.save();

        return res.send({
          message:"Success",
          result
        });
    } catch (error) {
        console.error("Error updating available quantity:", error);
        return res.status(500).send("Internal Server Error");
    }
}

