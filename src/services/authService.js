import userModel from "../models/user.model";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { transError, transSuccess } from "../../lang/vi";

const saltRounds = 10;

const register = (email, gender, password) => {
  return new Promise(async (resolve, reject) => {
    const userByEmail = await userModel.findByEmail(email);
    if (userByEmail) {
      if(userByEmail.deletedAt) {
        return reject(transError.account_removed);
      }
      if(!userByEmail.local.isActived) {
        return reject(transError.account_not_active)
      }
      return reject(transError.account_in_use);
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const userItem = {
      username: email.split("@")[0],
      gender,
      local: {
        email,
        password: hashedPassword,
        verifyToken: uuidv4(),
      },
    };

    const user = await userModel.createNew(userItem);
    return resolve(transSuccess.userCreated(user.local.email));
  });
};

module.exports = {
  register,
};
