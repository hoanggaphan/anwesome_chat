import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper';

/**
 * @param io from socket.io library
 */
const chatAttachment = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    // Join all room chat of user
    socket.request.user.chatGroupIds.map(group => {
      socket.join(group._id);
    });

    socket.on("chat-attachment", (data) => {
      if (data.groupId) {
        let response = {
          currentUserId: socket.request.user._id,
          currentGroupId: data.groupId,
          message: data.message
        }

        // Emit all users in room chat except sender
        socket.to(data.groupId).emit("response-chat-attachment", response);
      }

      if (data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message
        }

        // emit notification
        if (clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, "response-chat-attachment", response);
        }
      }
    });

    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.map(group => {
        socket.leave(group._id);
      });
    });
  });
};

module.exports = chatAttachment;
