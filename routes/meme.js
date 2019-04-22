import MemeController from '../controllers/MemeController';
import saveImage from '../middlewares/aws';
import { validateMeme } from '../middlewares/validators';

export default (app) => {
  app.get('/memes', MemeController.getMemes);
  app.post('/memes', validateMeme, saveImage, MemeController.createMeme);
};
