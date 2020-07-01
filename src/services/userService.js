import UserModel from '../models/userModel';

/**
 * Update userInfo
 * @param {userId} id 
 * @param {dataUpdate} item 
 */
const updateUser = (id, item) => {
  return UserModel.updateUser(id, item)
}

module.exports = {
  updateUser
}
