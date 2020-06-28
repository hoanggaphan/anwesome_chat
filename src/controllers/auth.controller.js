import { validationResult } from "express-validator";

const getLoginRegister = (req, res) => {
  res.render("auth/master");
};

const postRegister = (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped()).map(
      (item) => item.msg
    );
    console.log(errors);
    return;
  }

  console.log(req.body);
};

module.exports = {
  getLoginRegister,
  postRegister,
};
