/* eslint no-bitwise: ["error", { "int32Hint": true }] */
import Wall from '../models/Wall';
import { responseSuccess, isValidId } from '../helpers';
import ApplicationError from '../helpers/Error';

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
    const memeWall = await Wall.findOne({ _id: id }).lean().populate('memes');
    if (!memeWall) return next(new ApplicationError('Oops, looks like this meme wall does not exist!', 404));
    return responseSuccess(200, memeWall, 'meme wall fetched successfully', res);
  }

  /**
   * Gets all the available memes in the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing an array of memes
   */
  static async getMemeWalls(req, res, next) {
    const { page, limit } = req.query;
    const options = {
      page: page || 1,
      limit: limit || 10,
      lean: true,
      sort: { createdAt: -1 },
    };

    const walls = await Wall.paginate({}, options);
    if (walls.length === 0) return next(new ApplicationError('No meme walls available', 404));
    return responseSuccess(200, walls, 'Meme walls fetched successfully', res);
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
