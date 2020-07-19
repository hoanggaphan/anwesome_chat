import ContactModel from "../models/contactModel";
import UserModel from "../models/userModel";
import NotificationModel from "../models/notificationModel";
import _ from "lodash";

const LIMIT_NUMBER_TAKEN = 10;

const findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [currentUserId];
    let contactsByUser = await ContactModel.findAllByUser(currentUserId);
    contactsByUser.map((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });

    deprecatedUserIds = _.uniqBy(deprecatedUserIds); // remove duplicate item
    let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
    resolve(users);
  });
};

const searchFriends = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let friendIds = [];
    let friends = await ContactModel.getFriends(currentUserId);

    friends.forEach(item => {
      friendIds.push(item.userId);
      friendIds.push(item.contactId);
    });

    // Remove duplicate
    friendIds = _.uniqBy(friendIds);
    friendIds = friendIds.filter(userId => userId != currentUserId);

    let users = await UserModel.findAllToAddGroupChat(friendIds, keyword);

    resolve(users);
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

const removeContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    const removeContact = await ContactModel.removeContact(currentUserId, contactId);
    if (removeContact.n === 0) {
      return reject(false);
    }

    resolve(true);
  });
};

const removeRequestContactSent = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    const removeReq = await ContactModel.removeRequestContactSent(
      currentUserId,
      contactId
    );
    if (removeReq.n === 0) {
      return reject(false);
    }

    // Remove notification
    const notifType = NotificationModel.types.ADD_CONTACT;
    await NotificationModel.model.removeRequestContactSentNotification(currentUserId, contactId, notifType);

    resolve(true);
  });
};

const removeRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    const removeReq = await ContactModel.removeRequestContactReceived(
      currentUserId,
      contactId
    );
    if (removeReq.n === 0) {
      return reject(false);
    }

    // Remove notification (chức năng này chưa làm)
    // const notifType = NotificationModel.types.ADD_CONTACT;
    // await NotificationModel.model.removeRequestContactReceivedNotification(currentUserId, contactId, notifType);

    resolve(true);
  });
};

const approveRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    const approveReq = await ContactModel.approveRequestContactReceived(
      currentUserId,
      contactId
    );

    if (approveReq.nModified === 0) {
      return reject(false);
    }

    // Create notification
    const notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.types.APPROVE_CONTACT,
    };
    await NotificationModel.model.createNew(notificationItem);

    resolve(true);
  });
};

const getContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER_TAKEN)

      const users = contacts.map(async (contact) => {
        if (currentUserId == contact.userId) {
          return await UserModel.getNormalUserDataById(contact.contactId);
        } else {
          return await UserModel.getNormalUserDataById(contact.userId);
        }
      });
      
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const getContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.getContactsSent(currentUserId, LIMIT_NUMBER_TAKEN)

      const users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });
      
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const getContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.getContactsReceived(currentUserId, LIMIT_NUMBER_TAKEN)

      const users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });
      
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const countAllContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

const countAllContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsSent(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

const countAllContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsReceived(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Read more contacts (max 10 item one time)
 * @param {string} currentUserId 
 * @param {number} skipNumberContacts 
 */
const readMoreContacts = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newContacts = await ContactModel.readMoreContacts(currentUserId, skipNumberContacts, LIMIT_NUMBER_TAKEN);

      const users = newContacts.map(async (contact) => {
        if (currentUserId == contact.userId) {
          return await UserModel.getNormalUserDataById(contact.contactId);
        } else {
          return await UserModel.getNormalUserDataById(contact.userId);
        }
      });
      
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};


/**
 * Read more contacts sent (max 10 item one time)
 * @param {string} currentUserId 
 * @param {number} skipNumberContacts 
 */
const readMoreContactsSent = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newContacts = await ContactModel.readMoreContactsSent(currentUserId, skipNumberContacts, LIMIT_NUMBER_TAKEN);

      const users = newContacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);

      });
      
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Read more contacts received (max 10 item one time)
 * @param {string} currentUserId 
 * @param {number} skipNumberContacts 
 */
const readMoreContactsReceived = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newContacts = await ContactModel.readMoreContactsReceived(currentUserId, skipNumberContacts, LIMIT_NUMBER_TAKEN);

      const users = newContacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });
      
      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  findUsersContact,
  addNew,
  removeRequestContactSent,
  getContacts,
  getContactsSent,
  getContactsReceived,
  countAllContacts,
  countAllContactsSent,
  countAllContactsReceived,
  readMoreContacts,
  readMoreContactsSent,
  readMoreContactsReceived,
  removeRequestContactReceived,
  approveRequestContactReceived,
  removeContact,
  searchFriends
};
