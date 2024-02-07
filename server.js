const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;

app.get("/ping", (req, res) => {
  console.log("kk", port);
  res.send("<h1>pong</h1>");
});

app.listen(port, () => {
  console.log(`🚀 server running on PORT: ${port}`);
});

module.exports = app;
