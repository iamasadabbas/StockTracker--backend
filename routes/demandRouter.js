const express = require("express");
const {demandProduct} =require('../controllers/demandController')
const router = express.Router();

router.route("/demandProduct").post(demandProduct);

module.exports = router;