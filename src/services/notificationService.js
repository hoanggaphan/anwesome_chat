import NotificationModel from "../models/notificationModel";
import UserModel from "../models/userModel";

/**
 * Get notification when f5 page
 * Just 10 item one time.
 * @param {string} currentUserId
 * @param {number} limit
 */
const getNotification = (currentUserId, limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, limit);

      const getNotifContents = notifications.map(async (notification) => {
        const sender = await UserModel.findUserById(notification.senderId);
        return NotificationModel.contents.getContent(
          notification.type,
          notification.isRead,
          sender._id,
          sender.username,
          sender.avatar
        );
      });

      resolve(await Promise.all(getNotifContents));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getNotification };
