function attachmentChat(divId) {
  $(`#attachment-chat-${divId}`).off("change").on("change", function () {
    // Validation update user avatar in frontend
    const fileData = $(this).prop("files")[0];
    const limit = 1048576; // byte = 1MB

    if (fileData.size > limit) {
      alertify.notify("Tệp đính kèm có kích thước tối đa 1MB", "error", 5);
      $(this).val(null);
      return;
    }  

    let targetId = $(this).data('chat')
    let isChatGroup = false;
  
    let messageFormData = new FormData();
    messageFormData.append("my-attachment-chat", fileData);
    messageFormData.append("uid", targetId);
  
    if($(this).hasClass("chat-in-group")) {
      messageFormData.append("isChatGroup", true);
      isChatGroup = true;
    }
  
    $.ajax({
      url: "/message/add-new-attachment",
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
        let attachmentChat = `<div class="bubble-content">
                                <a
                                    href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}"
                                    download="${data.message.file.fileName}"
                                >
                                  ${data.message.file.fileName}
                                </a>
                            </div>`

        if (isChatGroup) {
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`
          messageOfMe.html(`${senderAvatar} ${attachmentChat}`);

          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;

        } else {
          messageOfMe.html(attachmentChat);
          dataToEmit.contactId = targetId;
        }

        // step 02: append message data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        // step 03: change data preview & time in leftSide
        $(`.person[data-chat = ${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat = ${divId}]`).find("span.preview").html("Tệp đính kèm...");

        // step 04: move conversation to the top 
        $(`.person[data-chat = ${divId}]`).on("event.moveConversationToTheTop", function () {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("event.moveConversationToTheTop");
        })
        $(`.person[data-chat = ${divId}]`).trigger("event.moveConversationToTheTop");

        // step 05: emit realtime
        socket.emit("chat-attachment", dataToEmit);

        // step 06: add image to modal attachment
        let attachmentChatToModal = `<li>
                                        <a
                                          href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}"
                                          download="${data.message.file.fileName}"
                                        >
                                          ${data.message.file.fileName}
                                        </a>
                                    </li>`
        $(`#attachmentsModal_${divId}`).find(".list-attachments").append(attachmentChatToModal);

      },
      error: function (error) {
        alertify.notify(error.responseText, "error", 5);
      },
    });
  });
}

$(document).ready(function () {
  socket.on("response-chat-attachment", function (response) {
    let divId = "";
    
    // step 01: handle message data before show
    let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
    let attachmentChat = `<div class="bubble-content">
                            <a
                                href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}"
                                download="${response.message.file.fileName}"
                            >
                              ${response.message.file.fileName}
                            </a>
                          </div>`

    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`
      messageOfYou.html(`${senderAvatar} ${attachmentChat}`);

      divId = response.currentGroupId;

      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    } else {
      messageOfYou.html(attachmentChat);
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
    $(`.person[data-chat = ${divId}]`).find("span.preview").html("Tệp đính kèm...");

    // step 04: move conversation to the top 
    $(`.person[data-chat = ${divId}]`).on("event.moveConversationToTheTop", function () {
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("event.moveConversationToTheTop");
    })
    $(`.person[data-chat = ${divId}]`).trigger("event.moveConversationToTheTop");

     // step 06: add image to modal attachment
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      let attachmentChatToModal = `
        <li>
          <a
            href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}"
            download="${response.message.file.fileName}"
          >
            ${response.message.file.fileName}
          </a>
        </li>
      `

      $(`#attachmentsModal_${divId}`).find(".list-attachments").append(attachmentChatToModal);
    }

  });
});
