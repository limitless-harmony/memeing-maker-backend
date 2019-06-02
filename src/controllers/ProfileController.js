/* eslint no-bitwise: ["error", { "int32Hint": true }] */
import User from '../models/User';
import { responseSuccess, isValidId } from '../helpers';
import Meme from '../models/Meme';
import Wall from '../models/Wall';
import ApplicationError from '../helpers/Error';

/**
 * The controller for user
 */
class ProfileController {
  /**
   * Saves a user profile in the database (new or an update)
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the updated profile.
   */
  static async save(req, res, next) {
    const { data, user } = req;
    const response = await User.findOneAndUpdate({ _id: user.userId }, data, {
      new: true,
    });

    if (!response)
      return next(new ApplicationError('No such user found!', 404));

    const {
      _id: id,
      role,
      isComplete,
      username,
      image,
      topText,
      bottomText,
    } = response;
    const message = 'Profile edited successfully';
    return responseSuccess(
      200,
      {
        id,
        role,
        username,
        image,
        isComplete,
        topText,
        bottomText,
      },
      message,
      res
    );
  }

  /**
   * Gets the profile of a user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing the user profile.
   */
  static async get(req, res, next) {
    const { userId } = req.params;
    if (!isValidId(userId))
      return next(new ApplicationError('Please provide a valid user ID', 400));
    const profile = await User.findOne({ _id: userId });
    if (!profile)
      return next(
        new ApplicationError('Oops, looks like this user does not exist!', 404)
      );
    const memes = await Meme.find({ creator: profile._id });
    const reactions = memes.reduce(
      (acc, value) => acc + value.reactions,
      profile.reactions
    );
    const walls = await Wall.find({ creator: profile._id });
    const data = { ...profile._doc, memes, walls, reactions };
    return responseSuccess(200, data, 'User Profile fetched successfully', res);
  }

  /**
   * Prepares the user data for profile update
   * @param {Object} req the request object
   * @param {Object} res the response object
   */
  static async update(req, res, next) {
    const { username, topText, bottomText, image } = req.body;
    if (!username || username.length > 16 || username.length < 3)
      return next(
        new ApplicationError(
          'Please choose a unique username between 3 and 16 characters',
          400
        )
      );
    req.data = { username, topText, bottomText, image, isComplete: true };
    return next();
  }

  /**
   * Reacts to a user profile
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the meme reacted to
   */
  static async react(req, res, next) {
    const { reactions } = req.body;
    const { userId } = req.params;
    if (!isValidId(userId))
      return next(new ApplicationError('Please provide a valid user ID', 400));
    const castReactions = reactions | 0;
    if (!castReactions)
      return next(new ApplicationError('Reactions must be a number', 400));
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { reactions: castReactions } },
      { new: true }
    );
    if (!updatedUser)
      return next(
        new ApplicationError(
          'Oops, looks like this profile does not exist!',
          404
        )
      );
    return responseSuccess(
      200,
      updatedUser,
      'You have successfully reacted to this profile',
      res
    );
  }

  /**
   * Gets the profile of a user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing the user profile.
   */
  static async finishLogin(req, res) {
    return responseSuccess(
      200,
      req.user,
      'You have successfully logged in!',
      res
    );
  }
}

export default ProfileController;