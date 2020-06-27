import express from 'express';
import { home, auth } from './../controllers/index';

const router = express.Router();

/**
 * Init all routes
 * @params app from exactly express
 */
const initRoutes = (app) => {
  router.get("/", home.getHome);
  
  router.get("/login-register", auth.getLoginRegister);

  return app.use("/", router);
}

module.exports = initRoutes;
