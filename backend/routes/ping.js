const express = require("express"); // Importing express library
const router = express.Router(); // Creating a router object

// Defining a route for handling GET requests to '/ping'
router.get("/ping", (req, res) => {
  res.send("<h1>pong</h1>"); // Sending "pong" as a response
});

module.exports = router; // Exporting the router for external use
