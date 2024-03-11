const mongoose = require("mongoose");
// const User = require("./User");

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  paragraphs: [
    {
      content: {
        type: String,
        required: true,
      },
      author: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
