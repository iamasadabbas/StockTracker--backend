const express = require("express");
const {getProductLocationById,updateAvailableQuantity,getProductByLocationId,getTotalProductCount } = require("../controllers/productLocationController");
const router = express.Router();
router.route("/getProductQuantity/:product_id").get(getProductLocationById)
router.route("/updateProductQuantityByProductId/:product_id").post(updateAvailableQuantity)
router.route("/getProductByLocationId/:location_id").get(getProductByLocationId)
router.route("/getTotalProductCount").get(getTotalProductCount)
module.exports = router;