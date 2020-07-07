import { notification } from '../services/index';

const readMore = async (req, res) => {
  try {
    // get skip number from query param
    const skipNumberNotification = +(req.query.skipNumber);
    // get more item
    const newNotification = await notification.readMore(req.user._id, skipNumberNotification);

    return res.status(200).send(newNotification);
  } catch (error) {
    return res.status(500).send(error)
  }
};

module.exports = { readMore };
