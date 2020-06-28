import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import configSession from './config/session'
import initRoutes from "./routes/web";
import connectFlash from 'connect-flash';

// Init app
const app = express();

// Connect to MongoDB
connectDB();

// Config session
configSession(app);

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(express.urlencoded({ extended: true }));

// Enable flash messages
app.use(connectFlash());

// Init all routes
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
  console.log(
    `App listening at http://${process.env.APP_HOSTNAME}:${process.env.APP_PORT}`
  );
});
