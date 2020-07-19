function addFriendsToGroup() {
  $('ul#group-chat-friends').find('div.add-user').bind('click', function() {
    let uid = $(this).data('uid');
    $(this).remove();
    let html = $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').html();

    let promise = new Promise(function(resolve, reject) {
      $('ul#friends-added').append(html);
      $('#groupChatModal .list-user-added').show();
      resolve(true);
    });
    promise.then(function(success) {
      $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').remove();
    });
  });
}

function cancelCreateGroup() {
  $('#btn-cancel-group-chat').bind('click', function() {
    $('#groupChatModal .list-user-added').hide();
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function(index) {
        $(this).remove();
      });
    }
  });
}

function callSearchFriend(e) {
  if (e.which === 13 || e.type === "click") {
    let keyword = $("#input-search-friend-to-add-group-chat").val();
    const regKeyword = new RegExp(/^[s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)

    if (!keyword) {
      alertify.notify("Chưa nhập nội dung tìm kiếm.", "error", 5);
      return;
    }
    
    if(!regKeyword.test(keyword)) {
      alertify.notify("Nội dung tìm kiếm không được chứa kí tự đặc biệt, chỉ cho phép chữ cái, số và khoảng trống", "error", 5);
      return;
    }
    
    $.get(`/contact/search-friends/${keyword}`, function (data) {
      $("ul#group-chat-friends").html(data);
      // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
      addFriendsToGroup();

      // Action hủy việc tạo nhóm trò chuyện
      cancelCreateGroup();
    });
  }
}

function callCreateGroupChat() {
  $("#btn-create-group-chat").off("click").on("click", function name() {
    let countUsers = $("ul#friends-added").find("li");
    if(countUsers.length < 2) {
      alertify.error("Vui lòng chọn bạn bè để thêm vào nhóm, tối thiểu 2 người", 5);
      return;
    }

    let groupChatName = $("#input-name-group-chat").val();
    let regUsername = new RegExp(
      /^[s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    );
    if(!regUsername.test(groupChatName) || groupChatName.length < 5 || groupChatName.length > 30) {
      alertify.error("Vui lòng nhập tên cuộc trò chuyện, giới hạn từ 5 - 30 kí tự và không chứa kí tự đặc biệt.", 5);
      return;
    }

    let arrIds = [];
    $("ul#friends-added").find("li").each(function (index, item) {
      arrIds.push({ userId: $(item).data("uid") });
    });

    Swal.fire({
      title: `Bạn có chắc muốn tạo nhóm ${groupChatName}?`,
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (!result.value) {
        return;
      }
      $.post(
        "/group-chat/add-new",
        {
          groupChatName: groupChatName,
          arrIds: arrIds,
        },
        function (data) {
          console.log(data);
        }
      ).fail(function (response) {
        alertify.error(response.responseText, 5);
      });
    });
  });
}

$(document).ready(function () {
  $("#input-search-friend-to-add-group-chat").bind("keypress", callSearchFriend);
  $("#btn-search-friend-to-add-group-chat").bind("click", callSearchFriend);
  callCreateGroupChat();
});
