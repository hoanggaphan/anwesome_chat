import addNewContact from "./contact/addNewContact";

/**
 * @param io from socket.io library
 */
const initSockets = (io) => {
  addNewContact(io);
  //
};

module.exports = initSockets;
