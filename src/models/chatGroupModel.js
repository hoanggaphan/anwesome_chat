import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChatGroupSchema = new Schema({
  userId: String,
  name: String,
  usersAmount: { type: Number, min: 3, max: 169 },
  messagesAmount: { type: Number, default: 0 },
  members: [
    { userId: String }
  ],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
})

module.exports = mongoose.model("message", ChatGroupSchema);
