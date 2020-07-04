import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  /**
   * Find all items that related with user.
   * @param {string} userId
   */
  findAllByUser(userId) {
    return this.find({
      $or: [{ "userId": userId }, { "contactId": userId }],
    }).exec();
  },

  /**
   * Check exist contact of 2 user
   * @param {string} userId
   * @param {string} contactId
   */
  checkExist(userId, contactId) {
    return this.findOne({
      $or: [
        { $and: [{ "userId": userId }, { "contactId": contactId }] },
        { $and: [{ "userId": contactId }, { "contactId": userId }] },
      ],
    }).exec();
  },

  /**
   * Remove request contact
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeRequestContact(userId, contactId) {
    return this.deleteOne({
      $and: [{ "userId": userId }, { "contactId": contactId }]
    });
  }
};

module.exports = mongoose.model("contact", ContactSchema);
