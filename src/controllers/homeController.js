import { notification } from '../services/index';

const getHome = async (req, res) => {
  const notifications = await notification.getNotification(req.user._id);

  res.render("main/home/home", {
    success: req.flash("success"),
    errors: req.flash("error"),
    user: req.user,
    notifications
  });
};

module.exports = {
  getHome,
};
