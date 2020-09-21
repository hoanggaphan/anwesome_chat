import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import UserModel from "../models/userModel";
import { transError, transSuccess, transMail } from "../../lang/vi";
import sendMail from "../config/mailer";

const saltRounds = 10;

const register = (email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {
    const userByEmail = await UserModel.findByEmail(email);
    if (userByEmail) {
      if (userByEmail.deletedAt) {
        return reject(transError.account_removed);
      }
      if (!userByEmail.local.isActived) {
        return reject(transError.account_not_active);
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

    const user = await UserModel.createNew(userItem);
    // send email
    const linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
    sendMail(email, transMail.subject, transMail.template(linkVerify))
      .then((success) => {
        resolve(transSuccess.userCreated(user.local.email));
      })
      .catch(async (error) => {
        console.log(error);
        //remove user when send email fail
        await UserModel.deleteById(user._id);
        reject(transMail.send_failed);
      });
  });
};

const verifyAccount = (token) => {
  return new Promise(async (resolve, reject) => {
    const userByToken = await UserModel.findByToken(token);
    if(!userByToken) {
      return reject(transError.token_undefined);
    }

    await UserModel.verify(token);
    resolve(transSuccess.account_actived);
  });
};

export {
  register,
  verifyAccount,
};
