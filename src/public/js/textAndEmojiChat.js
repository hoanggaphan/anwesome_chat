function textAndEmojiChat(divId) {
  $(`.emojionearea`).off("keyup").on("keyup", function (elem) {
    if(elem.which === 13) {
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messVal = $(`#write-chat-${divId}`).val();
      
      if (!targetId.length || !messVal) {
        return false;  
      }

      let dataTextEmojiForSend = {
        uid: targetId,
        messVal,
      };

      if($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        dataTextEmojiForSend.isChatGroup = true;
      }

      // Call send message
      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function (data) {
        // success
      }).fail(function (response) {
        // error
      })
    }
  });
}