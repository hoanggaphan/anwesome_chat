import ContactModel from "../models/contactModel";
import UserModel from "../models/userModel";
import NotificationModel from "../models/notificationModel";
import _ from "lodash";

const findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [currentUserId];
    let contactsByUser = await ContactModel.findAllByUser(currentUserId);
    contactsByUser.map((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });

    deprecatedUserIds = _.uniqBy(deprecatedUserIds); // remove duplicate item
    let user = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
    resolve(user);
  });
};

const addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    const contactExist = await ContactModel.checkExist(
      currentUserId,
      contactId
    );
    if (contactExist) {
      return reject(false);
    }

    // Create contact
    const newContactItem = {
      userId: currentUserId,
      contactId,
    };
    const newContact = await ContactModel.createNew(newContactItem);

    // Create notification
    const notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.types.ADD_CONTACT,
    };
    await NotificationModel.model.createNew(notificationItem);

    resolve(newContact);
  });
};

const removeRequestContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    const removeReq = await ContactModel.removeRequestContact(
      currentUserId,
      contactId
    );
    if (removeReq.n === 0) {
      return reject(false);
    }

    // Remove notification
    const notifType = NotificationModel.types.ADD_CONTACT;
    await NotificationModel.model.removeRequestContactNotification(currentUserId, contactId, notifType);

    resolve(true);
  });
};

module.exports = {
  findUsersContact,
  addNew,
  removeRequestContact,
};
