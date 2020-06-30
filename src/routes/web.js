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
  router.get("/", auth.checkLoggedIn,  home.getHome);
  router.get("/logout", auth.checkLoggedIn, auth.getLogout);
  
  router.get("/login-register", auth.checkLoggedOut, auth.getLoginRegister);
  router.get("/verify/:token", auth.checkLoggedOut, auth.getVerifyAccount);
  router.post("/register",auth.checkLoggedOut, authValid.register , auth.postRegister)
  router.post("/login", auth.checkLoggedOut, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    failureFlash: true,
    successFlash: true
  }));

  return app.use("/", router);
}

module.exports = initRoutes;
