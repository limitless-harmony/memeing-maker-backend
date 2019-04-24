import MemeController from '../controllers/MemeController';
import saveImage from '../middlewares/aws';
import { validateMeme } from '../middlewares/validators';

export default (app) => {
  app.get('/memes', MemeController.getMemes);
  app.get('/memes/featured', MemeController.getFeaturedMemes);
  app.post('/memes', validateMeme, saveImage, MemeController.createMeme);
};
