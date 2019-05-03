import { Router } from 'express';

import MemeController from '../controllers/MemeController';
import saveImage from '../middlewares/aws';
import { validateMeme } from '../middlewares/validators';
import { isLoggedIn } from '../middlewares/auth';

const router = Router();

router.get('/featured', MemeController.getFeaturedMemes);

router.get('/', isLoggedIn, MemeController.getMemes);
router.post('/', isLoggedIn, validateMeme, saveImage, MemeController.createMeme);
router.put('/:memeId/react', isLoggedIn, MemeController.reactToMeme);
router.put('/:memeId/flag', isLoggedIn, MemeController.flagAMeme);

export default router;
