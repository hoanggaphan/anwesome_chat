import { validationResult } from "express-validator";
import { auth } from "../services/index";
import { transSuccess } from '../../lang/vi';

const getLoginRegister = (req, res) => {
  res.render("auth/master", {
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};

const getVerifyAccount = async (req, res) => {
  let errorArr = [];
  let successArr = [];

  try {
    const verifySuccess = await auth.verifyAccount(req.params.token);
    successArr.push(verifySuccess);
    req.flash("success", successArr);
    res.redirect("/login-register");
  } catch (error) {
    errorArr.push(error);
    req.flash("errors", errorArr);
    res.redirect("/login-register");
  }
}

const getLogout = (req, res) => {
  req.logout(); // remove session passport user
  req.flash("success", transSuccess.logout_success);
  res.redirect("/login-register");
}

const checkLoggedOut = (req, res, next) => {
  if(req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

const checkLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    return res.redirect("/login-register");
  }
  next();
}

const postRegister = async (req, res) => {
  let errorArr = [];
  let successArr = [];

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped()).map(
      (item) => item.msg
    );
    errorArr = [...errorArr, ...errors];
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }

  try {
    const createUserSuccess = await auth.register(
      req.body.email,
      req.body.gender,
      req.body.password,
      req.protocol,
      req.get("host")
    );
    req.flash("success", [...successArr, createUserSuccess]);
    res.redirect("/login-register");
  } catch (error) {
    errorArr = [...errorArr, error];
    req.flash("errors", errorArr);
    res.redirect("/login-register");
  }
};

module.exports = {
  getLoginRegister,
  getVerifyAccount,
  postRegister,
  getLogout,
  checkLoggedIn,
  checkLoggedOut
};
