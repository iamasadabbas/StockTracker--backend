// db.js

const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected to DB");
    return db;
  } catch (error) {
    console.error(`Error connecting to DB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
