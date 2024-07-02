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
    const newToken = await Token.create({
      user_id,
      token,
    });

    console.log(newToken);
  } catch (error) {}
});
//////////////////////////////////////////////////////////////////////////////////////////////////

exports.sendMessage = catchAsyncErrors(async (user_id, title, message) => {
  console.log(user_id, title, message);
  try {
    // Fetch tokens from MongoDB based on user_id
    const tokens = await Token.find({ user_id: user_id }).distinct("token");
    console.log(tokens);

    if (tokens.length > 0) {
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
    } else {
      console.log("No tokens found for the given user_id");
    }
  } catch (error) {
    console.log(error);
  }
});
