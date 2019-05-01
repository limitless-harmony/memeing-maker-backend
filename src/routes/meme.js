import { Router } from 'express';

import MemeController from '../controllers/MemeController';
import saveImage from '../middlewares/aws';
import { validateMeme } from '../middlewares/validators';

const router = Router();

router.get('/', MemeController.getMemes);
router.post('/', validateMeme, saveImage, MemeController.createMeme);
router.get('/featured', MemeController.getFeaturedMemes);

export default router;
