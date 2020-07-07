import { notification } from '../services/index';

const getHome = async (req, res) => {
  // only 10 items one time
  const notifications = await notification.getNotification(req.user._id);
  // get amount notifications unread
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  res.render("main/home/home", {
    success: req.flash("success"),
    errors: req.flash("error"),
    user: req.user,
    notifications,
    countNotifUnread
  });
};

module.exports = {
  getHome,
};
