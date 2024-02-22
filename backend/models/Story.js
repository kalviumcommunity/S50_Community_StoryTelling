const mongoose = require("mongoose"); // Importing mongoose library for MongoDB interactions

// Defining the schema for the 'stories' collection in MongoDB
const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // Title is a required field
  },
  paragraphs: [{
    userID: {
      type: mongoose.Schema.Types.ObjectId, // User ID referencing the 'User' collection
      ref: 'User' // Referencing the 'User' model
    },
    content: {
      type: String,
      required: true // Content of the paragraph is required
    },
    author: {
      userId: {
        type: mongoose.Schema.Types.ObjectId, // Author's user ID
      },
      anonymous: {
        type: Boolean,
        default: false // By default, author is not anonymous
      }
    },
    createdAt: {
      type: Date,
      default: Date.now // Default creation timestamp
    },
    updatedAt: {
      type: Date,
      default: Date.now // Default update timestamp
    }
  }]
});

const Story = mongoose.model('Story', storySchema); // Creating a model named 'Story' from the storySchema

module.exports = Story; // Exporting the Story model for external use
