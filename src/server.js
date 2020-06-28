import express from "express";
import bodyParser from 'body-parser'

import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from './routes/web';

// Init app
const app = express();

// Connect to MongoDB
connectDB();

// Config view engine
configViewEngine(app);

app.use(bodyParser.urlencoded({ extended: false }))

// Init all routes
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
  console.log(
    `App listening at http://${process.env.APP_HOSTNAME}:${process.env.APP_PORT}`
  );
});
