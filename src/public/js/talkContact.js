function talkContact() {
  $(".user-talk").off("mousedown").on("mousedown", function () {
    let targetId = $(this).data("uid");
    $("#contactsModal").modal("hide");

    if($("#all-chat").find(`li[data-chat = "${targetId}"]`).length) {
      $("#all-chat").find(`li[data-chat = "${targetId}"]`).click();
      return;
    }

    $.get(`/contact/talk-contact/${targetId}`, function (data) {
      if (data.leftSideData.trim() === "") {
        alertify.notify("2 người không còn là bạn bè hãy refresh trang và kết bạn lại.", "error", 5);
        return;
      }
      
      // Step 01: handle leftSide
      $(`#all-chat`).find("ul").prepend(data.leftSideData);
      $(`#user-chat`).find("ul").prepend(data.leftSideData);
      
      // Step 02: handle scroll left
      nineScrollLeft();
      resizeNineScrollLeft();
      
      // Step 03: handle rightSide
      $("#screen-chat").prepend(data.rightSideData);

      // Step 04: call screenChat
      changeScreenChat();

      // Step 05: Enable chat emoji
      enableEmojioneArea();

      // Step 06: convert emoji
      convertEmoji();

      // Step 07: handle imageModal
      $("body").append(data.imageModalData);

      // Step 08: call function gridPhotos
      gridPhotos(5);

      // Step 9: handle attachmentModal
      $("body").append(data.attachmentModalData);
      
      // Step 10: update online
      socket.emit("check-status");

      // Step 12: Read more messages
      readMoreMessages();

      // Step 13: Click chat with target user
      $("#all-chat").find(`li[data-chat = "${targetId}"]`).click();
    });

  });
}

$(document).ready(function () {
  talkContact();
});
