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

exports.sendMessage = catchAsyncErrors(async (title,message) => {
  console.log("function called");
  try {
    // Fetch tokens from MongoDB based on userId
    const tokens = await Token.find().distinct("token");
    // Send FCM message
    await admin.messaging().sendMulticast({
      tokens,
      data: {
        notifee: JSON.stringify({
          title: "Muneeb Ur Rehman",
          body: "Request created successfully.",
          android: {
            channelId: "default",
            pressAction: {
              id: 'default',
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
