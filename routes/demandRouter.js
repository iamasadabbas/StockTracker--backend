const express = require("express");
const {demandProduct,getAllDemand,getDemandbyId,updateDemandStatus} =require('../controllers/demandController')
const router = express.Router();

router.route("/demandProduct").post(demandProduct);
router.route("/getAllDemand").get(getAllDemand);
router.route("/getDemandById/:_id").get(getDemandbyId);
router.route("/updateDemandStatus/:_id").put(updateDemandStatus);

module.exports = router;