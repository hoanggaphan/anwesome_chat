const express = require("express");
const app = express();

const host = "localhost"
const port = 8017;

app.get("/", (req, res) => 
  res.send("<h1>Hello World!</h1>"))

app.listen(port, host, () => 
    console.log(`App listening at http://localhost:${localhost}`)
)
