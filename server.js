const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;

app.get("/ping", (req, res) => {
  res.send("<h1>pong</h1>");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const server = app.listen(port, () => {
  console.log(`🚀 server running on PORT: ${port}`);
});

module.exports = server;
