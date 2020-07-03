import ContactModel from "../models/contactModel";
import UserModel from "../models/userModel";
import _ from "lodash";

const findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [];
    let contactsByUser = await ContactModel.findAllByUser(currentUserId);
    contactsByUser.map((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });

    deprecatedUserIds = _.uniqBy(deprecatedUserIds);
    let user = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
    resolve(user);
  });
};

module.exports = {
  findUsersContact,
};
