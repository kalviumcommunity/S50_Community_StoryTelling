const mongoose = require("mongoose");
require("dotenv").config();
const retry = require('async-retry');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    console.log("Connecting to MongoDB");
    
    // Retry connecting to MongoDB with async-retry
    await retry(async (bail, attempt) => {
      console.log(`Connecting attempt ${attempt} to MongoDB...`);
      await mongoose.connect(process.env.MONGO_URI);
    }, {
      retries: 5, // Number of retry attempts
      minTimeout: 1000, // Minimum timeout in milliseconds between retries
      maxTimeout: 5000, // Maximum timeout in milliseconds between retries
      onRetry: (err, attempt) => {
        console.log(`Retry attempt ${attempt} failed: ${err}`);
      }
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
