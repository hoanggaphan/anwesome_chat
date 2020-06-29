import express from 'express';
import { auth, home } from '../controllers/index';
import { authValid } from '../validation/index';
import passport from 'passport';
import { initPassportLocal } from '../controllers/passportController/local';

// Init all passport
initPassportLocal();

const router = express.Router();

/**
 * Init all routes
 * @params app from exactly express
 */
const initRoutes = (app) => {
  router.get("/", home.getHome);
  router.get("/login-register", auth.getLoginRegister);
  router.get("/verify/:token", auth.getVerifyAccount);

  router.post("/register", authValid.register , auth.postRegister)
  router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    failureFlash: true,
    successFlash: true
  }));

  return app.use("/", router);
}

module.exports = initRoutes;
