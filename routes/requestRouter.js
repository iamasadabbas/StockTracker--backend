const express = require("express");
const { getProductRequest, productRequest, getRequestByMonth, getRequestCategoryCount,getAllProductRequest, getProductRequestByRequestId,updateRequestStatus } = require("../controllers/requestController");
const router = express.Router();

router.route("/getProductRequest/:user").get(getProductRequest)
router.route("/updateRequestStatus/:_id").put(updateRequestStatus)
router.route("/getProductRequestByRequestId/:request_id").get(getProductRequestByRequestId)
router.route("/getAllProductRequest").get(getAllProductRequest)
router.route("/getRequestByMonth/:user").get(getRequestByMonth)
router.route("/getRequestCategoryCount/:user").get(getRequestCategoryCount)
router.route("/productRequest").post(productRequest);

module.exports = router;