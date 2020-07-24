function contactConversation() {
  $(".user-talk").off("click").on("click", function () {
    let targetId = $(this).data("uid");
    $("#contactsModal").modal("hide");

    if($("#all-chat").find(`li[data-chat = "${targetId}"]`).length) {
      $("#all-chat").find(`li[data-chat = "${targetId}"]`).click();
      return;
    }

    $.get(`/contact/contact-conversation/${targetId}`, function (data) {
      if (data.leftSideData.trim() === "") {
        alertify.notify("2 người không còn là bạn bè hãy refresh trang và kết bạn lại.", "error", 5);
        return;
      }

      // Step 01: handle leftSide
      $(`#all-chat`).find("ul").prepend(data.leftSideData);

      // Step 02: handle scroll left
      nineScrollLeft();
      resizeNineScrollLeft();
      
      // Step 03: handle rightSide
      $("#screen-chat").prepend(data.rightSideData);

      // Step 04: Not support video chat
      notSupportVideoChat();

      // Step 05: call screenChat
      changeScreenChat();

      // Step 06: convert emoji
      convertEmoji();

      // Step 07: handle imageModal
      $("body").append(data.imageModalData);

      // Step 08: call function gridPhotos
      gridPhotos(5);

      // Step 09: handle attachmentModal
      $("body").append(data.attachmentModalData);
      
      // Step 10: update online
      socket.emit("check-status");

      // Step 011: Click chat with target user
      $("#all-chat").find(`li[data-chat = "${targetId}"]`).click();
    });

  });
}

$(document).ready(function () {
  contactConversation();
});
