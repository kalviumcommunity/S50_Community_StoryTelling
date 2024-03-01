const express = require("express"); // Importing express library
const { validationResult } = require("express-validator"); // Importing validationResult function from express-validator
const { body, param } = require("express-validator"); // Importing body and param functions from express-validator
const router = express.Router(); // Creating a router object
const User = require("../models/User"); // Importing the User model
const mongoose = require("mongoose"); // Importing mongoose library for MongoDB interactions
const bcrypt = require("bcrypt"); //Importing BCrypt for Password Hashing
// const verifyToken = require("../middleware/verifyJWT");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");

// Validation middleware for user ID
const validateUserId = [
  param("id").isMongoId().withMessage("Invalid user ID"), // Checking if user ID is a valid MongoDB ObjectId
];

// Validation middleware for user data
const validateUserData = [
  body("username").notEmpty().withMessage("Name is required"), // Checking if name is provided
  // body("email").isEmail().withMessage("Invalid email address"), // Checking if email is a valid email address
  body("password").notEmpty().withMessage("Password is required"), // Checking if password is provided and not empty
  // body("googleId").optional().isString().withMessage("Invalid googleId"), // Checking if googleId is a string (if provided)
  // Add additional validation rules for other fields as needed
];

// testing jwt verification
// router.get("/protected", verifyToken, (req, res) => {
//   res.json({ message: "This is a protected route" });
// });

// router.get("/cookie", (req, res) => {
//   const token = jwt.sign({ username: "testuser" }, SECRET_KEY, {
//     expiresIn: "1h",
//   });
//   res
//     .cookie("username", token, { httpOnly: true, maxAge: 72000 })
//     .json({ message: "Cookie set successfully" });
// });

// GET route to fetch all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Fetching all users from the database
    res.json(users); // Sending the fetched users as JSON response
  } catch (err) {
    console.error("Error fetching users:", err); // Logging error if fetching users fails
    res.status(500).json({ error: "Internal Server Error" }); // Sending internal server error response
  }
});

// GET route to fetch a specific user by ID
router.get("/:id", validateUserId, async (req, res) => {
  const errors = validationResult(req); // Getting validation errors, if any
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Sending bad request response if validation fails
  }

  try {
    const { id } = req.params; // Extracting user ID from request parameters
    const user = await User.findById(id); // Finding the user by ID
    if (!user) {
      return res.status(404).json({ error: "User not found with provided ID" }); // Sending not found response if user not found
    }
    res.json(user); // Sending the fetched user as JSON response
  } catch (err) {
    console.error("Error fetching user:", err); // Logging error if fetching user fails
    res.status(500).json({ error: "Internal Server Error" }); // Sending internal server error response
  }
});

// POST route to add a new user
router.post("/", validateUserData, async (req, res) => {
  const errors = validationResult(req); // Getting validation errors, if any
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Sending bad request response if validation fails
  }

  try {
    const { username, email, password } = req.body; // Extracting username, email, and password from request body
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
    const newUser = new User({ username, email, password: hashedPassword }); // Creating a new user instance with hashed password
    console.log(newUser);
    const savedUser = await newUser.save(); // Saving the new user to the database
    res.status(201).json(savedUser); // Sending created response with the saved user
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      console.error("Validation Error:", err.message); // Logging validation error message
      return res.status(400).json({ error: err.message }); // Sending bad request response with validation error message
    }
    console.error("Error adding user:", err); // Logging error if adding user fails
    res.status(500).json({ error: "Internal Server Error" }); // Sending internal server error response
  }
});
router.post("/login", validateUserData, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // If username and password are valid, generate JWT
    const token = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });
    // console.log(token)

    // Set the JWT as a secure and HTTP only cookie in the response
    res.cookie("username", token, { 
      httpOnly: true, 
      secure: true, // set to true if your application is served over HTTPS
      maxAge: 3600000,
      sameSite: 'Lax' // set to 'Strict' or 'Lax' based on your requirements
    }); 
    
    // Send the token in the response body
    res.json({ message: "Login successful", user, token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// PUT route to update a user
router.put("/:id", validateUserId, validateUserData, async (req, res) => {
  const errors = validationResult(req); // Getting validation errors, if any
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Sending bad request response if validation fails
  }

  try {
    const { id } = req.params; // Extracting user ID from request parameters
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }); // Finding and updating the user by ID
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found with provided ID" }); // Sending not found response if user not found
    }
    res.json(updatedUser); // Sending the updated user as JSON response
  } catch (err) {
    console.error("Error updating user:", err); // Logging error if updating user fails
    res.status(500).json({ error: "Internal Server Error" }); // Sending internal server error response
  }
});

// PATCH route to partially update a user
router.patch("/:id", validateUserId, validateUserData, async (req, res) => {
  const errors = validationResult(req); // Getting validation errors, if any
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Sending bad request response if validation fails
  }

  try {
    const { id } = req.params; // Extracting user ID from request parameters
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }); // Finding and updating the user by ID
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found with provided ID" }); // Sending not found response if user not found
    }
    res.json(updatedUser); // Sending the updated user as JSON response
  } catch (err) {
    console.error("Error updating user:", err); // Logging error if updating user fails
    res.status(500).json({ error: "Internal Server Error" }); // Sending internal server error response
  }
});

// DELETE route to delete a user
router.delete("/:id", validateUserId, async (req, res) => {
  const errors = validationResult(req); // Getting validation errors, if any
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Sending bad request response if validation fails
  }

  try {
    const { id } = req.params; // Extracting user ID from request parameters
    const deletedUser = await User.findByIdAndDelete(id); // Finding and deleting the user by ID
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found with provided ID" }); // Sending not found response if user not found
    }
    res.json({ message: "User deleted successfully" }); // Sending success message as JSON response
  } catch (err) {
    console.error("Error deleting user:", err); // Logging error if deleting user fails
    res.status(500).json({ error: "Internal Server Error" }); // Sending internal server error response
  }
});

module.exports = router; // Exporting the router for external use
