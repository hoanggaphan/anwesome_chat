import { validationResult } from "express-validator";
import { message } from '../services/index';

const addNewTextEmoji = async (req, res) => {
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped()).map(
      (item) => item.msg
    );
    return res.status(500).send(errors);
  }

  try {
    let sender = {
      id: req.user._id,
      name: req.user.username,
      avatar: req.user.avatar
    };
    let { uid: receiverId, messageVal, isChatGroup } = req.body;

    let newMessage = await message.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);

    return res.status(200).send({ message: newMessage });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  addNewTextEmoji,
};
