const express = require("express"); // Importing express library
const connectDB = require("./config/dbConnect"); // Importing the function to connect to MongoDB
const pingRoute = require("./routes/ping"); // Importing the ping route
const userRoute = require("./routes/user"); // Importing the user route
const storyRoute = require("./routes/story"); // Importing the story route
const cors = require("cors"); // Importing cors middleware

const app = express(); // Creating an instance of express
const port = process.env.PORT || 3000; // Setting the port to the environment variable PORT or defaulting to 3000

// Connect to MongoDB
connectDB(); // Connecting to MongoDB

app.use(express.json()); // Parsing JSON requests

app.use(cors()); // Enabling CORS

app.use("/user", userRoute); // Using the user route for requests starting with /user
app.use("/story", storyRoute); // Using the story route for requests starting with /story
app.use("/ping", pingRoute); // Using the ping route for requests starting with /ping

// Middleware for handling 404 errors
app.use((req, res, next) => {
  res.status(404).send("404 - Not Found"); // Sending 404 response for requests not matching any route
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Logging the error stack trace
  res.status(500).send("500 - Internal Server Error"); // Sending 500 response for internal server errors
});

const server = app.listen(port, () => {
  console.log(`🚀 server running on PORT: ${port}`); // Logging that the server is running on the specified port
});

module.exports = server; // Exporting the server for testing purposes
