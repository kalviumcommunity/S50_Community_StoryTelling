const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  paragraphs: [{
    userID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    content: {
      type: String,
      required: true
    },
    author: {
      userId: {
        type: String,
        required: true
      },
      anonymous: {
        type: Boolean,
        default: false
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
