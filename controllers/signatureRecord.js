const signatureRecord = require('../models/signatureRecord/demandProductModel')
const catchAsyncErrors = require("../middlewares/catchAsyncError");

exports.AddSignatureRecord = catchAsyncErrors(async (req, res, next) => {
    let {
        name,
        designation
    } = req.body;
    try {
        const data = await signatureRecord.create({
            name,
            designation
        });
        if (data) {

            res.send({
                status: 200,
                message: "Successfully created",
            });
        }
        // user,
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
            const duplicateField = Object.keys(error.keyPattern)[0];
            return res.status(409).json({
                status: 409,
                message: `Duplicate ${duplicateField}: ${error.keyValue[duplicateField]}`,
            });
        } else {
            // Other errors
            console.error("Error registering user:", error);
            res.status(500).json({ status: 500, error: "Internal server error" });
        }
    }
});
exports.getSignatureRecord = catchAsyncErrors(async (req, res, next) => {
    try {
        const data = await signatureRecord.find()
        if (data) {

            res.send({
                status: 200,
                data,
            });
        }
        // user,
    } catch (error) {
        res.send({
            status: 500,
            error:"internal server error"
        })
    }
});
exports.getActiveDirectorSignatureRecord = catchAsyncErrors(async (req, res, next) => {
    try {
        const data = await signatureRecord.find({status:true,designation: "Director" })
        if (data) {

            res.send({
                status: 200,
                data,
            });
        }
        // user,
    } catch (error) {
        res.send({
            status: 500,
            error:"internal server error"
        })
    }
});
exports.getActiveAssistantDirectorSignatureRecord = catchAsyncErrors(async (req, res, next) => {
    try {
        const data = await signatureRecord.find({status:true,designation: "Assistant Director" })
        if (data) {

            res.send({
                status: 200,
                data,
            });
        }
        // user,
    } catch (error) {
        res.send({
            status: 500,
            error:"internal server error"
        })
    }
});
exports.updateSignatureRecordStatus = catchAsyncErrors(async (req, res, next) => {
    try {
        const { updatedRecords } = req.body;

        // Validate that updatedRecords is an array
        if (!Array.isArray(updatedRecords)) {
            return res.status(400).send({
                status: 400,
                error: "Invalid data format"
            });
        }

        // Update each record in the database
        for (const record of updatedRecords) {
            await signatureRecord.findByIdAndUpdate(
                record._id,
                { status: record.status },
                { new: true, runValidators: true }
            );
        }

        // Fetch all records after the update
        const result = await signatureRecord.find();

        res.status(200).send({
            status: 200,
            result
        });

    } catch (error) {
        res.status(500).send({
            status: 500,
            error: "Internal server error"
        });
    }
});