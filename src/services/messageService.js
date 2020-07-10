import ContactModel from '../models/contactModel';
import UserModel from '../models/userModel';
import ChatGroupModel from '../models/chatGroupModel';
import _ from 'lodash';
import { json } from 'express';

const LIMIT_CONVERSATION_TAKEN = 15;

/**
 * get all conversation
 * @param {string} currentUserId 
 */
const getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATION_TAKEN)
      const userConversationPromise = contacts.map(async (contact) => {
        if (currentUserId == contact.userId) {
          let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });

      const userConversations = await Promise.all(userConversationPromise);
      const groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATION_TAKEN);
      let allConversations = [...userConversations, ...groupConversations];
      allConversations = _.sortBy(allConversations, (item) => -item.updatedAt);

      resolve({
        allConversations,
        userConversations,
        groupConversations,
      });
    } catch (error) {
      reject(error);
    }
  })
}

module.exports = { getAllConversationItems };
