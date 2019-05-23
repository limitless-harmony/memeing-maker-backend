import User from '../models/User';
import { responseSuccess, isValidId } from '../helpers';
import Token from '../helpers/Token';
import Meme from '../models/Meme';
import ApplicationError from '../helpers/Error';

/**
 * The controller for user
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

  /**
   * Update the user's email and username
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing the user profile.
   */
  static async updateUserData(req, res, next) {
    const { username, email } = req.body;
    const token = req.get('x-access-token') || req.body['x-access-token'];
    // TODO: Move all validations to Joi
    const isValidEmail = /^[^@]+@[^@]+\.[^@]+$/.test(email);
    if (!isValidEmail) return next(new ApplicationError('Please provide a valid email', 400));
    if (!username || username.length > 16) return next(new ApplicationError('Please provide a valid username', 400));
    const decodedToken = Token.verify(token);
    try {
      const userUpdate = await User.findOneAndUpdate(
        { id: decodedToken.id },
        { username, email, isComplete: true },
        { returnNewDocument: true },
      );
      if (userUpdate) return responseSuccess(200, userUpdate, 'User data updated successfully', res);
    } catch (error) {
      return next(new ApplicationError(error.message, 400));
    }
  }

  /**
   * Gets the profile of a user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing the user profile.
   */
  static async loginSuccess(req, res) {
    return responseSuccess(200, req.user, 'You have successfully logged in!', res);
  }
}

export default UserController;
