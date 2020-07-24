import ejs from 'ejs';
import { validationResult } from "express-validator";
import { promisify } from 'util';
import { bufferToBase64, convertTimestampHumanTime, lastItemFromArr } from '../helpers/clientHelper';
import { contact } from "../services/index";

// Make ejs function renderFile avaiable with async await
const renderFile = promisify(ejs.renderFile).bind(ejs);

const findUsersContact = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped()).map(
      (item) => item.msg
    );
    return res.status(500).send(errors);
  }

  try {
    const currentUserId = req.user._id;
    const keyword = req.params.keyword;

    const users = await contact.findUsersContact(currentUserId, keyword);
    return res.render("main/contact/sections/_findUsersContact", { users });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const searchFriends = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped()).map(
      (item) => item.msg
    );
    return res.status(500).send(errors);
  }

  try {
    const currentUserId = req.user._id;
    const keyword = req.params.keyword;

    const users = await contact.searchFriends(currentUserId, keyword);
    return res.render("main/groupChat/sections/_searchFriends", { users });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const addNew = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const contactId = req.body.uid;

    const newContact = await contact.addNew(currentUserId, contactId)
    const response = { success: !!newContact };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const removeContact = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const contactId = req.body.uid;

    const removeContact = await contact.removeContact(currentUserId, contactId)
    return res.status(200).send({ success: !!removeContact });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const removeRequestContactSent = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const contactId = req.body.uid;

    const removeReq = await contact.removeRequestContactSent(currentUserId, contactId)
    return res.status(200).send({ success: !!removeReq });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const removeRequestContactReceived = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const contactId = req.body.uid;

    const removeReq = await contact.removeRequestContactReceived(currentUserId, contactId)
    res.status(200).send({ success: !!removeReq });
  } catch (error) {
    res.status(500).send(error);
  }
};

const approveRequestContactReceived = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const contactId = req.body.uid;

    const messages = await contact.approveRequestContactReceived(currentUserId, contactId)

    res.status(200).send({ messages });
  } catch (error) {
    res.status(500).send(error);
  }
};

const readMoreContacts = async (req, res) => {
  try {
    // get skip number from query param
    const skipNumberContacts = +req.query.skipNumber;
    // get more item
    const newContactUsers = await contact.readMoreContacts(
      req.user._id,
      skipNumberContacts
    );

    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const readMoreContactsSent = async (req, res) => {
  try {
    // get skip number from query param
    const skipNumberContacts = +req.query.skipNumber;
    // get more item
    const newContactUsers = await contact.readMoreContactsSent(
      req.user._id,
      skipNumberContacts
    );

    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const readMoreContactsReceived = async (req, res) => {
  try {
    // get skip number from query param
    const skipNumberContacts = +req.query.skipNumber;
    // get more item
    const newContactUsers = await contact.readMoreContactsReceived(
      req.user._id,
      skipNumberContacts
    );

    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};


const contactConversation = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.params.contactId;
    let contactConversation = await contact.contactConversation(currentUserId, contactId);

    let dataToRender = {
      user: req.user,
      contactConversation,
      convertTimestampHumanTime,
      lastItemFromArr,
      bufferToBase64,
    };

    let leftSideData = await renderFile("src/views/main/contactConversation/_leftSide.ejs", dataToRender);
    let rightSideData = await renderFile("src/views/main/contactConversation/_rightSide.ejs", dataToRender);
    let imageModalData = await renderFile("src/views/main/contactConversation/_imageModal.ejs", dataToRender);
    let attachmentModalData = await renderFile("src/views/main/contactConversation/_attachmentModal.ejs", dataToRender);

    return res.status(200).send({
      leftSideData,
      rightSideData,
      imageModalData,
      attachmentModalData
    });
  } catch (error) {
    console.error(error)
    return res.status(500).send(error);
  }
};

module.exports = {
  findUsersContact,
  addNew,
  removeRequestContactSent,
  readMoreContacts,
  readMoreContactsSent,
  readMoreContactsReceived,
  removeRequestContactReceived,
  approveRequestContactReceived,
  removeContact,
  searchFriends,
  contactConversation
};
