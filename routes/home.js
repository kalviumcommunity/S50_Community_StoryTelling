const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET route to fetch all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST route to add a new user
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      console.error("Validation Error:", err.message);
      return res.status(400).json({ error: err.message });
    }
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
