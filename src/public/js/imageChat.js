function bufferToBase64(arrayBuffer) {
  return btoa(
    new Uint8Array(arrayBuffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}

function imageChat(divId) {
  $(`#image-chat-${divId}`).off("change").on("change", function () {
     // Validation update user avatar in frontend
     const fileData = $(this).prop("files")[0];
     const math = ["image/png", "image/jpg", "image/jpeg"];
     const limit = 1048576; // byte = 1MB
 
     if ($.inArray(fileData.type, math) === -1) {
       alertify.notify(
         "Kiểu file Không hợp lệ, chỉ chấp nhận file png, jpg hoặc jpeg",
         "error",
         5
       );
       $(this).val(null);
       return;
     }
 
     if (fileData.size > limit) {
       alertify.notify("Ảnh có kích thước tối đa 1MB", "error", 5);
       $(this).val(null);
       return;
     }
     
    let targetId = $(this).data('chat')
    let isChatGroup = false;

    let messageFormData = new FormData();
    messageFormData.append("my-image-chat", fileData);
    messageFormData.append("uid", targetId);

    if($(this).hasClass("chat-in-group")) {
      messageFormData.append("isChatGroup", true);
      isChatGroup = true;
    }

    $.ajax({
      url: "/message/add-new-image",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function (data) {
        let dataToEmit = {
          message: data.message
        };

        // step 01: handle message data before show
        let messageOfMe = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`);
        let imageChat = `<img 
                          src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" class="show-image-chat"
                        />`

        if (isChatGroup) {
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`
          messageOfMe.html(`${senderAvatar} ${imageChat}`);

          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;

        } else {
          messageOfMe.html(imageChat);
          dataToEmit.contactId = targetId;
        }

        // step 02: append message data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        // step 03: change data preview & time in leftSide
        $(`.person[data-chat = ${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat = ${divId}]`).find("span.preview").html("Hình ảnh...");

        // step 04: move conversation to the top 
        $(`.person[data-chat = ${divId}]`).on("event.moveConversationToTheTop", function () {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("event.moveConversationToTheTop");
        })
        $(`.person[data-chat = ${divId}]`).trigger("event.moveConversationToTheTop");

        // step 05: emit realtime
        socket.emit("chat-image", dataToEmit);

        // step 06: add image to modal image
        let imageChatToModal = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}"/>`
        $(`#imagesModal_${divId}`).find(".all-images").append(imageChatToModal);
      },
      error: function (error) {
        console.error(error);
        alertify.notify(error.responseText, "error", 5);
      },
    });
  });    
}

$(document).ready(function () {
  socket.on("response-chat-image", function (response) {
    let divId = "";

    // step 01: handle message data before show
    let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
    let imageChat = `<img 
                      src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" class="show-image-chat"
                    />`

    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`
      messageOfYou.html(`${senderAvatar} ${imageChat}`);

      divId = response.currentGroupId;

      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    } else {
      messageOfYou.html(imageChat);
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
    $(`.person[data-chat = ${divId}]`).find("span.preview").html("Hình ảnh...");

    // step 04: move conversation to the top 
    $(`.person[data-chat = ${divId}]`).on("event.moveConversationToTheTop", function () {
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("event.moveConversationToTheTop");
    })
    $(`.person[data-chat = ${divId}]`).trigger("event.moveConversationToTheTop");

     // step 06: add image to modal image
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      let imageChatToModal = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}"/>`
      $(`#imagesModal_${divId}`).find(".all-images").append(imageChatToModal);
    }
  });
});
