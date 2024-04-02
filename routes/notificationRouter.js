const express = require("express");
const { saveToken } = require("../controllers/notificationController");
const router = express.Router();

router.route("/saveToken").post(saveToken);

module.exports = router;