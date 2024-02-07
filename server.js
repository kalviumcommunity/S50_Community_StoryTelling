const express = require("express");
const app = express();
const port = 3000;

app.get("/ping", (req, res) => {
  res.send("<h1>pong</h1>");
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 server running on PORT: ${port}`);
  });
}

module.exports = app;
