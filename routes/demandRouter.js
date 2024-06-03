const express = require("express");
const {demandProduct,getAllDemand,getDemandbyId,updateDemandStatus,postReceivedQuantity} =require('../controllers/demandController')
const router = express.Router();


router.route("/demandProduct").post(demandProduct);
router.route("/getAllDemand").get(getAllDemand);
router.route("/getDemandById/:_id").get(getDemandbyId);
router.route("/updateDemandStatus/:_id").put(updateDemandStatus);
router.route("/postDemandQunatity/:request_id/:product_id").put(postReceivedQuantity);

module.exports = router;