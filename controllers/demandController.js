const Demand=require('../models/order/demandProductModel')
const catchAsyncError = require("../middlewares/catchAsyncError");

exports.demandProduct = catchAsyncError(async (req, res, next) => {
    const { products,user_id,status } = req.body;
    console.log(req.body);
    try {
      const demandedProduct = await Demand.create({
        products,
        user_id,
        status
      });
  
    if(demandedProduct){
        res.status(200).send({demandedProduct})
    }
    } catch (error) {
        console.log(error);
    }
  });