const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;

app.get("/ping", (req, res, ErrorHandle) => {
  try {
    res.send("<h1>pong</h1>");
  } catch (error) {
    ErrorHandle(error);
  }
});

const server = app.listen(port, () => {
  console.log(`🚀 server running on PORT: ${port}`);
});

module.exports = server;
