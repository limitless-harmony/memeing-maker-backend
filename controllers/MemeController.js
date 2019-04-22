import Meme from '../models/Meme';
import { responseError, responseSuccess } from '../helpers/responses';

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
      const Memes = await Meme.find();
      return responseSuccess(200, Memes, 'Memes found', res);
    } catch (error) {
      return responseError(400, error, 'Could not fetch Memes', res);
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
      userId,
      name,
    } = req.body;

    try {
      const meme = await Meme.create({
        topText,
        bottomText,
        image,
        userId,
        name,
      });
      return responseSuccess(200, meme, 'Meme created successfully', res);
    } catch (error) {
      return responseError(500, error, 'Could not create the meme', res);
    }
  }
}


export default MemeController;
