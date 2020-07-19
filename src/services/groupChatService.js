import ChatGroupModel from '../models/chatGroupModel'
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
      resolse(newGroup);
    } catch (error) {
      
    }
  });
}

module.exports = {
  addNewGroup
}
