/* eslint no-bitwise: ["error", { "int32Hint": true }] */
import Meme from '../models/Meme';
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
  static async getMany(req, res, next) {
    const { page, limit } = req.query;
    const options = {
      page: page || 1,
      limit: limit || 10,
      lean: true,
      sort: { createdAt: -1 },
    };

    const memes = await Meme.paginate({}, options);
    if (memes.length === 0)
      return next(new ApplicationError('No memes available', 404));
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
    const memes = await Meme.find({ featured: true }).lean();
    if (memes.length === 0)
      return next(new ApplicationError('No featured memes available', 404));
    return responseSuccess(
      200,
      memes,
      'Featured memes fetched successfully',
      res
    );
  }

  /**
   * creates a meme in the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the created meme.
   */
  static async save(req, res, next) {
    const { meme, method, params } = req;
    const { name, topText, bottomText, image, creator } = meme;

    let data = {};
    let code = 201;
    let message = 'Meme created successfully';
    if (method === 'POST') {
      data = await Meme.create({
        name,
        topText,
        bottomText,
        image,
        creator,
      });
    } else {
      data = await Meme.findOneAndUpdate(
        { _id: params.memeId },
        {
          name,
          topText,
          bottomText,
          image,
        }
      );
      code = 200;
      message = 'Meme edited successfully';
    }
    return responseSuccess(code, data, message, res);
  }

  /**
   * creates a meme in the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the created meme.
   */
  static async create(req, res, next) {
    const { userId } = req.user;
    const { topText, bottomText, image } = req.body;
    const meme = {
      topText,
      bottomText,
      image,
      creator: userId,
    };
    req.meme = meme;
    next();
  }

  /**
   * creates a meme in the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the created meme.
   */
  static async edit(req, res, next) {
    const { userId, isAdmin } = req.user;
    const { memeId } = req.params;
    const { topText, bottomText, image } = req.body;
    const meme = await Meme.findOne({ _id: memeId }).lean();
    if (isAdmin || userId === meme.creator.toString()) {
      meme.topText = topText;
      meme.bottomText = bottomText;
      meme.image = image;
      req.action = 'edit';
      req.meme = meme;
      return next();
    }
    return next(
      new ApplicationError("You don't have permission to edit this meme", 403)
    );
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
    if (!isValidId(memeId))
      return next(new ApplicationError('Please provide a valid meme ID', 400));
    const meme = await Meme.findOne({ _id: memeId })
      .lean()
      .populate('creator');
    if (!meme)
      return next(
        new ApplicationError('Oops, looks like this meme does not exist!', 404)
      );
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
    if (!isValidId(memeId))
      return next(new ApplicationError('Please provide a valid meme ID', 400));
    const castReactions = reactions | 0;
    if (!castReactions)
      return next(new ApplicationError('Reactions must be a number', 400));
    const updatedMeme = await Meme.findOneAndUpdate(
      { _id: memeId },
      { $inc: { reactions: castReactions } },
      { new: true }
    );
    if (!updatedMeme)
      return next(
        new ApplicationError('Oops, looks like this meme does not exist!', 404)
      );
    return responseSuccess(
      200,
      updatedMeme,
      'You have successfully reacted to this meme',
      res
    );
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
    if (!isValidId(memeId))
      return next(new ApplicationError('Please provide a valid meme ID', 400));

    const flaggedMeme = await Meme.findOneAndUpdate(
      { _id: memeId },
      { $addToSet: { flagged: userId } },
      { new: true }
    );
    if (!flaggedMeme)
      return next(
        new ApplicationError('Oops, looks like this meme does not exist!', 404)
      );
    return responseSuccess(
      200,
      flaggedMeme,
      'You have successfully flagged this meme',
      res
    );
  }
}

export default MemeController;
