import { validationResult } from "express-validator";
import { groupChat } from '../services'

const addNewGroup = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped()).map(
      (item) => item.msg
    );
    return res.status(500).send(errors);
  }

  try {
    let currentUserId = req.user._id;
    let arrayMemberIds = req.body.arrIds;
    let groupChatName = req.body.groupChatName;

    let newGroupChat = await groupChat.addNewGroup(currentUserId, arrayMemberIds, groupChatName);
    return res.status(200).send({ groupChat: newGroupChat });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  addNewGroup
};
