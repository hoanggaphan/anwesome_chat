import { notification, contact } from '../services/index';

const getHome = async (req, res) => {
  // only (10 items one time)
  let notifications = await notification.getNotification(req.user._id);
  // get amount notifications unread
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  // get contacts (10 item one time)
  let contacts = await contact.getContacts(req.user._id);
  // get contacts sent (10 item one time)
  let contactsSent = await contact.getContactsSent(req.user._id);
  // get contacts received (10 item one time)
  let contactsReceived = await contact.getContactsReceived(req.user._id);

  // count contact
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
  let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

  res.render("main/home/home", {
    success: req.flash("success"),
    errors: req.flash("error"),
    user: req.user,
    notifications,
    countNotifUnread,
    contacts,
    contactsSent,
    contactsReceived,
    countAllContacts,
    countAllContactsSent,
    countAllContactsReceived
  });
};

module.exports = {
  getHome,
};
