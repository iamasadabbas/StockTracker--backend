const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const { addProduct, addProductType,getAllProduct, addProductCompany, addLocation, addProductLocation, getAllProductById, productRequest, getProductType, getProductCompany,updateProductQuantity } = require("../controllers/productController");
const router = express.Router();

router.route("/addProduct").post(addProduct)
router.route("/addProductType").post(addProductType)
router.route("/addProductCompany").post(addProductCompany)
router.route("/updateProductById/:_id").put(updateProductQuantity)
router.route("/addLocation").post(addLocation);


////////////////////////////////////////////////////////////////////////////////

router.route("/getAllProduct/:id").get(getAllProductById);
router.route("/getAllProduct").get(getAllProduct);
router.route("/getProductType").get(getProductType)
router.route("/getProductCompany").get(getProductCompany)
module.exports = router;