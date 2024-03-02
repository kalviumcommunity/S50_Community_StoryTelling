require("dotenv").config();
const express = require("express"); // Importing express library
const { validationResult } = require("express-validator"); // Importing validationResult function from express-validator
const { body, param } = require("express-validator"); // Importing body and param functions from express-validator
const router = express.Router(); // Creating a router object
const mongoose = require("mongoose"); // Importing mongoose library for MongoDB interactions
const Story = require("../models/Story"); // Importing the Story model
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Validation middleware for story ID
const validateStoryId = [
  param("id").isMongoId().withMessage("Invalid story ID"), // Checking if story ID is a valid MongoDB ObjectId
];

// Validation middleware for story data
const validateStoryData = [
  body("title").notEmpty().withMessage("Title is required"), // Checking if title is provided
  body("paragraphs").isArray().withMessage("Paragraphs must be an array"), // Checking if paragraphs is an array
];

// GET route to fetch all stories
router.get("/", async (req, res) => {
  try {
    const stories = await Story.find(); // Fetching all stories from the database
    res.json(stories); // Sending the fetched stories as JSON response
  } catch (err) {
    console.error("Error fetching stories:", err); // Logging error if fetching stories fails
    res.status(500).json({ error: "Internal Server Error" }); // Sending internal server error response
  }
});

// GET route to fetch a specific story by ID
router.get("/:id", validateStoryId, async (req, res) => {
  const errors = validationResult(req); // Getting validation errors, if any
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Sending bad request response if validation fails
  }

  try {
    const { id } = req.params; // Extracting story ID from request parameters
    const story = await Story.findById(id); // Finding the story by ID
    if (!story) {
      return res
        .status(404)
        .json({ error: "Story not found with provided ID" }); // Sending not found response if story not found
    }
    res.json(story); // Sending the fetched story as JSON response
  } catch (err) {
    console.error("Error fetching story:", err); // Logging error if fetching story fails
    res.status(500).json({ error: "Internal Server Error" }); // Sending internal server error response
  }
});

// POST route to add a new story
router.post("/", validateStoryData, async (req, res) => {
  const errors = validationResult(req); // Getting validation errors, if any
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Sending bad request response if validation fails
  }

  try {
    const { token } = req.body;
    // console.log(req.body);
    // const token = req.headers; // Extracting the token from the Authorization header
    // console.log("Token:", token); // Logging the token
    // console.log();
    // const { token } = req.body;
    const payload = jwt.verify(token, SECRET_KEY);

    // console.log("payload", payload);
    const username = payload.username;

    const email = payload.email;
    // console.log("email",email)
    // console.log("name",username);
    const user = await User.find({ username }); // Finding the user based on the username
    if (!user) {
      return res.status(401).json({ error: "User not found" }); // Sending not found response if user not found
    }
    // console.log("user",user);
    req.body.paragraphs[0].author = user[0].username;
    // console.log(req.body.paragraphs[0].author);
    // console.log(user[0]._id)
    // console.log(req.body);
    // console.log(req.body)
    const newStory = new Story(req.body); // Creating a new story instance
    const savedStory = await newStory.save(); // Saving the new story to the database
    res.status(201).json({ ...savedStory.toJSON(), author: user[0].username, email: email });

    // console.log(res.json())
    // Sending created response with the saved story
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      console.error("Validation Error:", err.message); // Logging validation error message
      return res.status(400).json({ error: err.message }); // Sending bad request response with validation error message
    }
    console.error("Error adding story:", err); // Logging error if adding story fails
    res.status(500).json({ error: "Internal Server Error" }); // Sending internal server error response
  }
});

// PUT route to update a story
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extracting story ID from request parameters
    let updatedStory = await Story.findOne({ _id: id }); // Finding the story by ID

    if (!updatedStory) {
      return res
        .status(404)
        .json({ error: "Story not found with provided ID" }); // Sending not found response if story not found
    }

    updatedStory.paragraphs[0].content += req.body.content; // Appending content to the first paragraph's content

    await updatedStory.save(); // Saving the updated story
    res.json(updatedStory); // Sending the updated story as JSON response
  } catch (err) {
    console.error("Error updating story:", err); // Logging error if updating story fails
    res.status(500).json({ error: "Internal Server Error" }); // Sending internal server error response
  }
});

// PATCH route to partially update a story
router.patch("/:id", validateStoryId, validateStoryData, async (req, res) => {
  const errors = validationResult(req); // Getting validation errors, if any
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Sending bad request response if validation fails
  }

  try {
    const { id } = req.params; // Extracting story ID from request parameters
    const updatedStory = await Story.findByIdAndUpdate(id, req.body, {
      new: true,
    }); // Finding and updating the story by ID
    if (!updatedStory) {
      return res
        .status(404)
        .json({ error: "Story not found with provided ID" }); // Sending not found response if story not found
    }
    res.json(updatedStory); // Sending the updated story as JSON response
  } catch (err) {
    console.error("Error updating story:", err); // Logging error if updating story fails
    res.status(500).json({ error: "Internal Server Error" }); // Sending internal server error response
  }
});

// DELETE route to delete a story
router.delete("/:id", validateStoryId, async (req, res) => {
  const errors = validationResult(req); // Getting validation errors, if any
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Sending bad request response if validation fails
  }

  try {
    const { id } = req.params; // Extracting story ID from request parameters
    const userId = req.user.id; // Assuming you have user information in req.user

    const story = await Story.findById(id); // Finding the story by ID
    if (!story) {
      return res.status(404).json({ error: "Story not found with provided ID" }); // Sending not found response if story not found
    }

    // Check if the authenticated user is the owner of the story
    if (story.userId !== userId) {
      return res.status(403).json({ error: "You are not authorized to delete this story" }); // Sending forbidden response if user is not authorized
    }

    const deletedStory = await Story.findByIdAndDelete(id); // Finding and deleting the story by ID
    if (!deletedStory) {
      return res.status(404).json({ error: "Story not found with provided ID" }); // Sending not found response if story not found
    }
    res.json({ message: "Story deleted successfully" }); // Sending success message as JSON response
  } catch (err) {
    console.error("Error deleting story:", err); // Logging error if deleting story fails
    res.status(500).json({ error: "Internal Server Error" }); // Sending internal server error response
  }
});


module.exports = router; // Exporting the router for external use
