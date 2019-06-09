/* eslint no-bitwise: ["error", { "int32Hint": true }] */
import Meme from '../models/Meme';
import Rule from '../models/Rule';
import { responseSuccess, isValidId } from '../helpers';
import ApplicationError from '../helpers/Error';
import messages from '../helpers/messages';
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
      return next(new ApplicationError(messages.empty('meme'), 404));
    return responseSuccess(
      200,
      memes,
      messages.success('memes', 'fetched'),
      res
    );
  }

  /**
   * Gets featured memes
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing an array of memes
   */
  static async getFeatured(req, res, next) {
    const memes = await Meme.find({ featured: true }).lean();
    if (memes.length === 0)
      return next(new ApplicationError(messages.empty('featured meme'), 404));
    return responseSuccess(
      200,
      memes,
      messages.success('featured memes', 'fetched'),
      res
    );
  }

  /**
   * Saves a meme in the database (new or an update)
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the created/updated meme.
   */
  static async save(req, res, next) {
    const { data, method, params } = req;
    const { topText, bottomText, image, creator } = data;

    let response = {};
    let code = 201;
    let message = messages.success('meme', 'created');
    if (method === 'POST') {
      response = await Meme.create({
        topText,
        bottomText,
        image,
        creator,
      });
    } else {
      response = await Meme.findOneAndUpdate(
        { _id: params.memeId },
        { topText, bottomText, image }
      );
      code = 200;
      message = messages.success('meme', 'edited');
    }
    return responseSuccess(code, response, message, res);
  }

  /**
   * Prepares a meme to be created
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   */
  static async create(req, res, next) {
    const { id } = req.user;
    const { topText, bottomText, image } = req.body;
    const meme = {
      topText,
      bottomText,
      image,
      creator: id,
    };
    req.data = meme;
    next();
  }

  /**
   * Prepares a meme to be edited
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   */
  static async edit(req, res, next) {
    const { id, isAdmin } = req.user;
    const { memeId } = req.params;
    const { topText, bottomText, image } = req.body;
    const meme = await Meme.findOne({ _id: memeId }).lean();
    if (isAdmin || id === meme.creator.toString()) {
      meme.topText = topText;
      meme.bottomText = bottomText;
      meme.image = image;
      req.data = meme;
      return next();
    }
    return next(new ApplicationError(messages.forbidden(), 403));
  }

  /**
   * Gets a meme from the database
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the fetched meme.
   */
  static async getOne(req, res, next) {
    const { memeId } = req.params;
    if (!isValidId(memeId))
      return next(
        new ApplicationError(messages.invalidField('meme', 'ID'), 400)
      );
    const meme = await Meme.findOne({ _id: memeId })
      .lean()
      .populate('creator');
    if (!meme)
      return next(new ApplicationError(messages.notFound('meme'), 404));
    return responseSuccess(200, meme, messages.success('meme', 'fetched'), res);
  }

  /**
   * Reacts to a meme
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the meme reacted to
   */
  static async react(req, res, next) {
    const { reactions } = req.body;
    const { memeId } = req.params;
    if (!isValidId(memeId))
      return next(
        new ApplicationError(messages.invalidField('meme', 'ID'), 400)
      );
    const castReactions = reactions | 0;
    if (!castReactions)
      return next(
        new ApplicationError(messages.badDataType('reactions', 'number'), 400)
      );
    const updatedMeme = await Meme.findOneAndUpdate(
      { _id: memeId },
      { $inc: { reactions: castReactions } },
      { new: true }
    );
    if (!updatedMeme)
      return next(new ApplicationError(messages.notFound('meme'), 404));
    return responseSuccess(
      200,
      updatedMeme,
      messages.success('meme', 'reacted to'),
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
  static async flag(req, res, next) {
    const { memeId } = req.params;
    const { id } = req.user;
    if (!isValidId(memeId))
      return next(
        new ApplicationError(messages.invalidField('meme', 'ID'), 400)
      );

    const flaggedMeme = await Meme.findOneAndUpdate(
      { _id: memeId },
      { $addToSet: { flagged: id } },
      { new: true }
    );
    if (!flaggedMeme)
      return next(new ApplicationError(messages.notFound('meme'), 404));
    return responseSuccess(
      200,
      flaggedMeme,
      messages.success('meme', 'flagged'),
      res
    );
  }

  /**
   * Gets the rules of play
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing an array of memes
   */
  static async getRules(req, res, next) {
    const rules = await Rule.find({}).lean();
    if (rules.length === 0)
      return next(new ApplicationError(messages.empty('rule'), 404));
    return responseSuccess(
      200,
      rules,
      messages.success('rules', 'fetched'),
      res
    );
  }
}

export default MemeController;
