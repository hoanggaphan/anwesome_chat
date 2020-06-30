import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import configSession from "./config/session";
import initRoutes from "./routes/web";
import connectFlash from "connect-flash";
import passport from "passport";
import https from "https";
import pem from "pem";

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
  if (err) {
    throw err;
  }
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

  // Config passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Init all routes
  initRoutes(app);

  https
    .createServer({ key: keys.serviceKey, cert: keys.certificate }, app)
    .listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
      console.log(
        `App listening at https://${process.env.APP_HOSTNAME}:${process.env.APP_PORT}`
      );
    });
});

// // Init app
// const app = express();

// // Connect to MongoDB
// connectDB();

// // Config session
// configSession(app);

// // Config view engine
// configViewEngine(app);

// // Enable post data for request
// app.use(express.urlencoded({ extended: true }));

// // Enable flash messages
// app.use(connectFlash());

// // Config passport
// app.use(passport.initialize());
// app.use(passport.session());

// // Init all routes
// initRoutes(app);

// app.listen(process.env.APP_PORT, process.env.APP_HOSTNAME, () => {
//   console.log(
//     `App listening at http://${process.env.APP_HOSTNAME}:${process.env.APP_PORT}`
//   );
// });
