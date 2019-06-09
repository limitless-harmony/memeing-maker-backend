import Rule from '../models/Rule';
import Meme from '../models/Meme';
import { responseSuccess, isValidId } from '../helpers';
import ApplicationError from '../helpers/Error';
import messages from '../helpers/messages';

/**
 * [AdminController description]
 */
class AdminController {
  /**
   * Features a meme
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing thee just featured meme
   */
  static async featureAMeme(req, res, next) {
    const { memeId } = req.params;
    if (!isValidId(memeId))
      return next(
        new ApplicationError(messages.invalidField('meme', 'ID'), 400)
      );
    const meme = await Meme.findOneAndUpdate(
      { _id: memeId },
      { featured: true },
      { new: true }
    );
    if (!meme)
      return next(new ApplicationError(messages.notFound('meme'), 404));

    return responseSuccess(
      200,
      meme,
      messages.success('meme', 'featured'),
      res
    );
  }

  /**
   * Unfeatures a meme
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing thee just featured meme
   */
  static async unFeatureAMeme(req, res, next) {
    const { memeId } = req.params;
    if (!isValidId(memeId))
      return next(
        new ApplicationError(messages.invalidField('meme', 'ID'), 400)
      );
    const meme = await Meme.findOneAndUpdate(
      { _id: memeId },
      { featured: false },
      { new: true }
    );
    if (!meme)
      return next(new ApplicationError(messages.notFound('meme'), 404));

    return responseSuccess(
      200,
      meme,
      messages.success('meme', 'un-featured'),
      res
    );
  }

  /**
   * Saves a rule in the database (new or an update)
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the created/updated rule.
   */
  static async saveRule(req, res, next) {
    const {
      data,
      method,
      params: { ruleId },
    } = req;
    const { topText, bottomText, image } = data;

    let response = {};
    let code = 201;
    let message = messages.success('rule', 'created');
    if (method === 'POST') {
      response = await Rule.create({
        topText,
        bottomText,
        image,
      });
    } else {
      response = await Rule.findOneAndUpdate(
        { _id: ruleId },
        { topText, bottomText, image }
      );
      code = 200;
      message = messages.success('rule', 'edited');
    }
    return responseSuccess(code, response, message, res);
  }

  /**
   * Prepares a rule to be created
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   */
  static async createRule(req, res, next) {
    const { topText, bottomText, image } = req.body;
    const rule = {
      topText,
      bottomText,
      image,
    };
    req.data = rule;
    next();
  }

  /**
   * Deletes a meme
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Object} next the next function
   * @return {Promise} a response object containing the deleted meme
   */
  static async deleteMeme(req, res, next) {
    const { memeId } = req.params;
    if (!isValidId(memeId))
      return next(
        new ApplicationError(messages.invalidField('meme', 'ID'), 400)
      );

    const deletedMeme = await Meme.deleteOne({ _id: memeId });
    if (!deletedMeme.deletedCount)
      return next(new ApplicationError(messages.notFound('meme'), 404));
    return responseSuccess(200, {}, messages.success('meme', 'deleted'), res);
  }
}

export default AdminController;
