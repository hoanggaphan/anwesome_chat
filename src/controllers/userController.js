import multer from "multer";
import { app } from "../config/app";
import { transError, transSuccess } from "../../lang/vi";
import { v4 as uuidv4 } from "uuid";
import { user } from '../services/index';
import fsExtra from 'fs-extra';

const storageAvatar = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, app.avatar_directory);
  },
  filename: (req, file, cb) => {
    // Kiểm tra type của hình upload
    const math = app.avatar_type;
    if (math.indexOf(file.mimetype) === -1) {
      return cb(transError.avatar_type, null);
    }

    const avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    cb(null, avatarName);
  },
});

const avatarUploadFile = multer({
  storage: storageAvatar,
  limits: { fileSize: app.avatar_limit_file },
}).single("avatar");

const updateAvatar = (req, res) => {
  avatarUploadFile(req, res, async (error) => {
    if (error) {
      if(error.message) {
        return res.status(500).send(transError.avatar_size);
      }
      return res.status(500).send(error);
    }

    try {
      const updateUserItem = {
        avatar: req.file.filename,
        updateAt: Date.now()
      };
      // Update user in db
      const userUpdate = await user.updateUser(req.user._id, updateUserItem);

      // Remove old avatar in directory
      await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);

      const response = {
        message: transSuccess.avatar_updated,
        imgSrc: `/images/users/${req.file.filename}`
      }
      return res.status(200).send(response);
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  });
};

module.exports = {
  updateAvatar,
};
