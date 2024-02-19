const express = require("express");
const connectDB = require("./config/dbConnect");
const pingRoute = require("./routes/ping");
const userRoute = require("./routes/user");
const storyRoute = require("./routes/story");

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(express.json());

app.use("/user", userRoute);
app.use("/story", storyRoute);
app.use("/ping", pingRoute);

// Middleware for handling 404 errors
app.use((req, res, next) => {
  res.status(404).send("404 - Not Found");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("500 - Internal Server Error");
});

const server = app.listen(port, () => {
  console.log(`🚀 server running on PORT: ${port}`);
});

module.exports = server;
