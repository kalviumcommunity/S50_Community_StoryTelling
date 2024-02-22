const mongoose = require("mongoose"); // Importing mongoose library for MongoDB interactions
require("dotenv").config(); // Loading environment variables from .env file
const retry = require('async-retry'); // Importing async-retry library for retrying connection attempts

const connectDB = async () => { // Defining an asynchronous function to connect to MongoDB
  try {
    if (!process.env.MONGODB_URI) { // Checking if MongoDB URI is defined in environment variables
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    console.log("Connecting to MongoDB"); // Logging connection attempt to MongoDB
    
    // Retrying connection to MongoDB with exponential backoff strategy
    await retry(async (bail, attempt) => {
      console.log(`Connecting attempt ${attempt} to MongoDB...`); // Logging connection attempt number
      await mongoose.connect(process.env.MONGODB_URI); // Attempting to connect to MongoDB
    }, {
      retries: 5, // Setting maximum number of retry attempts
      minTimeout: 1000, // Setting minimum timeout between retries (in milliseconds)
      maxTimeout: 5000, // Setting maximum timeout between retries (in milliseconds)
      onRetry: (err, attempt) => { // Executing this function on each retry attempt
        console.log(`Retry attempt ${attempt} failed: ${err}`); // Logging failed retry attempt
      }
    });

    console.log("Connected to MongoDB"); // Logging successful connection to MongoDB
  } catch (error) {
    console.error("Error connecting to MongoDB:", error); // Logging error if connection fails
    process.exit(1); // Exiting process with failure status code
  }
};

module.exports = connectDB; // Exporting the connectDB function for external use
