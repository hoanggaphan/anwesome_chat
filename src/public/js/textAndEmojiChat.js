function textAndEmojiChat(divId) {
  $(`.emojionearea`).off("keyup").on("keyup", function (elem) {
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
        // success
        console.log(data.message);
      }).fail(function (response) {
        // error
        alertify.notify(response.responseText, "error", 5);
      })
    }
  });
}