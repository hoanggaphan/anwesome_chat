import express from 'express';
import { auth, home } from '../controllers/index';
import { authValid } from '../validation/index';

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
  return app.use("/", router);
}

module.exports = initRoutes;
