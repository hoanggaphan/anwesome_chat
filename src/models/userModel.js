import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null },
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

  /**
   * Find all users for add contact.
   * @param {array: deperated userIds} deprecatedUserIds
   * @param {string: keyword search} keyword
   */
  findAllForAddContact(deprecatedUserIds, keyword) {
    return this.find(
      {
        $and: [
          { "_id": { $nin: deprecatedUserIds } }, // tìm data không nằm trong mảng deprecatedUserIds
          { "local.isActived": true },
          {
            $or: [
              { "username": { $regex: keyword, $options: "i" } }, // tìm ra user name gần giống keyword
              { "local.email": { $regex: keyword, $options: "i" } },
              { "facebook.email": { $regex: keyword, $options: "i" } },
              { "google.email": { $regex: keyword, $options: "i" } },
            ],
          },
        ],
      },
      { _id: 1, username: 1, address: 1, avatar: 1 } // lấy ra các trường tương ứng
    ).exec();
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
  },

  updatePassword(id, hashedPasswod) {
    return this.findByIdAndUpdate(id, {
      "local.password": hashedPasswod,
    }).exec();
  },
};

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password); // return a promise has result is true or false
  },
};

module.exports = mongoose.model("user", UserSchema);
