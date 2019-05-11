/* eslint no-bitwise: ["error", { "int32Hint": true }] */
import Meme from '../models/Meme';
import Wall from '../models/Wall';
import { responseSuccess, isValidId } from '../helpers';
import ApplicationError from '../helpers/Error';

/**
 * [MemeController description]
 */
class MemeController {
  /**
   * Gets all the available memes in the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing an array of memes
   */
  static async getMemes(req, res, next) {
    const memes = await Meme.find();
    if (memes.length === 0) return next(new ApplicationError('No memes available', 404));
    return responseSuccess(200, memes, 'Memes fetched successfully', res);
  }

  /**
   * Gets featured memes
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing an array of memes
   */
  static async getFeaturedMemes(req, res, next) {
    const memes = await Meme.find({ featured: true });
    if (memes.length === 0) return next(new ApplicationError('No featured memes available', 404));
    return responseSuccess(200, memes, 'Featured memes fetched successfully', res);
  }

  /**
   * creates a meme in the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the created meme.
   */
  static async createMeme(req, res, next) {
    const { userId } = req.user;
    const {
      topText,
      bottomText,
      image,
      name,
    } = req.body;
    const meme = await Meme.create({
      topText,
      bottomText,
      image,
      creator: userId,
      name,
    });
    return responseSuccess(201, meme, 'Meme created successfully', res);
  }

  /**
   * Gets a meme from the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the fetched meme.
   */
  static async getAMeme(req, res, next) {
    const { memeId } = req.params;
    if (!isValidId(memeId)) return next(new ApplicationError('Please provide a valid meme ID', 400));
    const meme = await Meme.findOne({ _id: memeId }).populate('creator');
    if (!meme) return next(new ApplicationError('Oops, looks like this meme does not exist!', 404));
    return responseSuccess(200, meme, 'Meme fetched successfully', res);
  }

  /**
   * Reacts to a meme
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the meme reacted to
   */
  static async reactToMeme(req, res, next) {
    const { reactions } = req.body;
    const { memeId } = req.params;
    if (!isValidId(memeId)) return next(new ApplicationError('Please provide a valid meme ID', 400));
    const castReactions = reactions | 0;
    if (!castReactions) return next(new ApplicationError('Reactions must be a number', 400));
    const updatedMeme = await Meme.findOneAndUpdate(
      { _id: memeId },
      { $inc: { reactions: castReactions } },
      { new: true }
    );
    if (!updatedMeme) return next(new ApplicationError('Oops, looks like this meme does not exist!', 404));
    return responseSuccess(200, updatedMeme, 'You have successfully reacted to this meme', res);
  }

  /**
   * Flags a meme
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the flagged meme
   */
  static async flagAMeme(req, res, next) {
    const { memeId } = req.params;
    const { userId } = req.user;
    if (!isValidId(memeId)) return next(new ApplicationError('Please provide a valid meme ID', 400));

    const flaggedMeme = await Meme.findOneAndUpdate(
      { _id: memeId },
      { $addToSet: { flagged: userId } },
      { new: true }
    );
    if (!flaggedMeme) return next(new ApplicationError('Oops, looks like this meme does not exist!', 404));
    return responseSuccess(200, flaggedMeme, 'You have successfully flagged this meme', res);
  }

  /**
   * creates a meme wall in the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the created meme wall.
   */
  static async createMemeWall(req, res, next) {
    const { userId } = req.user;
    const { name } = req.body;
    if (!name) return next(new ApplicationError('A meme wall requires a name. Please provide one.', 400));

    const memeWall = await Wall.create({
      name,
      creator: userId,
    });
    return responseSuccess(201, memeWall, 'Meme wall created successfully', res);
  }

  /**
   * Gets a meme wall
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the fetched meme
   */
  static async getAMemeWall(req, res, next) {
    const { id } = req.params;
    if (!isValidId(id)) return next(new ApplicationError('Please provide a valid meme ID', 400));
    const memeWall = await Wall.findOne({ _id: id }).populate('memes');
    if (!memeWall) return next(new ApplicationError('Oops, looks like this meme wall does not exist!', 404));
    return responseSuccess(200, memeWall, 'meme wall fetched successfully', res);
  }

  /**
   * Adds a meme to a meme wall
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the meme wall with the added meme
   */
  static async addToMemeWall(req, res, next) {
    const { wallId, memeId } = req.params;
    if (!isValidId(wallId) || !isValidId(memeId)) {
      return next(new ApplicationError('Please provide valid meme and wall IDs', 400));
    }
    const updatedMemeWall = await Wall.findOneAndUpdate(
      { _id: wallId },
      { $addToSet: { memes: memeId } },
      { new: true }
    );
    if (!updatedMemeWall) return next(new ApplicationError('Oops, looks like this meme wall does not exist!', 404));
    return responseSuccess(200, updatedMemeWall, 'meme added to wall successfully', res);
  }

  /**
   * Reacts to a meme
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the meme wall
   */
  static async removeFromMemeWall(req, res, next) {
    const { wallId, memeId } = req.params;
    if (!isValidId(wallId) || !isValidId(memeId)) {
      return next(new ApplicationError('Please provide valid meme and wall IDs', 400));
    }
    const updatedMemeWall = await Wall.findOneAndUpdate(
      { _id: wallId },
      { $pull: { memes: memeId } },
      { new: true }
    );
    if (!updatedMemeWall) return next(new ApplicationError('Oops, looks like this meme wall does not exist!', 404));
    return responseSuccess(200, updatedMemeWall, 'meme removed from wall successfully', res);
  }
}

export default MemeController;
