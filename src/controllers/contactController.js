import { contact } from "../services/index";
import { validationResult } from "express-validator";

const findUsersContact = async (req, res) => {
  let errorArr = [];

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped()).map(
      (item) => item.msg
    );
    errorArr = [...errorArr, ...errors];
    // console.error(errorArr);
    return res.status(500).send(errorArr);
  }

  try {
    const currentUserId = req.user._id;
    const keyword = req.params.keyword;

    const users = await contact.findUsersContact(currentUserId, keyword);
    return res.render("main/contact/sections/_findUsersContact", { users });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  findUsersContact,
};
