const Token = require("../models/Notification/deviceTokenModel");
const catchAsyncErrors = require("../middlewares/catchAsyncError");
const admin = require("firebase-admin");
const serviceAccount = require("../Config/serviceAccountKey.json");
// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// add task
////////////////////////////////////////////////////////////////////////////////////////////////
exports.saveToken = catchAsyncErrors(async (req, res, next) => {
  const { user_id, token } = req.body;
  console.log(req.body);

  try {
    // Use findOneAndUpdate with upsert option
    const newToken = await Token.findOneAndUpdate(
      { user_id: user_id }, // Filter condition
      { token: token }, // Update data
      { new: true, upsert: true, setDefaultsOnInsert: true } // Options
    );

    console.log(newToken);

    // Respond with the new or updated token
    res.status(200).json({
      success: true,
      data: newToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while saving the token.",
      error: error.message,
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////

exports.sendMessage = catchAsyncErrors(async (user_id, title, message) => {
  console.log(user_id, title, message);
  try {
    // Fetch tokens from MongoDB based on userId
    const tokens = await Token.find({ user_id: user_id }).distinct("token");
    console.log(tokens);
    // Send FCM message
    await admin.messaging().sendMulticast({
      tokens,
      data: {
        notifee: JSON.stringify({
          title: title,
          body: message,
          android: {
            channelId: "default",
            pressAction: {
              id: "default",
            },
            // Add more Notifee notification options as needed
          },
        }),
      },
    });
  } catch (error) {
    console.log(error);
  }
});
