import { Router } from 'express';

import MemeController from '../controllers/MemeController';
import saveImage from '../middlewares/aws';
import { isLoggedIn } from '../middlewares/auth';

const router = Router();

router.get('/featured', MemeController.getFeaturedMemes);

router.get('/', isLoggedIn, MemeController.getMany);
router.post(
  '/',
  isLoggedIn,
  MemeController.create,
  saveImage,
  MemeController.save
);
router.get('/:memeId', isLoggedIn, MemeController.getAMeme);
router.put(
  '/:memeId/edit',
  isLoggedIn,
  MemeController.edit,
  saveImage,
  MemeController.save
);
router.put('/:memeId/react', isLoggedIn, MemeController.reactToMeme);
router.put('/:memeId/flag', isLoggedIn, MemeController.flagAMeme);

export default router;
