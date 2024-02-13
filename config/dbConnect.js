
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB =  async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    console.log("Connecting to MongoDB: [HIDDEN]");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};


module.exports = connectDB;
