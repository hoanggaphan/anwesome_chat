import { body } from "express-validator";
import { transValidation } from "../../lang/vi";

const checkMessageLength = [
  body("messageVal", transValidation.message_text_emoji_incorrect)
    .isLength({ min: 1, max: 400 })
];

module.exports = {
  checkMessageLength,
};
