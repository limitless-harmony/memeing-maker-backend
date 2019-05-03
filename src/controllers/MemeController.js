/* eslint no-bitwise: ["error", { "int32Hint": true }] */
import Meme from '../models/Meme';
import Wall from '../models/Wall';
import { responseError, responseSuccess, isValidId } from '../helpers';
import User from '../models/User';

/**
 * [MemeController description]
 */
class MemeController {
  /**
   * Gets all the available memes in the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing an array of found memes
   */
  static async getMemes(req, res) {
    try {
      const memes = await Meme.find();
      if (memes.length === 0) return responseError(404, {}, 'No memes available', res);
      return responseSuccess(200, memes, 'Memes fetched successfully', res);
    } catch (error) {
      return responseError(400, error, 'Could not fetch Memes', res);
    }
  }

  /**
   * Gets featured memes
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing an array of found memes
   */
  static async getFeaturedMemes(req, res) {
    try {
      const memes = await Meme.find({ featured: true });
      if (memes.length === 0) return responseError(404, {}, 'No featured memes available', res);
      return responseSuccess(200, memes, 'Featured memes fetched successfully', res);
    } catch (error) {
      return responseError(500, error, 'Could not fetch Memes', res);
    }
  }

  /**
   * creates a meme in the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing the just created meme.
   */
  static async createMeme(req, res) {
    const { userId } = req.user;
    const {
      topText,
      bottomText,
      image,
      name,
    } = req.body;

    try {
      const meme = await Meme.create({
        topText,
        bottomText,
        image,
        creator: userId,
        name,
      });
      return responseSuccess(201, meme, 'Meme created successfully', res);
    } catch (error) {
      return responseError(500, error, 'Could not create the meme', res);
    }
  }

  /**
   * creates a meme wall in the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing the just created meme.
   */
  static async createMemeWall(req, res) {
    const { userId } = req.user;
    const {
      name,
      memes,
    } = req.body;

    try {
      const memeWall = await Wall.create({
        name,
        creator: userId,
        memes,
      });
      return responseSuccess(201, memeWall, 'Meme wall created successfully', res);
    } catch (error) {
      if (error.code && error.code === 11000) {
        return responseError(409, error, 'A meme wall with the same name already exists. Please use a different name', res);
      }
      return responseError(500, error, 'Could not create the meme wall', res);
    }
  }

  /**
   * Gets a meme wall
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing an array of found memes
   */
  static async getAMemeWall(req, res) {
    const { id } = req.params;
    if (!isValidId(id)) return responseError(400, {}, 'Please provide a valid meme ID', res);
    try {
      const memeWall = await Wall.findOne({ _id: id }).populate('memes');
      if (!memeWall) return responseError(404, {}, 'The meme wall you are looking for, does not exist', res);
      return responseSuccess(200, memeWall, 'meme wall fetched successfully', res);
    } catch (error) {
      return responseError(500, error, 'Could not fetch meme wall', res);
    }
  }

  /**
   * Adds a meme to a meme wall
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing an array of found memes
   */
  static async addToMemeWall(req, res) {
    const { wallId, memeId } = req.params;
    if (!isValidId(wallId) || !isValidId(memeId)) {
      return responseError(400, {}, 'Please provide a valid ID for the meme wall and meme', res);
    }
    try {
      const updatedMemeWall = await Wall.findOneAndUpdate(
        { _id: wallId },
        { $addToSet: { memes: memeId } },
        { new: true }
      );
      return responseSuccess(200, updatedMemeWall, 'meme added to wall successfully', res);
    } catch (error) {
      return responseError(500, error, error.message, res);
    }
  }

  /**
   * Reacts to a meme
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing an array of found memes
   */
  static async removeFromMemeWall(req, res) {
    const { wallId, memeId } = req.params;
    if (!isValidId(wallId) || !isValidId(memeId)) {
      return responseError(400, {}, 'Please provide a valid ID for the meme wall and meme', res);
    }
    try {
      const updatedMemeWall = await Wall.findOneAndUpdate(
        { _id: wallId },
        { $pull: { memes: memeId } },
        { new: true }
      );
      return responseSuccess(200, updatedMemeWall, 'meme removed from wall successfully', res);
    } catch (error) {
      return responseError(500, error, error.message, res);
    }
  }

  /**
   * Reacts to a meme
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing an array of found memes
   */
  static async reactToMeme(req, res) {
    const { reactions } = req.body;
    const { memeId } = req.params;
    if (!isValidId(memeId)) return responseError(400, {}, 'Please provide a valid meme ID', res);
    const castReactions = reactions | 0;
    if (!castReactions) return responseError(400, {}, 'Reactions must be a number', res);
    try {
      const updatedMeme = await Meme.findOneAndUpdate(
        { _id: memeId },
        { $inc: { reactions: castReactions } },
        { new: true }
      );
      const { creator } = updatedMeme;
      await User.findOneAndUpdate(
        { _id: creator },
        { $inc: { reactions: castReactions } },
        { new: true }
      );
      return responseSuccess(200, updatedMeme, 'You have successfully reacted to this meme', res);
    } catch (error) {
      return responseError(500, error, error.message, res);
    }
  }

  /**
   * Flags a meme
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @return {Promise} a response object containing an array of found memes
   */
  static async flagAMeme(req, res) {
    const { memeId } = req.params;
    const { userId } = req.user;
    if (!isValidId(memeId)) return responseError(400, {}, 'Please provide a valid meme ID', res);

    try {
      const flaggedMeme = await Meme.findOneAndUpdate(
        { _id: memeId },
        { $addToSet: { flagged: userId } },
        { new: true }
      );
      return responseSuccess(200, flaggedMeme, 'You have successfully reacted to this meme', res);
    } catch (error) {
      return responseError(500, error, error.message, res);
    }
  }
}

export default MemeController;
