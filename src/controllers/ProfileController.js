/* eslint no-bitwise: ["error", { "int32Hint": true }] */
import User from '../models/User';
import { responseSuccess, isValidId } from '../helpers';
import Meme from '../models/Meme';
import Wall from '../models/Wall';
import ApplicationError from '../helpers/Error';
import messages from '../helpers/messages';

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
    const response = await User.findOneAndUpdate({ _id: user.id }, data, {
      new: true,
    });

    if (!response)
      return next(new ApplicationError(messages.notFound('user'), 404));

    const {
      _id: id,
      role,
      isComplete,
      username,
      image,
      topText,
      bottomText,
    } = response;
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
      messages.success('profile', 'edited'),
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
    const { id } = req.params;
    if (!isValidId(id))
      return next(
        new ApplicationError(messages.invalidField('user', 'ID'), 400)
      );
    const profile = await User.findOne({ _id: id });
    if (!profile)
      return next(new ApplicationError(messages.notFound('user'), 404));
    const memes = await Meme.find({ creator: profile._id });
    const reactions = memes.reduce(
      (acc, value) => acc + value.reactions,
      profile.reactions
    );
    const walls = await Wall.find({ creator: profile._id });
    const data = { ...profile._doc, memes, walls, reactions };
    return responseSuccess(
      200,
      data,
      messages.success('profile', 'fetched'),
      res
    );
  }

  /**
   * Prepares the user data for profile update
   * @param {Object} req the request object
   * @param {Object} res the response object
   */
  static async update(req, res, next) {
    const { username, topText, bottomText, image } = req.body;
    if (!username || username.length < 3)
      return next(
        new ApplicationError(
          'Please choose a unique username of at least 3 characters',
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
    const { id } = req.params;
    if (!isValidId(id))
      return next(
        new ApplicationError(messages.invalidField('user', 'ID'), 400)
      );
    const castReactions = reactions | 0;
    if (!castReactions)
      return next(
        new ApplicationError(messages.badDataType('reactions', 'number'), 400)
      );
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $inc: { reactions: castReactions } },
      { new: true }
    );
    if (!updatedUser)
      return next(new ApplicationError(messages.notFound('user'), 404));
    return responseSuccess(
      200,
      updatedUser,
      messages.success('profile', 'reacted to'),
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
