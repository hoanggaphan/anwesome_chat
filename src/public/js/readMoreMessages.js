function readMoreMessages() {
  $(".right .chat").scroll(function () {
    let thisDom = $(this);

    // get the first message
    let firstMessage = thisDom.find(".bubble:first");
    // get position of first message
    let currentOffset = firstMessage.offset().top - thisDom.scrollTop();

    if (thisDom.scrollTop() === 0) {
      let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading" />`;
      thisDom.prepend(messageLoading);

      let targetId = thisDom.data("chat");
      let skipMessage = thisDom.find("div.bubble").length;
      let chatInGroup = thisDom.hasClass("chat-in-group") ? true : false;

      $.get(
        `/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`,
        function (data) {
          if (data.rightSideData.trim() === "") {
            alertify.notify("Bạn không còn tin nhắn nào nữa.", "error", 5);
            thisDom.find("img.message-loading").remove();
            return;
          }

          // Step 01: handle rightSide
          $(`.right .chat[data-chat = ${targetId}]`).prepend(data.rightSideData);

          // Step 02: prevent scroll
          $(`.right .chat[data-chat = ${targetId}]`).scrollTop(firstMessage.offset().top  - currentOffset);

          // Step 03: Convert emoji
          convertEmoji()

          // Step 04: handle imageModal
          $(`#imagesModal_${targetId}`).find(".all-images").append(data.imageModalData);
          gridPhotos(5);

          // Step 05: handle attachmentModal
          $(`#attachmentsModal_${targetId}`).find(".list-attachments").append(data.attachmentModalData);

          // Step 06: remove message loading
          thisDom.find("img.message-loading").remove();

        }
      );
    }
  });
}

$(document).ready(function () {
  readMoreMessages();
});
