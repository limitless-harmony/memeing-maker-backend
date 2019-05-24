import User from '../models/User';
import { responseSuccess, isValidId } from '../helpers';
import Meme from '../models/Meme';
import Wall from '../models/Wall';
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
    if (!isValidId(userId))
      return next(new ApplicationError('Please provide a valid user ID', 400));
    const profile = await User.findOne({ _id: userId });
    if (!profile)
      return next(
        new ApplicationError('Oops, looks like this user does not exist!', 404)
      );
    const memes = await Meme.find({ creator: profile._id });
    const reactions = memes.reduce((acc, value) => acc + value.reactions, 0);
    const walls = await Wall.find({ creator: profile._id });
    const data = { ...profile._doc, memes, walls, reactions };
    return responseSuccess(200, data, 'User Profile fetched successfully', res);
  }

  /**
   * Gets the profile of a user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing the user profile.
   */
  static async getText(req, res, next) {
    const { email, username } = req.params;
    const data = await User.findOne({ $or: [email, username] });

    return responseSuccess(200, data, 'User Profile fetched successfully', res);
  }

  /**
   * Update the user's email and username
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing the user profile.
   */
  static async updateUserData(req, res, next) {
    const { username, topText, bottomText } = req.body;
    const { userId } = req.user;

    if (!username || username.length > 16 || username.length < 3)
      return next(
        new ApplicationError(
          'Please choose a unique username between 3 and 16 characters',
          400
        )
      );

    const userUpdate = await User.findOneAndUpdate(
      { _id: userId },
      { username, topText, bottomText, isComplete: true },
      { new: true }
    );
    if (!userUpdate)
      return next(new ApplicationError('No such user found!', 404));

    return responseSuccess(
      200,
      userUpdate,
      'User data updated successfully',
      res
    );
  }

  /**
   * Gets the profile of a user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing the user profile.
   */
  static async loginSuccess(req, res) {
    return responseSuccess(
      200,
      req.user,
      'You have successfully logged in!',
      res
    );
  }
}

export default UserController;
