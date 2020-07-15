import { validationResult } from "express-validator";
import multer from "multer";
import { transError } from "../../lang/vi";
import { app } from "../config/app";
import { message } from '../services/index';
import fsExtra from 'fs-extra';

// Handle emoji chat
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

// Handle images chat
const storageImageChat = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, app.image_message_directory);
  },
  filename: (req, file, cb) => {
    // Kiểm tra type của hình upload
    const math = app.image_message_type;
    if (math.indexOf(file.mimetype) === -1) {
      return cb(transError.image_message_type, null);
    }

    const imageName = file.originalname;
    cb(null, imageName);
  },
});

const imgMessageUploadFile = multer({
  storage: storageImageChat,
  limits: { fileSize: app.image_message_limit_size },
}).single("my-image-chat");

const addNewImage =  (req, res) => {
  imgMessageUploadFile(req, res, async (error) => {
    if (error) {
      if(error.message) {
        return res.status(500).send(transError.image_message_size);
      }
      return res.status(500).send(error);
    }

    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar
      };
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
      
      let newMessage = await message.addNewImage(sender, receiverId, messageVal, isChatGroup);
  
      // Remove image, because this image is saved to mongodb
      await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`)

      return res.status(200).send({ message: newMessage });
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  });

};

// Handle attachment chat
const storageAttachmentChat = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, app.attachment_message_directory);
  },
  filename: (req, file, cb) => {
    const attachmentName = file.originalname;
    cb(null, attachmentName);
  },
});

const attachmentMessageUploadFile = multer({
  storage: storageAttachmentChat,
  limits: { fileSize: app.attachment_message_limit_size },
}).single("my-attachment-chat");

const addNewAttachment =  (req, res) => {
  attachmentMessageUploadFile(req, res, async (error) => {
    if (error) {
      if(error.message) {
        return res.status(500).send(transError.image_message_size);
      }
      return res.status(500).send(error);
    }

    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar
      };
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
      
      let newMessage = await message.addNewAttachment(sender, receiverId, messageVal, isChatGroup);
  
      // Remove attachment, because this attachment is saved to mongodb
      await fsExtra.remove(`${app.attachment_message_directory}/${newMessage.file.fileName}`)

      return res.status(200).send({ message: newMessage });
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  });

};

module.exports = {
  addNewTextEmoji,
  addNewImage,
  addNewAttachment
};
