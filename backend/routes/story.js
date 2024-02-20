const express = require("express");
const { validationResult } = require("express-validator");
const { body, param } = require("express-validator");
const router = express.Router();
const mongoose = require("mongoose");
const Story = require("../models/Story");

// Validation middleware for story ID
const validateStoryId = [
  param("id").isMongoId().withMessage("Invalid story ID"),
];

// function validateStoryId(req, res, next){

//   Story.findById(req.params.id)
//   .then((resp)=>{
//     if(resp.length == 0){
//       res.status(404).send("not found");
//     } else{
//       req.story = resp;
//       next();
//     }
//   })
// }

// Validation middleware for story data
const validateStoryData = [
  body("title").notEmpty().withMessage("Title is required"),
  body("paragraphs").isArray().withMessage("Paragraphs must be an array"),
];



// GET route to fetch all stories
router.get("/", async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (err) {
    console.error("Error fetching stories:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET route to fetch a specific story by ID
router.get("/:id", validateStoryId, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ error: "Story not found with provided ID" });
    }
    res.json(story);
  } catch (err) {
    console.error("Error fetching story:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST route to add a new story
router.post("/", validateStoryData, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newStory = new Story(req.body);
    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      console.error("Validation Error:", err.message);
      return res.status(400).json({ error: err.message });
    }
    console.error("Error adding story:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Find the story by ID
    let updatedStory = await Story.findOne({ _id: id });

    // Check if the story exists
    if (!updatedStory) {
      return res.status(404).json({ error: "Story not found with provided ID" });
    }

    // Append the new content to the first paragraph's content
    updatedStory.paragraphs[0].content += req.body.content;

    // Save the updated story
    await updatedStory.save();

    // Respond with the updated story
    res.json(updatedStory);
  } catch (err) {
    console.error("Error updating story:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// PATCH route to partially update a story
router.patch("/:id", validateStoryId, validateStoryData, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const updatedStory = await Story.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedStory) {
      return res.status(404).json({ error: "Story not found with provided ID" });
    }
    res.json(updatedStory);
  } catch (err) {
    console.error("Error updating story:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE route to delete a story
router.delete("/:id", validateStoryId, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const deletedStory = await Story.findByIdAndDelete(id);
    if (!deletedStory) {
      return res.status(404).json({ error: "Story not found with provided ID" });
    }
    res.json({ message: "Story deleted successfully" });
  } catch (err) {
    console.error("Error deleting story:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
