import ChatGroupModel from '../models/chatGroupModel'
import UserModel from '../models/userModel'
import _ from 'lodash';

let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
  return new Promise(async (resolse, reject) => {
    try {
      // add current user to array members
      arrayMemberIds.unshift({ userId: currentUserId.toString() });
      arrayMemberIds = _.uniqBy(arrayMemberIds, "userId");

      let newGroupItem = {
        userId: currentUserId.toString(),
        name: groupChatName,
        usersAmount: arrayMemberIds.length,
        members: arrayMemberIds,
      };

      let newGroup = await ChatGroupModel.createNew(newGroupItem);
      
      newGroup = newGroup.toObject();

      // get user info
      newGroup.membersInfo = []; 
      for (const member of newGroup.members) {
        let userInfo = await UserModel.getNormalUserDataById(member.userId);
        newGroup.membersInfo.push(userInfo); 
      }

      resolse(newGroup);
    } catch (error) {
      
    }
  });
}

let countAllGroupChats = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ChatGroupModel.countAllChatGroups(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let leaveGroupChat = (currentUserId, groupId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let groupChatById = await ChatGroupModel.findGroupChatById(groupId);
      let members = groupChatById.members;
      
      // remove member from groupChat
      members = members.filter(member => member.userId != currentUserId);
      let usersAmount = members.length;

      // remove groupChat if not have member in groupChat
      if (usersAmount === 0) {
        let removeGroupChat = await ChatGroupModel.removeGroupChatById(groupId);
        if(removeGroupChat.n === 0) {
          reject(false);
        }
        resolve([]);
      }

      let newGroupChat = await ChatGroupModel.updateMembersInGroupChat(groupId, members, usersAmount);
      
      resolve(newGroupChat);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  addNewGroup,
  countAllGroupChats,
  leaveGroupChat
}
