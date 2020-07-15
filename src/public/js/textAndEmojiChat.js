function textAndEmojiChat(divId) {
  $(`.emojionearea`).off("keyup").on("keyup", function (elem) {
    let currentEmojioneArea = $(this);
    if(elem.which === 13) {
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messageVal = $(`#write-chat-${divId}`).val();
      
      if (!targetId.length || !messageVal) {
        return false;  
      }

      let dataTextEmojiForSend = {
        uid: targetId,
        messageVal,
      };

      if($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        dataTextEmojiForSend.isChatGroup = true;
      }

      // Call send message
      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function (data) {
        let dataToEmit = {
          message: data.message
        };

        // step 01: handle message data before show
        let messageOfMe = $(`<div class="bubble me" data-mess-id="${data.message._id}">
                              <div class="bubble-content"></div>
                            </div>`
                          );
        messageOfMe.find(".bubble-content").text(data.message.text);
        let convertEmojiMessage = emojione.toImage(messageOfMe.html());

        if (dataTextEmojiForSend.isChatGroup) {
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`
          messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);

          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        } else {
          messageOfMe.html(convertEmojiMessage);
          dataToEmit.contactId = targetId;
        }

        // step 02: append message data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        // step 03: remove all data input
        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find(".emojionearea-editor").text("");

        // step 04: change data preview & time in leftSide
        $(`.person[data-chat = ${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat = ${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

        // step 05: move conversation to the top 
        $(`.person[data-chat = ${divId}]`).on("event.moveConversationToTheTop", function () {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("event.moveConversationToTheTop");
        })
        $(`.person[data-chat = ${divId}]`).trigger("event.moveConversationToTheTop");

        // step 06: emit realtime
        socket.emit("chat-text-emoji", dataToEmit);

        // step 07: emit remove typing real-time
        typingOff(divId);

        // step 08: If this has typing, remove that immediate
        let checkTyping = $(`.chat[data-chat = ${divId}]`).find("div.bubble-typing-gif");
        if(checkTyping) {
          checkTyping.remove();
        }

      }).fail(function (response) {
        // error
        alertify.notify(response.responseText, "error", 5);
      })
    }
  });
}

$(document).ready(function () {
  socket.on("response-chat-text-emoji", function (response) {
    let divId = "";

    // step 01: handle message data before show
    let messageOfYou = $(`<div class="bubble you" data-mess-id="${response.message._id}">
                              <div class="bubble-content"></div>
                            </div>`
                          );
    messageOfYou.find(".bubble-content").text(response.message.text);
    let convertEmojiMessage = emojione.toImage(messageOfYou.html());

    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`
      messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);

      divId = response.currentGroupId;

      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    } else {
      messageOfYou.html(convertEmojiMessage);
      divId = response.currentUserId;
    }

    // step 02: append message data to screen
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      nineScrollRight(divId);
      $(`.person[data-chat = ${divId}]`).find("span.time").addClass("message-time-realtime");
    }

    // step 03: change data preview & time in leftSide
    $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat = ${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

    // step 04: move conversation to the top 
    $(`.person[data-chat = ${divId}]`).on("event.moveConversationToTheTop", function () {
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("event.moveConversationToTheTop");
    })
    $(`.person[data-chat = ${divId}]`).trigger("event.moveConversationToTheTop");

  });
});
