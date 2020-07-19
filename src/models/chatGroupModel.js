import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChatGroupSchema = new Schema({
  userId: String,
  name: String,
  usersAmount: { type: Number, min: 3, max: 169 },
  messagesAmount: { type: Number, default: 0 },
  members: [{ userId: String }],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null },
});

ChatGroupSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  /**
   * Get chat group item by userId and limit
   * @param { string: currentUserId } userId
   * @param { number } limit
   */
  getChatGroups(userId, limit) {
    return this.find({
      members: { $elemMatch: { userId } },
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec();
  },

  getChatGroupById(id) {
    return this.findById(id).exec();
  },

  /**
   * Update group chat when has new message
   * @param { string } id
   * @param { number } newMessagesAmount
   */
  updateWhenHasNewMessage(id, newMessagesAmount) {
    return this.findByIdAndUpdate(id, {
      messagesAmount: newMessagesAmount,
      updatedAt: Date.now(),
    }).exec();
  },

  getChatGroupIdsByUser(id) {
    return this.find(
      {
        members: { $elemMatch: { userId: id } },
      },
      { _id: 1 }
    ).exec();
  },
};

module.exports = mongoose.model("chat-group", ChatGroupSchema);
