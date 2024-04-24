const express = require("express");
const {getAllLocation} = require("../controllers/locationController");
const router = express.Router();
router.route("/getAllLocation").get(getAllLocation);
module.exports = router;


