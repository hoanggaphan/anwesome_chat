import passport from "passport";
import passportLocal from "passport-local";
import UserModel from '../../models/userModel';
import { transError, transSuccess } from '../../../lang/vi';

const LocalStrategy = passportLocal.Strategy;

/**
 * Valid user account type: local
 */
const initPassportLocal = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const user = await UserModel.findByEmail(email);
          if(!user) { // check email
            return done(null, false, req.flash("errors", transError.login_failed));
          }
          if(!user.local.isActived) { //check actived
            return done(null, false, req.flash("errors", transError.account_not_active));
          }

          const checkPassword = await user.comparePassword(password);
          if(!checkPassword) { // check password
            return done(null, false, req.flash("errors", transError.login_failed));
          }

          done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
        } catch (error) {
          console.error(error);
          done(null, false, req.flash("errors", transError.server_error));
        }
      }
    )
  );

  // Save userId to session
  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser((id, done) => {
    UserModel.findUserById(id)
      .then(user => done(null, user))
      .catch (error => done(error, null)) 
  });
};

module.exports = initPassportLocal;
