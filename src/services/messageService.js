import _ from "lodash";
import ChatGroupModel from "../models/chatGroupModel";
import ContactModel from "../models/contactModel";
import UserModel from "../models/userModel";
import MessageModel from "../models/messageModel";
import { transError } from '../../lang/vi';
import { app } from '../config/app';
import fsExtra from 'fs-extra';
import { contact } from ".";

const LIMIT_CONVERSATION_TAKEN = 1;
const LIMIT_MESSAGES_TAKEN = 30;

/**
 * Get all conversation
 * @param {string} currentUserId
 */
const getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATION_TAKEN);
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

      // get message to apply in screen chat
      let allConversationWithMessagesPromise = allConversations.map(
        async (conversation) => {
          conversation = conversation.toObject();

          if (conversation.members) {
            let messages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
            conversation.messages = _.reverse(messages);
          } else {
            let messages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
            conversation.messages = _.reverse(messages);
          }

          return conversation;
        }
      );
      let allConversationWithMessages = await Promise.all(
        allConversationWithMessagesPromise
      );
      // sort by updatedAt desending
      allConversationWithMessages = _.sortBy(
        allConversationWithMessages,
        (item) => -item.updatedAt
      );

      resolve(allConversationWithMessages);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Add new message text emoji
 * @param {object} sender cuurent user
 * @param {string} receiverId id of an user or a group
 * @param {string} messageVal 
 * @param {boolean} isChatGroup 
 */
const addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if(!getChatGroupReceiver) {
          return reject(transError.conversation_not_found);
        }

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        }

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now(),
        }
        
        // Create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // Update group chat
        await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messagesAmount + 1);
        resolve(newMessage);
      } else {
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        if(!getUserReceiver) {
          return reject(transError.conversation_not_found);
        }

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        }

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now(),
        }

        // Create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // Update contact
        await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
        resolve(newMessage);
      }

    } catch (error) {
      reject(error);      
    }
  });
};

/**
 * add new image attachment
 * @param {object} sender 
 * @param {string} receiverId 
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
const addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if(!getChatGroupReceiver) {
          return reject(transError.conversation_not_found);
        }

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        }
        
        let imageBuffer = await fsExtra.readFile(messageVal.path)
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageTypes.IMAGE,
          sender: sender,
          receiver: receiver,
          file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
          createdAt: Date.now(),
        }
        
        // Create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // Update group chat
        await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messagesAmount + 1);
        resolve(newMessage);
      } else {
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        if(!getUserReceiver) {
          return reject(transError.conversation_not_found);
        }

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        }

        let imageBuffer = await fsExtra.readFile(messageVal.path)
        let imageContentType = messageVal.mimetype;
        let imageName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageTypes.IMAGE,
          sender: sender,
          receiver: receiver,
          file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
          createdAt: Date.now(),
        }

        // Create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // Update contact
        await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
        resolve(newMessage);
      }

    } catch (error) {
      reject(error);      
    }
  });
};

/**
 * add new message attachment
 * @param {object} sender 
 * @param {string} receiverId 
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
const addNewAttachment = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if(!getChatGroupReceiver) {
          return reject(transError.conversation_not_found);
        }

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        }
        
        let attachmentBuffer = await fsExtra.readFile(messageVal.path)
        let attachmentContentType = messageVal.mimetype;
        let attachmentName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageTypes.FILE,
          sender: sender,
          receiver: receiver,
          file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName },
          createdAt: Date.now(),
        }
        
        // Create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // Update group chat
        await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messagesAmount + 1);
        resolve(newMessage);
      } else {
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        if(!getUserReceiver) {
          return reject(transError.conversation_not_found);
        }

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        }

        let attachmentBuffer = await fsExtra.readFile(messageVal.path)
        let attachmentContentType = messageVal.mimetype;
        let attachmentName = messageVal.originalname;

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageTypes.FILE,
          sender: sender,
          receiver: receiver,
          file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName },
          createdAt: Date.now(),
        }

        // Create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // Update contact
        await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
        resolve(newMessage);
      }

    } catch (error) {
      reject(error);      
    }
  });
};

/**
 * Read more personal and group chat
 * @param {string} currentUserId 
 * @param {number} skipPersonal 
 * @param {number} skipGroup 
 * @param {array} personalIds 
 * @param {array} groupIds 
 */
const readMoreAllChat = (currentUserId, skipPersonal, skipGroup, personalIds, groupIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.readMoreChatContact(currentUserId, skipPersonal, personalIds, LIMIT_CONVERSATION_TAKEN);
      
      const userConversationPromise = contacts.map(async (contact) => {
        if (currentUserId == contact.userId) {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.contactId
          );
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.userId
          );
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });

      const userConversations = await Promise.all(userConversationPromise);
      const groupConversations = await ChatGroupModel.readMoreChatGroup(currentUserId, skipGroup, groupIds, LIMIT_CONVERSATION_TAKEN);
      
      let allConversations = [...userConversations, ...groupConversations];
      allConversations = _.sortBy(allConversations, (item) => -item.updatedAt);

      // get message to apply in screen chat
      let allConversationWithMessagesPromise = allConversations.map(
        async (conversation) => {
          conversation = conversation.toObject();

          if (conversation.members) {
            let messages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
            conversation.messages = _.reverse(messages);
          } else {
            let messages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
            conversation.messages = _.reverse(messages);
          }

          return conversation;
        }
      );
      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
      // sort by updatedAt desending
      allConversationWithMessages = _.sortBy(
        allConversationWithMessages,
        (item) => -item.updatedAt
      );

      resolve(allConversationWithMessages);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 
 * @param {string} currentUserId 
 * @param {number} skipMessage 
 * @param {string} targetId 
 * @param {boolean} chatInGroup 
 */
const readMore = (currentUserId, skipMessage, targetId, chatInGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      // message in group
      if (chatInGroup) {
        let messages = await MessageModel.model.readMoreMessagesInGroup(targetId, skipMessage, LIMIT_MESSAGES_TAKEN);
        messages = _.reverse(messages);
        return resolve(messages);
      } 

      // message in personal
      let messages = await MessageModel.model.readMoreMessagesInPersonal(currentUserId, targetId, skipMessage, LIMIT_MESSAGES_TAKEN);
      messages = _.reverse(messages);
      resolve(messages);

    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { 
  getAllConversationItems, 
  addNewTextEmoji, 
  addNewImage,
  addNewAttachment,
  readMoreAllChat,
  readMore
};
