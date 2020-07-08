import { contact } from "../services/index";
import { validationResult } from "express-validator";

const findUsersContact = async (req, res) => {
  let errorArr = [];

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped()).map(
      (item) => item.msg
    );
    errorArr = [...errorArr, ...errors];
    // console.error(errorArr);
    return res.status(500).send(errorArr);
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

const removeRequestContact = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const contactId = req.body.uid;

    const removeReq = await contact.removeRequestContact(currentUserId, contactId)
    const response = { success: removeReq };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send(error);
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

module.exports = {
  findUsersContact,
  addNew,
  removeRequestContact,
  readMoreContacts,
  readMoreContactsSent,
  readMoreContactsReceived
};
