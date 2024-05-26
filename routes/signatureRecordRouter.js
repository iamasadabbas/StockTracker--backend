const express = require('express');

const {
    AddSignatureRecord,getSignatureRecord,
    updateSignatureRecordStatus,getActiveDirectorSignatureRecord,getActiveAssistantDirectorSignatureRecord
} =require('../controllers/signatureRecord')
const router = express.Router();

router.route("/addSignatureRecord").post(AddSignatureRecord);
router.route("/getSignatureRecord").get(getSignatureRecord);
router.route("/updateSignatureRecord/:id").put(updateSignatureRecordStatus);
router.route("/getActiveDirectorSignatureRecord").get(getActiveDirectorSignatureRecord);
router.route("/getActiveAssistantDirectorSignatureRecord").get(getActiveAssistantDirectorSignatureRecord);
module.exports = router;
