let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;

function updateUserInfo() {
  $("#input-change-avatar").bind("change", function () {
    const fileData = $(this).prop("files")[0];
    const math = ["image/png", "image/jpg", "image/jpeg"];
    const limit = 1048576; // byte = 1MB

    // if ($.inArray(fileData.type, math) === -1) {
    //   alertify.notify(
    //     "Kiểu file Không hợp lệ, chỉ chấp nhận file png, jpg hoặc jpeg",
    //     "error",
    //     5
    //   );
    //   $(this).val(null);
    //   return;
    // }

    // if (fileData.size > limit) {
    //   alertify.notify("Ảnh có kích thước tối đa 1MB", "error", 5);
    //   $(this).val(null);
    //   return;
    // }

    if (typeof FileReader !== "undefined") {
      const imagePreview = $("#image-edit-profile");
      imagePreview.empty();

      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        $("<img>", {
          src: e.target.result,
          id: "user-modal-avatar",
          class: "avatar img-circle",
          alt: "avatar",
        }).appendTo(imagePreview);
      };
      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      let formData = new FormData();
      formData.append("avatar", fileData);
      userAvatar = formData;
    } else {
      alertify.notify(
        "Trình duyệt của bạn không hỗ trợ FileReader",
        "error",
        5
      );
    }
  });

  $("#input-change-username").bind("change", function () {
    userInfo.username = $(this).val();
  });

  $("#input-change-gender-male").bind("click", function () {
    userInfo.gender = $(this).val();
  });

  $("#input-change-gender-female").bind("click", function () {
    userInfo.gender = $(this).val();
  });

  $("#input-change-address").bind("change", function () {
    userInfo.address = $(this).val();
  });

  $("#input-change-phone").bind("change", function () {
    userInfo.phone = $(this).val();
  });
}

$(document).ready(function () {
  updateUserInfo();

  originAvatarSrc = $("#user-modal-avatar").attr("src");

  $("#input-btn-update-user").bind("click", function () {
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify(
        "Bạn phải thay đổi thông tin trước khi cập nhật",
        "error",
        5
      );
    }

    // Call ajax update avatar
    $.ajax({
      url: "/user/update-avatar",
      type: "put",
      cache: false,
      contentType: false,
      processData: false,
      data: userAvatar,
      success: function (response) {
        console.log(response);
        // Display success
        $(".user-modal-alert-success")
          .css("display", "block")
          .find("span")
          .text(response.message);

        // Update avatar at navbar
        $("#navbar-avatar").attr("src", response.imgSrc);

        // Update origin avatar src
        originAvatarSrc = response.imgSrc;
        
        // Reset all
        $("#input-btn-cancel-user").click();
      },
      error: function (error) {
        // Display error
        $(".user-modal-alert-error")
          .css("display", "block")
          .find("span")
          .text(error.responseText);
        
        // Reset all
        $("#input-btn-cancel-user").click();
      },
    });
  });

  $("#input-btn-cancel-user").bind("click", function () {
    userAvatar = null;
    userInfo = {};
    $("#input-change-avatar").val(null);
    $("#user-modal-avatar").attr("src", originAvatarSrc);
  });
});
