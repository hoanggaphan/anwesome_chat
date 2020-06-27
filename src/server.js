import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";

// Init app
const app = express();

// Connect to MongoDB
connectDB();

// Config view engine
configViewEngine(app);

app.get("/", (req, res) => {
  res.render("main/master");
});

app.get("/login-register", (req, res) => {
  res.render("auth/loginRegister");
});

app.listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
  console.log(
    `App listening at ${process.env.APP_HOSTNAME}:${process.env.APP_PORT}`
  );
});
