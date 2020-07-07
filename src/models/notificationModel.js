import mongoose from "mongoose";
import { notification } from "../services";

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  removeRequestContactNotification(senderId, receiverId, type) {
    return this.deleteOne({
      $and: [
        { senderId: senderId },
        { receiverId: receiverId },
        { type: type },
      ],
    }).exec();
  },

  /**
   * Get by userId and limit
   * @param {string} userId
   * @param {number} limit
   */
  getByUserIdAndLimit(userId, limit) {
    return this.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * Count all nofitication unread
   * @param {string} userId 
   */
  countNotifUnread(userId) {
    return this.countDocuments({
      $and: [
        { receiverId: userId },
        { isRead: false},
      ]
    }).exec();
  }
};

const NOTIFICATION_TYPE = {
  ADD_CONTACT: "add_contact",
};

const NOTIFICATION_CONTENT = {
  getContent(notificationType, isRead, userId, username, userAvatar) {
    if (notificationType === NOTIFICATION_TYPE.ADD_CONTACT) {
      if(!isRead) {
        return `<div class="notif-readed-false" data-uid="${userId}">
                  <img class="avatar-small" src="images/users/${userAvatar}" alt=${username} />
                  <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn! 
                </div>`;
      }

      return `<div data-uid="${userId}">
                <img class="avatar-small" src="images/users/${userAvatar}" alt=${username} />
                <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn! 
              </div>`;
    }

    return "No matching with any notification type.";
  },
};

module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPE,
  contents: NOTIFICATION_CONTENT
};
