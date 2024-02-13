const express = require("express");
const connectDB = require("./config/dbConnect");
const pingRoute = require("./routes/ping");
const homeRoute = require("./routes/home");

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(express.json());

app.use("/", homeRoute);
app.use("/ping", pingRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("500-Internal Server Error");
});

const server = app.listen(port, () => {
  console.log(`🚀 server running on PORT: ${port}`);
});

module.exports = server;
