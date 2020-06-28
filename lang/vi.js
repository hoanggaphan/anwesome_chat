export const transValidation = {
  email_incorrect: "Email phải có dạng example@gmail.com",
  gender_incorrect: "Oops, tại sao trường giới tính lại sai",
  password_incorrect: "Mật khẩu có ít nhất 8 kí tự, gồm chữ hoa, chữ số và kí tự đặc biệt",
  password_confirmation_incorrect: "Nhập lại mật khẩu chưa chính xác",
}

export const transError = {
  account_in_use: "Email này đã được sử dụng",
  account_removed: "Tài khoản này đã bị gỡ khỏi hệ thống, nếu thông tin không chính xác, vui lòng liên hệ với bộ phận hỗ trợ",
  account_not_active: "Tài khoản này chưa được kích hoạt, vui lòng kiểm tra email để kích hoạt tài khoản"
}

export const transSuccess = {
  userCreated(userEmail) {
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email để kích hoạt tài khoản, xin cảm ơn!`
  }
}
