import addNewContact from "./contact/addNewContact";
import removeRequestContactSent from './contact/removeRequestContactSent';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import approveRequestContactReceived from './contact/approveRequestContactReceived';
import removeContact from './contact/removeContact';

/**
 * @param io from socket.io library
 */
const initSockets = (io) => {
  addNewContact(io);
  removeRequestContactSent(io);
  removeRequestContactReceived(io);
  approveRequestContactReceived(io);
  removeContact(io);
  //
};

module.exports = initSockets;
