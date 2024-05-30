const express = require("express");
const {
  getProductRequest,
  productRequest,
  getRequestByMonth,
  getRequestCategoryCount,
  getAllProductRequest,
  getProductRequestByRequestId,
  updateRequestStatus,
  getRequestedProduct,
  updateUserRequestByIds,
  getAllUserRequestedproduct,
  getWaitingProductRequest,
  productReceiving,
  getLast7daysProductRequest,
  getRecentRequestNotification,
} = require("../controllers/requestController");
const router = express.Router();

router.route("/getProductRequest/:user").get(getProductRequest);
router.route("/updateRequestStatus/:request_id").put(updateRequestStatus);
router
  .route("/getProductRequestByRequestId/:request_id")
  .get(getProductRequestByRequestId);
router.route("/getAllProductRequest").get(getAllProductRequest);
router.route("/getRequestByMonth/:user").get(getRequestByMonth);
router.route("/getRequestCategoryCount/:user").get(getRequestCategoryCount);
router.route("/productRequest").post(productRequest);
router.route("/getAllUserRequestedProduct").get(getAllUserRequestedproduct);
router
  .route("/updateUserRequestedProductById/:request_id/:product_id")
  .put(updateUserRequestByIds);
router.route("/productReceiving").post(productReceiving);
router.route("/requestedProduct/:request_id").get(getRequestedProduct);
router.route("/getWaitingProductRequest").get(getWaitingProductRequest);
router.route("/getLast7daysProductRequest").get(getLast7daysProductRequest);
router.route("/getRequestNotification/:id").get(getRecentRequestNotification);

module.exports = router;
