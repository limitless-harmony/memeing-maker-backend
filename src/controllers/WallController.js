/* eslint no-bitwise: ["error", { "int32Hint": true }] */
import Wall from '../models/Wall';
import { responseSuccess, isValidId } from '../helpers';
import ApplicationError from '../helpers/Error';
import messages from '../helpers/messages';

/**
 * Controller for meme walls
 */
export default class WallController {
  /**
   * creates a meme wall in the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the created meme wall.
   */
  static async create(req, res, next) {
    const { id } = req.user;
    const { name } = req.body;
    if (!name)
      return next(
        new ApplicationError(
          'A meme wall requires a name. Please provide one.',
          400
        )
      );

    const memeWall = await Wall.create({
      name,
      creator: id,
    });
    return responseSuccess(
      201,
      memeWall,
      messages.success('meme wall', 'created'),
      res
    );
  }

  /**
   * Gets a meme wall
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the fetched meme
   */
  static async getOne(req, res, next) {
    const { id } = req.params;
    if (!isValidId(id))
      return next(
        new ApplicationError(messages.invalidField('meme', 'ID'), 400)
      );
    const memeWall = await Wall.findOne({ _id: id })
      .lean()
      .populate('memes')
      .populate('creator');
    if (!memeWall)
      return next(new ApplicationError(messages.notFound('meme wall'), 404));
    return responseSuccess(
      200,
      memeWall,
      messages.success('meme wall', 'fetched'),
      res
    );
  }

  /**
   * Gets all the available memes in the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing an array of memes
   */
  static async getAll(req, res, next) {
    const walls = await Wall.find({});
    if (walls.length === 0)
      return next(new ApplicationError(messages.empty('meme wall'), 404));
    return responseSuccess(
      200,
      walls,
      messages.success('meme walls', 'fetched'),
      res
    );
  }

  /**
   * Adds a meme to a meme wall
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the meme wall with the added meme
   */
  static async addMeme(req, res, next) {
    const { wallId, memeId } = req.params;
    if (!isValidId(wallId) || !isValidId(memeId)) {
      return next(
        new ApplicationError('Please provide valid meme and wall IDs', 400)
      );
    }
    const updated = await Wall.findOneAndUpdate(
      { _id: wallId },
      { $addToSet: { memes: memeId } },
      { new: true }
    );
    if (!updated)
      return next(new ApplicationError(messages.notFound('meme wall'), 404));
    return responseSuccess(
      200,
      updated,
      messages.success('wall', 'added the meme to'),
      res
    );
  }

  /**
   * Reacts to a meme
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the meme wall
   */
  static async removeMeme(req, res, next) {
    const { wallId, memeId } = req.params;
    if (!isValidId(wallId) || !isValidId(memeId)) {
      return next(
        new ApplicationError('Please provide valid meme and wall IDs', 400)
      );
    }
    const updated = await Wall.findOneAndUpdate(
      { _id: wallId },
      { $pull: { memes: memeId } },
      { new: true }
    );
    if (!updated)
      return next(new ApplicationError(messages.notFound('meme wall'), 404));
    return responseSuccess(
      200,
      updated,
      messages.success('wall', 'removed the meme from'),
      res
    );
  }
}
