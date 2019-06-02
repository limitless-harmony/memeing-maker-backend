import { Router } from 'express';

import user from './user';
import meme from './meme';
import wall from './wall';
import auth from './auth';
import { isLoggedIn } from '../middlewares/auth';
import tryCatch from '../helpers/try-catch';
import MemeController from '../controllers/MemeController';

const router = Router();

// Public routes
router.get('/memes/featured', tryCatch(MemeController.getFeatured));
router.use('/auth', auth);

// Users routes (require login)
router.use('/users', isLoggedIn, user);
router.use('/memes', isLoggedIn, meme);
router.use('/walls', isLoggedIn, wall);

export default router;
