import { Router } from 'express';

import MemeController from '../controllers/MemeController';
import saveImage from '../middlewares/aws';
import { isLoggedIn } from '../middlewares/auth';

const router = Router();

router.get('/featured', MemeController.getFeaturedMemes);

router.get('/', isLoggedIn, MemeController.getMemes);
router.post('/', isLoggedIn, saveImage, MemeController.createMeme);
router.get('/:memeId', isLoggedIn, MemeController.getAMeme);
router.put('/:memeId/react', isLoggedIn, MemeController.reactToMeme);
router.put('/:memeId/flag', isLoggedIn, MemeController.flagAMeme);

export default router;
