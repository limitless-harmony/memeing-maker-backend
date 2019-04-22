import User from '../models/User';
import { responseError, responseSuccess } from '../helpers/responses';

/**
 * [UserController description]
 */
class UserController {
  /**
   * [getUsers description]
   * @param  {[type]}  req [description]
   * @param  {[type]}  res [description]
   * @return {Promise}     [description]
   */
  static async getUsers(req, res) {
    let users = [];
    try {
      users = await User.find();
    } catch (error) {
      return responseError(400, error, 'Could not fetch users', res);
    }
    return responseSuccess(200, users, 'users found', res);
  }
}


export default UserController;
