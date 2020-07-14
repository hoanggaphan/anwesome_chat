function imageChat(divId) {
  $(`#image-chat-${divId}`).off("change").on("change", function () {
     // Validation update user avatar in frontend
     const fileData = $(this).prop("files")[0];
     const math = ["image/png", "image/jpg", "image/jpeg"];
     const limit = 1048576; // byte = 1MB
 
    //  if ($.inArray(fileData.type, math) === -1) {
    //    alertify.notify(
    //      "Kiểu file Không hợp lệ, chỉ chấp nhận file png, jpg hoặc jpeg",
    //      "error",
    //      5
    //    );
    //    $(this).val(null);
    //    return;
    //  }
 
    //  if (fileData.size > limit) {
    //    alertify.notify("Ảnh có kích thước tối đa 1MB", "error", 5);
    //    $(this).val(null);
    //    return;
    //  }
     
    let targetId = $(this).data('chat')

    let messageFormData = new FormData();
    messageFormData.append("my-image-chat", fileData);
    messageFormData.append("uid", targetId);

    if($(this).hasClass("chat-in-group")) {
      messageFormData.append("isChatGroup", true);
    }

    $.ajax({
      url: "/message/add-new-image",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function (response) {
        console.log(response.message);
      },
      error: function (error) {
        console.error(error);
        alertify.notify(error.responseText, "error", 5);
      },
    });
  });    
}
