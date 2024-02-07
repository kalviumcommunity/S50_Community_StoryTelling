const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;

app.get("/ping", (req, res, next) => {
  try {
    res.send("<h1>pong</h1>");
  } catch (error) {
    next(error);
  }
});

const server = app.listen(port, () => {
  console.log(`🚀 server running on PORT: ${port}`);
});

module.exports = server;
