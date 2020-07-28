$(document).ready(function () {
  $("#link-read-more-contacts-sent").bind("click", function () {
    const skipNumber = $("#request-contact-sent").find("li").length;

    $(this).css("display", "none");
    $(".read-more-contact-sent-loader").css("display", "inline-block");

    $.get(`/contact/read-more-contacts-sent?skipNumber=${skipNumber}`, function (data) {
      if(!data.newContactUsers.length) {
        alertify.notify("Bạn không còn yêu cầu nào để xem nữa cả.", "error", 5);
        $("#link-read-more-contacts-sent").css("display", "inline-block");
        $(".read-more-contact-sent-loader").css("display", "none");
        return;
      }

      data.newContactUsers.map(user => {
        $("#request-contact-sent")
          .find("ul")
          .append(
            `<li class="_contactList" data-uid="${user._id}">
              <div class="contactPanel">
                  <div class="user-avatar">
                      <img src="images/users/${user.avatar}" alt="${user.username}">
                  </div>
                  <div class="user-name">
                      <p>${user.username}</p>
                  </div>
                  <br>
                  <div class="user-address">
                      <span>&nbsp ${user.address || ""}</span>
                  </div>
                  <div class="user-remove-request-contact-sent action-danger display-important" data-uid="${user._id}">
                      Hủy yêu cầu
                  </div>
              </div>
            </li>`); // thểm ổ modal notification
      });

      removeRequestContactSent(); // js/removeRequestContactSent.js
      
      $("#link-read-more-contacts-sent").css("display", "inline-block");
      $(".read-more-contact-sent-loader").css("display", "none");

      if($(`#request-contact-sent .contactList`).find("._contactList").length === data.countAllContactsSent) {
        $("#link-read-more-contacts-sent").remove();
      }
    });
  });
});
