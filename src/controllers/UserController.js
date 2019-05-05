import User from '../models/User';
import { responseSuccess, isValidId } from '../helpers';
import Meme from '../models/Meme';
import ApplicationError from '../helpers/Error';

/**
 * [UserController description]
 */
class UserController {
  /**
   * Gets the profile of a user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing the user profile.
   */
  static async getUserProfile(req, res, next) {
    const { userId } = req.params;
    if (!isValidId(userId)) return next(new ApplicationError('Please provide a valid user ID', 400));
    const profile = await User.findOne({ _id: userId });
    if (!profile) return next(new ApplicationError('Oops, looks like this user does not exist!', 404));
    const memes = await Meme.find({ creator: profile._id });
    const data = { ...profile._doc, memes };
    return responseSuccess(200, data, 'User Profile fetched successfully', res);
  }
}

export default UserController;
