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
        return await UserModel.getNormalUserDataById(contact.userId);

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
  removeRequestContact,
  getContacts,
  getContactsSent,
  getContactsReceived,
  countAllContacts,
  countAllContactsSent,
  countAllContactsReceived,
  readMoreContacts,
  readMoreContactsSent,
  readMoreContactsReceived
};
