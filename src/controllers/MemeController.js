import Meme from '../models/Meme';
import Wall from '../models/Wall';
import { responseError, responseSuccess, isValidId } from '../helpers';

/**
 * [MemeController description]
 */
class MemeController {
  /**
   * Gets all the available memes in the database
   * @param  {Object}  req the request object
   * @param  {Object}  res the response object
   * @return {Promise}     a response object containing an array of found memes
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
   * @param  {Object}  req the request object
   * @param  {Object}  res the response object
   * @return {Promise}     a response object containing an array of found memes
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
   * @param  {Object}  req the request object
   * @param  {Object}  res the response object
   * @return {Promise}     a response object containing the just created meme.
   */
  static async createMeme(req, res) {
    const {
      topText,
      bottomText,
      image,
      user,
      name,
    } = req.body;

    try {
      const meme = await Meme.create({
        topText,
        bottomText,
        image,
        user,
        name,
      });
      return responseSuccess(200, meme, 'Meme created successfully', res);
    } catch (error) {
      return responseError(500, error, 'Could not create the meme', res);
    }
  }

  /**
   * creates a meme wall in the database
   * @param  {Object}  req the request object
   * @param  {Object}  res the response object
   * @return {Promise} a response object containing the just created meme.
   */
  static async createMemeWall(req, res) {
    const {
      name,
      creator,
      memes,
    } = req.body;

    try {
      const memeWall = await Wall.create({
        name,
        creator,
        memes,
      });
      return responseSuccess(200, memeWall, 'Meme wall created successfully', res);
    } catch (error) {
      if (error.code && error.code === 11000) {
        return responseError(409, error, 'A meme wall with the same name already exists. Please use a different name', res);
      }
      return responseError(500, error, 'Could not create the meme wall', res);
    }
  }


  /**
   * Gets a meme wall
   * @param  {Object}  req the request object
   * @param  {Object}  res the response object
   * @return {Promise}     a response object containing an array of found memes
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
   * @param  {Object}  req the request object
   * @param  {Object}  res the response object
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
   * Removes a meme from a meme wall
   * @param  {Object}  req the request object
   * @param  {Object}  res the response object
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
}

export default MemeController;
