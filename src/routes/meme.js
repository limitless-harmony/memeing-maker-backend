import MemeController from '../controllers/MemeController';
import saveImage from '../middlewares/aws';
import { validateMeme } from '../middlewares/validators';

export default (app) => {
  app.get('/memes', MemeController.getMemes);
  app.post('/memes', validateMeme, saveImage, MemeController.createMeme);
  app.get('/memes/featured', MemeController.getFeaturedMemes);

  app.post('/meme-walls', MemeController.createMemeWall);
  app.get('/meme-walls/:id', MemeController.getAMemeWall);
  app.put('/meme-walls/:wallId/:memeId', MemeController.addToMemeWall);
  app.delete('/meme-walls/:wallId/:memeId', MemeController.removeFromMemeWall);
};
