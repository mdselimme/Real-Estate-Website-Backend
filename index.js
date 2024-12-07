const express = require("express");

const app = express();

const cors = require("cors");

const port = process.env.PORT || 2000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server port is ${port}`);
});
