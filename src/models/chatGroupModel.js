import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChatGroupSchema = new Schema({
  userId: String,
  name: String,
  usersAmount: { type: Number, min: 3, max: 169 },
  messagesAmount: { type: Number, default: 0 },
  members: [{ userId: String }],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

ChatGroupSchema.statics = {
  /**
   * Get chat group item by userId and limit
   * @param { string: currentUserId } userId
   * @param { number } limit
   */
  getChatGroups(userId, limit) {
    return this.find({
      members: { $elemMatch: { userId } },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },
};

module.exports = mongoose.model("chat-group", ChatGroupSchema);
