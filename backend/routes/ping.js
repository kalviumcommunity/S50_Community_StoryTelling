const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
  res.send("<h1>pong</h1>");
});

module.exports = router;
