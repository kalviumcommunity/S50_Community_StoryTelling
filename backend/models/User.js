const mongoose = require("mongoose"); // Importing mongoose library for MongoDB interactions

// Defining the schema for the 'users' collection in MongoDB
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is a required field
  },
  email: {
    type: String,
    required: true, // Email is a required field
    unique: true, // Email must be unique
  },
  googleId: {
    type: String,
    immutable: true, // Google ID should not be modified once set
  },
  anonymousHandle: String, // Handle for anonymous users
  createdAt: {
    type: Date,
    default: Date.now, // Default creation timestamp
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Default update timestamp
  },
});

const User = mongoose.model("User", userSchema); // Creating a model named 'User' from the userSchema

module.exports = User; // Exporting the User model for external use
