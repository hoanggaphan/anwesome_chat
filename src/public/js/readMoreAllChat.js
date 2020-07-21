$(document).ready(function () {
  $("#link-read-more-all-chat").bind("click", function () {
    const skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
    const skipGroup = $("#all-chat").find("li.group-chat").length;

    $("#link-read-more-all-chat").css("display", "none");
    $(".read-more-all-chat-loader").css("display", "inline-block");

    $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function (data) {
      if (data.leftSideData.trim() === "") {
        alertify.notify("Bạn không còn cuộc trò chuyện nào để xem nữa.", "error", 5);
        $("#link-read-more-all-chat").css("display", "inline-block");
        $(".read-more-all-chat-loader").css("display", "none");
        return;
      }

      // Step 01: handle leftSide
      $(`#all-chat`).find("ul").append(data.leftSideData);

      // Step 02: handle scroll left
      nineScrollLeft();
      resizeNineScrollLeft();
      
      // Step 03: handle rightSide
      $("#screen-chat").append(data.rightSideData);

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


      $("#link-read-more-all-chat").css("display", "inline-block");
      $(".read-more-all-chat-loader").css("display", "none");
    });
  });
});
