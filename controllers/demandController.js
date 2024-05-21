const Demand=require('../models/order/demandProductModel')
const catchAsyncError = require("../middlewares/catchAsyncError");

exports.demandProduct = catchAsyncError(async (req, res, next) => {
    const { products,subject,applicationId,date,locationId,user_id,status } = req.body;
    // console.log(req.body);
    try {
      const demandedProduct = await Demand.create({
        products,
        subject,
        applicationId,
        date,
        locationId,
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
exports.getAllDemand = catchAsyncError(async (req, res, next) => {
    try {
      const demandedProduct = await Demand.find({
      }).populate('products._id')
  
    if(demandedProduct){
        res.status(200).send({demandedProduct})
    }
    } catch (error) {
        console.log(error);
    }
  });
exports.getDemandbyId = catchAsyncError(async (req, res, next) => {
    try {
      const demandedProduct = await Demand.findOne({_id: req.params._id
      }).populate('products._id')
  
    if(demandedProduct){
        res.status(200).send({demandedProduct})
    }
    } catch (error) {
        console.log(error);
    }
  });
exports.updateDemandStatus = catchAsyncError(async (req, res, next) => {
    try {
      const demandedProduct = await Demand.updateOne({ _id: req.params._id }, { $set:{ "status": req.body.status} })
  
    if(demandedProduct){
        res.status(200).send({demandedProduct})
    }
    } catch (error) {
        console.log(error);
    }
  });