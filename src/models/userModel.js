import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: Number, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  role: { type: String, default: "user" },
  local: {
    email: { type: String, trim: true },
    password: String,
    isActived: { type: Boolean, default: false },
    verifyToken: String,
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true },
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true },
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

UserSchema.statics = {
  createNew(item) {
    return this.create(item); // return promise
  },

  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },

  findByToken(token) {
    return this.findOne({ "local.verifyToken": token }).exec();
  },

  findUserById(id) {
    return this.findById(id).exec();
  },

  findByFacebookId(uid) {
    return this.findOne({ "facebook.uid": uid }).exec();
  },

  findByGoogleId(uid) {
    return this.findOne({ "google.uid": uid }).exec();
  },

  deleteById(id) {
    return this.findByIdAndDelete({ _id: id }).exec();
  },
  
  verify(token) {
    return this.findOneAndUpdate(
      { "local.verifyToken": token },
      { "local.isActived": true, "local.verifyToken": null }
    ).exec();
  },

  updateUser(id, item) {
    return this.findByIdAndUpdate(id, item).exec(); // return old data after update
  }
};

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password) // return a promise has result is true or false
  }
}

module.exports = mongoose.model("user", UserSchema);
